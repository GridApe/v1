'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { CheckCircle, XCircle, ArrowLeft, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import axios from 'axios';

export default function PaymentStatusPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<'success' | 'failed' | null>(null);
  const [txRef, setTxRef] = useState<string | null>(null);
  const [transactionId, setTransactionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const paymentStatus = searchParams.get('status');
    const ref = searchParams.get('tx_ref');
    const txId = searchParams.get('transaction_id');

    if (paymentStatus && ref && txId) {
      setStatus(paymentStatus === 'successful' ? 'success' : 'failed');
      setTxRef(ref);
      setTransactionId(txId);

      //   axios.post(`/api/payment/verify`, { tx_ref: ref, transaction_id: txId })
      //     .then((res) => console.log("Verification Response:", res.data))
      //     .catch((err) => console.error("Verification Error:", err))
      //     .finally(() => setIsLoading(false));
      setIsLoading(false);
    }
  }, [searchParams]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <RefreshCcw className="h-8 w-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-center items-center min-h-screen p-4 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <Card className="w-full max-w-md shadow-xl bg-white dark:bg-gray-800">
        <CardHeader className="text-center space-y-4">
          {status === 'success' ? (
            <CheckCircle className="h-16 w-16 text-green-500 dark:text-green-400 mx-auto" />
          ) : (
            <XCircle className="h-16 w-16 text-red-500 dark:text-red-400 mx-auto" />
          )}
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {status === 'success' ? 'Payment Successful!' : 'Payment Failed'}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Transaction ID: <span className="font-semibold">{transactionId || 'N/A'}</span>
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Reference: <span className="font-semibold">{txRef || 'N/A'}</span>
          </p>
        </CardHeader>

        <CardContent className="space-y-4">
          {status === 'success' ? (
            <p className="text-center text-gray-600 dark:text-gray-300">
              Your subscription is now active. You will receive a confirmation email shortly.
            </p>
          ) : (
            <Alert className="bg-red-50 dark:bg-red-900/30 border-red-100 dark:border-red-900">
              <AlertDescription>
                Your payment could not be processed. This might be due to insufficient funds or a
                temporary issue with your payment method.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>

        <CardFooter className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            variant="outline"
            size="lg"
            onClick={() => router.push('/')}
            className="w-full sm:w-auto"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back Home
          </Button>
          <Button
            size="lg"
            onClick={() => router.push(status === 'success' ? '/dashboard' : '/pricing')}
            className={`w-full sm:w-auto ${
              status === 'success'
                ? 'bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700'
                : 'bg-primary hover:bg-primary/90'
            }`}
          >
            {status === 'success' ? 'Go to Dashboard' : 'Retry Payment'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
