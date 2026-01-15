import { useState } from 'react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { Alert, AlertDescription } from '@/app/components/ui/alert';
import { Badge } from '@/app/components/ui/badge';
import { Separator } from '@/app/components/ui/separator';
import {
  CreditCard,
  Smartphone,
  CheckCircle,
  XCircle,
  Clock,
  Zap,
  Calculator,
  Phone
} from 'lucide-react';

interface MobileMoneyPaymentProps {
  user: {
    name: string;
    email: string;
    role: string;
    kwBalance: number;
  };
  onBalanceUpdate: (newBalance: number) => void;
}

type PaymentProvider = 'mtn' | 'moov';
type PaymentStatus = 'idle' | 'processing' | 'success' | 'failed';

interface PaymentTransaction {
  id: string;
  kwAmount: number;
  amount: number; // FCFA
  provider: PaymentProvider;
  status: PaymentStatus;
  timestamp: Date;
  phoneNumber?: string;
}

const KW_PRICE = 500; // FCFA per kW

export function MobileMoneyPayment({ user, onBalanceUpdate }: MobileMoneyPaymentProps) {
  const [kwAmount, setKwAmount] = useState<number>(5);
  const [selectedProvider, setSelectedProvider] = useState<PaymentProvider>('mtn');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('idle');
  const [currentTransaction, setCurrentTransaction] = useState<PaymentTransaction | null>(null);
  const [paymentHistory, setPaymentHistory] = useState<PaymentTransaction[]>([]);

  // Calculate total amount
  const totalAmount = kwAmount * KW_PRICE;

  // Preset kW options
  const kwOptions = [1, 5, 10, 20, 50, 100];

  const handleKwSelection = (amount: number) => {
    setKwAmount(amount);
  };

  const handlePayment = async () => {
    if (!phoneNumber || phoneNumber.length < 8) {
      alert('Veuillez entrer un numéro de téléphone valide');
      return;
    }

    setPaymentStatus('processing');

    // Create transaction
    const transaction: PaymentTransaction = {
      id: `TXN-${Date.now()}`,
      kwAmount,
      amount: totalAmount,
      provider: selectedProvider,
      status: 'processing',
      timestamp: new Date(),
      phoneNumber
    };

    setCurrentTransaction(transaction);

    try {
      // Simulate API call to payment gateway
      const response = await initiateMobileMoneyPayment(transaction);

      if (response.success) {
        // Poll for payment status (in real implementation, use webhooks)
        pollPaymentStatus(transaction.id);
      } else {
        setPaymentStatus('failed');
        transaction.status = 'failed';
        setPaymentHistory(prev => [transaction, ...prev]);
      }
    } catch (error) {
      console.error('Payment error:', error);
      setPaymentStatus('failed');
      if (transaction) {
        transaction.status = 'failed';
        setPaymentHistory(prev => [transaction, ...prev]);
      }
    }
  };

  const pollPaymentStatus = async (transactionId: string) => {
    // Simulate polling (in real implementation, use webhooks)
    setTimeout(async () => {
      try {
        const statusResponse = await checkPaymentStatus(transactionId);

        if (statusResponse.status === 'success') {
          setPaymentStatus('success');
          onBalanceUpdate(user.kwBalance + kwAmount);

          if (currentTransaction) {
            const completedTransaction = { ...currentTransaction, status: 'success' as PaymentStatus };
            setPaymentHistory(prev => [completedTransaction, ...prev]);
            setCurrentTransaction(null);
          }
        } else if (statusResponse.status === 'failed') {
          setPaymentStatus('failed');
          if (currentTransaction) {
            const failedTransaction = { ...currentTransaction, status: 'failed' as PaymentStatus };
            setPaymentHistory(prev => [failedTransaction, ...prev]);
            setCurrentTransaction(null);
          }
        } else {
          // Continue polling
          pollPaymentStatus(transactionId);
        }
      } catch (error) {
        console.error('Status check error:', error);
        setPaymentStatus('failed');
      }
    }, 3000); // Check every 3 seconds
  };

  const resetPayment = () => {
    setPaymentStatus('idle');
    setCurrentTransaction(null);
    setPhoneNumber('');
  };

  return (
    <div className="space-y-6">
      {/* Current Balance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-500" />
            Solde actuel
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-emerald-600">
            {user.kwBalance} kW
          </div>
          <p className="text-sm text-gray-600 mt-1">
            Équivalent à {user.kwBalance * KW_PRICE} FCFA
          </p>
        </CardContent>
      </Card>

      {/* Payment Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Acheter des kW
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* kW Selection */}
          <div>
            <Label className="text-base font-semibold">Nombre de kW à acheter</Label>
            <div className="grid grid-cols-3 gap-2 mt-3">
              {kwOptions.map((option) => (
                <Button
                  key={option}
                  variant={kwAmount === option ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleKwSelection(option)}
                  disabled={paymentStatus === 'processing'}
                >
                  {option} kW
                </Button>
              ))}
            </div>
            <div className="mt-3">
              <Label htmlFor="custom-kw">Ou entrer une valeur personnalisée</Label>
              <Input
                id="custom-kw"
                type="number"
                min="1"
                max="1000"
                value={kwAmount}
                onChange={(e) => setKwAmount(parseInt(e.target.value) || 0)}
                disabled={paymentStatus === 'processing'}
                className="mt-1"
              />
            </div>
          </div>

          <Separator />

          {/* Amount Display */}
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">kW sélectionnés</p>
                <p className="text-2xl font-bold">{kwAmount} kW</p>
              </div>
              <Calculator className="w-8 h-8 text-gray-400" />
            </div>
            <div className="flex items-center justify-between mt-4">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Montant total</p>
                <p className="text-2xl font-bold text-emerald-600">
                  {totalAmount.toLocaleString()} FCFA
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">Prix unitaire</p>
                <p className="text-sm font-semibold">{KW_PRICE} FCFA/kW</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Payment Provider Selection */}
          <div>
            <Label className="text-base font-semibold">Moyen de paiement</Label>
            <Select
              value={selectedProvider}
              onValueChange={(value: PaymentProvider) => setSelectedProvider(value)}
              disabled={paymentStatus === 'processing'}
            >
              <SelectTrigger className="mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mtn">
                  <div className="flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-yellow-500" />
                    MTN Mobile Money
                  </div>
                </SelectItem>
                <SelectItem value="moov">
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-orange-500" />
                    Moov Money
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Phone Number */}
          <div>
            <Label htmlFor="phone">Numéro de téléphone {selectedProvider.toUpperCase()}</Label>
            <Input
              id="phone"
              type="tel"
              placeholder={`Ex: ${selectedProvider === 'mtn' ? '01' : '02'}XXXXXXXX`}
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              disabled={paymentStatus === 'processing'}
              className="mt-1"
            />
            <p className="text-xs text-gray-500 mt-1">
              Entrez le numéro associé à votre compte {selectedProvider.toUpperCase()} Money
            </p>
          </div>

          {/* Payment Status */}
          {paymentStatus === 'processing' && (
            <Alert>
              <Clock className="h-4 w-4" />
              <AlertDescription>
                Paiement en cours... Veuillez confirmer la transaction sur votre téléphone.
              </AlertDescription>
            </Alert>
          )}

          {paymentStatus === 'success' && (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                Paiement réussi ! {kwAmount} kW ont été ajoutés à votre compte.
              </AlertDescription>
            </Alert>
          )}

          {paymentStatus === 'failed' && (
            <Alert variant="destructive">
              <XCircle className="h-4 w-4" />
              <AlertDescription>
                Échec du paiement. Veuillez réessayer ou contacter le support.
              </AlertDescription>
            </Alert>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            {paymentStatus === 'idle' && (
              <Button
                onClick={handlePayment}
                className="flex-1"
                size="lg"
                disabled={!phoneNumber || kwAmount < 1}
              >
                <CreditCard className="w-4 h-4 mr-2" />
                Payer {totalAmount.toLocaleString()} FCFA
              </Button>
            )}

            {paymentStatus === 'success' && (
              <Button onClick={resetPayment} className="flex-1" variant="outline">
                Effectuer un nouveau paiement
              </Button>
            )}

            {paymentStatus === 'failed' && (
              <Button onClick={resetPayment} className="flex-1" variant="outline">
                Réessayer
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Payment History */}
      {paymentHistory.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Historique des paiements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {paymentHistory.slice(0, 5).map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${
                      transaction.status === 'success' ? 'bg-green-500' :
                      transaction.status === 'failed' ? 'bg-red-500' : 'bg-yellow-500'
                    }`} />
                    <div>
                      <p className="font-semibold">{transaction.kwAmount} kW</p>
                      <p className="text-sm text-gray-600">
                        {transaction.amount.toLocaleString()} FCFA • {transaction.provider.toUpperCase()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant={
                      transaction.status === 'success' ? 'default' :
                      transaction.status === 'failed' ? 'destructive' : 'secondary'
                    }>
                      {transaction.status === 'success' ? 'Réussi' :
                       transaction.status === 'failed' ? 'Échoué' : 'En cours'}
                    </Badge>
                    <p className="text-xs text-gray-500 mt-1">
                      {transaction.timestamp.toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Mock API functions (replace with real implementation)
async function initiateMobileMoneyPayment(transaction: PaymentTransaction) {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Simulate success/failure (90% success rate)
  const success = Math.random() > 0.1;

  return {
    success,
    transactionId: transaction.id,
    message: success ? 'Payment initiated' : 'Payment failed'
  };
}

async function checkPaymentStatus(transactionId: string) {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Simulate status progression
  const statuses: PaymentStatus[] = ['processing', 'success', 'failed'];
  const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];

  return {
    status: randomStatus,
    transactionId
  };
}