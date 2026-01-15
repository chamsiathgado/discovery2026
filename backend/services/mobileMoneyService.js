const axios = require('axios');
const crypto = require('crypto');
const Transaction = require('../models/Transaction');
const User = require('../models/User');

class MobileMoneyService {
  constructor() {
    this.baseURL = process.env.FLUTTERWAVE_BASE_URL || 'https://api.flutterwave.com/v3';
    this.secretKey = process.env.FLUTTERWAVE_SECRET_KEY;
    this.publicKey = process.env.FLUTTERWAVE_PUBLIC_KEY;
  }

  /**
   * Initiate a Mobile Money payment
   * @param {Object} paymentData - Payment details
   * @param {string} paymentData.transactionId - Internal transaction ID
   * @param {string} paymentData.userId - User ID
   * @param {number} paymentData.amount - Amount in FCFA
   * @param {string} paymentData.phoneNumber - Customer phone number
   * @param {string} paymentData.paymentMethod - 'mtn_mobile_money' or 'moov_money'
   * @param {number} paymentData.kwAmount - kW amount being purchased
   */
  async initiatePayment(paymentData) {
    try {
      // Create transaction record
      const transaction = new Transaction({
        transactionId: paymentData.transactionId,
        userId: paymentData.userId,
        paymentMethod: paymentData.paymentMethod,
        kwAmount: paymentData.kwAmount,
        amount: paymentData.amount,
        phoneNumber: paymentData.phoneNumber,
        status: 'pending'
      });

      await transaction.save();

      // Determine network based on phone number prefix
      const network = this.detectNetwork(paymentData.phoneNumber);

      if (!network) {
        throw new Error('Invalid phone number or unsupported network');
      }

      // Prepare Flutterwave payment payload
      const payload = {
        tx_ref: paymentData.transactionId,
        amount: paymentData.amount,
        currency: 'XOF',
        redirect_url: `${process.env.FRONTEND_URL}/payment/callback`,
        payment_options: paymentData.paymentMethod,
        customer: {
          email: paymentData.userEmail || 'customer@example.com',
          phone_number: paymentData.phoneNumber,
          name: paymentData.userName || 'Customer'
        },
        customizations: {
          title: 'KEMET - Achat d\'énergie électrique',
          description: `Achat de ${paymentData.kwAmount} kW`,
          logo: 'https://your-logo-url.com/logo.png'
        },
        meta: {
          kw_amount: paymentData.kwAmount,
          user_id: paymentData.userId
        }
      };

      // For demo purposes, simulate successful payment initiation
      // In production, make actual API call to Flutterwave
      console.log('Initiating payment with payload:', payload);

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Simulate successful response
      const mockResponse = {
        status: 'success',
        message: 'Payment initiated successfully',
        data: {
          id: Math.random().toString(36).substr(2, 9),
          tx_ref: paymentData.transactionId,
          flw_ref: `FLW-${Date.now()}`,
          amount: paymentData.amount,
          currency: 'XOF',
          status: 'pending'
        }
      };

      // Update transaction with gateway response
      transaction.gatewayTransactionId = mockResponse.data.flw_ref;
      transaction.gatewayResponse = mockResponse;
      transaction.status = 'processing';
      await transaction.save();

      return {
        success: true,
        transactionId: paymentData.transactionId,
        gatewayTransactionId: mockResponse.data.flw_ref,
        message: 'Payment initiated successfully'
      };

    } catch (error) {
      console.error('Payment initiation error:', error);

      // Update transaction status to failed
      if (paymentData.transactionId) {
        await Transaction.findOneAndUpdate(
          { transactionId: paymentData.transactionId },
          {
            status: 'failed',
            errorMessage: error.message,
            updatedAt: new Date()
          }
        );
      }

      throw error;
    }
  }

