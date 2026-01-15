const express = require('express');
const { body, validationResult } = require('express-validator');
const mobileMoneyService = require('../services/mobileMoneyService');
const Transaction = require('../models/Transaction');
const User = require('../models/User');
const { auth, requireClient, requireAdmin, requireOwnership } = require('../middleware/auth');

const router = express.Router();

// Constants
const KW_PRICE = 500; // FCFA per kW

// @route   POST /api/payments/initiate
// @desc    Initiate a mobile money payment
// @access  Private (Clients only)
router.post('/initiate', [
  auth,
  requireClient, // Only clients can initiate payments
  body('kwAmount').isInt({ min: 1, max: 1000 }).withMessage('kW amount must be between 1 and 1000'),
  body('paymentMethod').isIn(['mtn_mobile_money', 'moov_money']).withMessage('Invalid payment method'),
  body('phoneNumber').isLength({ min: 8, max: 15 }).withMessage('Invalid phone number')
], async (req, res) => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { kwAmount, paymentMethod, phoneNumber } = req.body;
    const userId = req.user.id;

    // Calculate amount
    const amount = kwAmount * KW_PRICE;

    // Generate transaction ID
    const transactionId = `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Get user details
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check for duplicate pending transactions
    const existingTransaction = await Transaction.findOne({
      userId,
      status: { $in: ['pending', 'processing'] },
      createdAt: { $gte: new Date(Date.now() - 5 * 60 * 1000) } // Last 5 minutes
    });

    if (existingTransaction) {
      return res.status(400).json({
        success: false,
        message: 'You have a pending transaction. Please wait before initiating a new payment.'
      });
    }

    // Initiate payment
    const paymentResult = await mobileMoneyService.initiatePayment({
      transactionId,
      userId,
      amount,
      phoneNumber,
      paymentMethod,
      kwAmount,
      userEmail: user.email,
      userName: user.name
    });

    res.json({
      success: true,
      message: 'Payment initiated successfully',
      data: {
        transactionId,
        amount,
        kwAmount,
        paymentMethod,
        status: 'processing'
      }
    });

  } catch (error) {
    console.error('Payment initiation error:', error);
    res.status(500).json({
      success: false,
      message: 'Payment initiation failed',
      error: error.message
    });
  }
});

// @route   GET /api/payments/status/:transactionId
// @desc    Check payment status
// @access  Private (Clients: own transactions, Admins: all)
router.get('/status/:transactionId', auth, async (req, res) => {
  try {
    const { transactionId } = req.params;
    const userId = req.user.id;

    // Find transaction
    const transaction = await Transaction.findOne({ transactionId });

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found'
      });
    }

    // Check permissions: clients can only check their own transactions
    if (req.user.role === 'client' && transaction.userId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only check your own transactions.'
      });
    }

    // Check payment status
    const statusResult = await mobileMoneyService.checkPaymentStatus(transactionId);

    res.json({
      success: true,
      data: statusResult
    });

  } catch (error) {
    console.error('Status check error:', error);
    res.status(500).json({
      success: false,
      message: 'Status check failed',
      error: error.message
    });
  }
});

// @route   GET /api/payments/history
// @desc    Get payment history
// @access  Private (Clients: own history, Admins: all transactions)
router.get('/history', auth, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    let query = {};

    // Clients can only see their own transactions
    if (req.user.role === 'client') {
      query.userId = req.user.id;
    }
    // Admins can see all transactions

    const transactions = await Transaction
      .find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate('userId', 'name email');

    const result = transactions.map(tx => ({
      id: tx.transactionId,
      kwAmount: tx.kwAmount,
      amount: tx.amount,
      paymentMethod: tx.paymentMethod,
      status: tx.status,
      createdAt: tx.createdAt,
      processedAt: tx.processedAt,
      ...(req.user.role === 'administrateur' && {
        user: {
          id: tx.userId._id,
          name: tx.userId.name,
          email: tx.userId.email
        }
      })
    }));

    res.json({
      success: true,
      data: result
    });

  } catch (error) {
    console.error('History fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch payment history',
      error: error.message
    });
  }
});

// @route   POST /api/payments/webhook
// @desc    Handle payment gateway webhooks
// @access  Public (but should be secured with IP whitelist in production)
router.post('/webhook', async (req, res) => {
  try {
    const webhookData = req.body;

    console.log('Received webhook:', webhookData);

    // Process webhook
    const result = await mobileMoneyService.handleWebhook(webhookData);

    res.json(result);

  } catch (error) {
    console.error('Webhook processing error:', error);
    res.status(500).json({
      success: false,
      message: 'Webhook processing failed',
      error: error.message
    });
  }
});

// @route   POST /api/payments/admin/adjust-balance
// @desc    Adjust user kW balance (Admin only)
// @access  Private (Admin only)
router.post('/admin/adjust-balance', [
  auth,
  requireAdmin,
  body('userId').isMongoId().withMessage('Invalid user ID'),
  body('adjustment').isInt().withMessage('Adjustment must be an integer'),
  body('reason').isLength({ min: 5 }).withMessage('Reason is required (min 5 characters)')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array()
      });
    }

    const { userId, adjustment, reason } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const oldBalance = user.kwBalance;
    user.kwBalance += adjustment;

    // Ensure balance doesn't go negative
    if (user.kwBalance < 0) {
      user.kwBalance = 0;
    }

    await user.save();

    // Create an adjustment transaction record
    const adjustmentTransaction = new Transaction({
      transactionId: `ADJ-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      userId,
      type: adjustment > 0 ? 'purchase' : 'refund',
      paymentMethod: 'admin_adjustment',
      kwAmount: Math.abs(adjustment),
      amount: Math.abs(adjustment) * KW_PRICE,
      status: 'completed',
      phoneNumber: user.phoneNumber || 'N/A',
      processedAt: new Date()
    });

    await adjustmentTransaction.save();

    res.json({
      success: true,
      message: 'Balance adjusted successfully',
      data: {
        userId,
        oldBalance,
        newBalance: user.kwBalance,
        adjustment,
        reason,
        transactionId: adjustmentTransaction.transactionId
      }
    });

  } catch (error) {
    console.error('Balance adjustment error:', error);
    res.status(500).json({
      success: false,
      message: 'Balance adjustment failed',
      error: error.message
    });
  }
});

// @route   GET /api/payments/admin/stats
// @desc    Get payment statistics (Admin only)
// @access  Private (Admin only)
router.get('/admin/stats', [auth, requireAdmin], async (req, res) => {
  try {
    const totalTransactions = await Transaction.countDocuments();
    const successfulTransactions = await Transaction.countDocuments({ status: 'completed' });
    const totalRevenue = await Transaction.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    const revenue = totalRevenue.length > 0 ? totalRevenue[0].total : 0;

    res.json({
      success: true,
      data: {
        totalTransactions,
        successfulTransactions,
        successRate: totalTransactions > 0 ? (successfulTransactions / totalTransactions * 100).toFixed(2) : 0,
        totalRevenue: revenue,
        totalKwSold: await Transaction.aggregate([
          { $match: { status: 'completed' } },
          { $group: { _id: null, total: { $sum: '$kwAmount' } } }
        ]).then(result => result.length > 0 ? result[0].total : 0)
      }
    });

  } catch (error) {
    console.error('Stats fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch statistics',
      error: error.message
    });
  }
});

// @route   GET /api/payments/calculate
// @desc    Calculate payment amount for kW
// @access  Public
router.get('/calculate', (req, res) => {
  try {
    const { kwAmount } = req.query;

    if (!kwAmount || isNaN(kwAmount) || kwAmount < 1) {
      return res.status(400).json({
        success: false,
        message: 'Invalid kW amount'
      });
    }

    const amount = parseInt(kwAmount) * KW_PRICE;

    res.json({
      success: true,
      data: {
        kwAmount: parseInt(kwAmount),
        unitPrice: KW_PRICE,
        totalAmount: amount,
        currency: 'XOF'
      }
    });

  } catch (error) {
    console.error('Calculation error:', error);
    res.status(500).json({
      success: false,
      message: 'Calculation failed'
    });
  }
});

module.exports = router;