  /**
   * Check payment status
   * @param {string} transactionId - Internal transaction ID
   */
  async checkPaymentStatus(transactionId) {
    try {
      const transaction = await Transaction.findOne({ transactionId });

      if (!transaction) {
        throw new Error('Transaction not found');
      }

      // For demo purposes, simulate status updates
      // In production, query Flutterwave API for actual status
      let newStatus = transaction.status;

      if (transaction.status === 'processing') {
        // Simulate random status progression (80% success rate)
        const success = Math.random() > 0.2;
        newStatus = success ? 'completed' : 'failed';
      }

      // Update transaction status
      transaction.status = newStatus;
      transaction.processedAt = new Date();
      await transaction.save();

      // If payment completed, credit user account
      if (newStatus === 'completed') {
        await this.creditUserAccount(transaction.userId, transaction.kwAmount);
      }

      return {
        success: true,
        transactionId,
        status: newStatus,
        kwAmount: transaction.kwAmount,
        amount: transaction.amount
      };

    } catch (error) {
      console.error('Status check error:', error);
      throw error;
    }
  }

  /**
   * Handle payment webhook from gateway
   * @param {Object} webhookData - Webhook payload
   */
  async handleWebhook(webhookData) {
    try {
      const { tx_ref, status, amount, currency } = webhookData;

      const transaction = await Transaction.findOne({ transactionId: tx_ref });

      if (!transaction) {
        throw new Error('Transaction not found for webhook');
      }

      // Verify webhook signature (in production)
      // const isValidSignature = this.verifyWebhookSignature(webhookData);

      transaction.status = status === 'successful' ? 'completed' : 'failed';
      transaction.gatewayResponse = webhookData;
      transaction.processedAt = new Date();
      await transaction.save();

      // Credit user account if payment successful
      if (transaction.status === 'completed') {
        await this.creditUserAccount(transaction.userId, transaction.kwAmount);
      }

      return { success: true, message: 'Webhook processed successfully' };

    } catch (error) {
      console.error('Webhook processing error:', error);
      throw error;
    }
  }

  /**
   * Credit user account with kW
   * @param {string} userId - User ID
   * @param {number} kwAmount - Amount of kW to credit
   */
  async creditUserAccount(userId, kwAmount) {
    try {
      const user = await User.findById(userId);

      if (!user) {
        throw new Error('User not found');
      }

      user.kwBalance += kwAmount;
      await user.save();

      console.log(`Credited ${kwAmount} kW to user ${userId}. New balance: ${user.kwBalance}`);

      return { success: true, newBalance: user.kwBalance };

    } catch (error) {
      console.error('Account credit error:', error);
      throw error;
    }
  }

  /**
   * Detect mobile network from phone number
   * @param {string} phoneNumber - Phone number
   * @returns {string|null} Network name or null
   */
  detectNetwork(phoneNumber) {
    // Remove any non-numeric characters
    const cleanNumber = phoneNumber.replace(/\D/g, '');

    // Benin phone number patterns
    if (cleanNumber.startsWith('01')) {
      return 'mtn';
    } else if (cleanNumber.startsWith('02') || cleanNumber.startsWith('05')) {
      return 'moov';
    }

    return null;
  }

  /**
   * Verify webhook signature (for production)
   * @param {Object} payload - Webhook payload
   * @param {string} signature - Signature from headers
   */
  verifyWebhookSignature(payload, signature) {
    const expectedSignature = crypto
      .createHmac('sha256', this.secretKey)
      .update(JSON.stringify(payload))
      .digest('hex');

    return expectedSignature === signature;
  }

  /**
   * Get user's transaction history
   * @param {string} userId - User ID
   * @param {number} limit - Number of transactions to return
   */
  async getUserTransactions(userId, limit = 10) {
    try {
      const transactions = await Transaction
        .find({ userId })
        .sort({ createdAt: -1 })
        .limit(limit)
        .populate('userId', 'name email');

      return {
        success: true,
        transactions: transactions.map(tx => ({
          id: tx.transactionId,
          kwAmount: tx.kwAmount,
          amount: tx.amount,
          paymentMethod: tx.paymentMethod,
          status: tx.status,
          createdAt: tx.createdAt,
          processedAt: tx.processedAt
        }))
      };

    } catch (error) {
      console.error('Get user transactions error:', error);
      throw error;
    }
  }
}

module.exports = new MobileMoneyService();