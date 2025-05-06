'use client';

import { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react'; // Changed from QRCode to QRCodeSVG
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import type { SolanaWallet } from '@/services/solana';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";

export default function QrCodePage() {
  const [wallet, setWallet] = useState<SolanaWallet | null>(null);
  const [amount, setAmount] = useState('');
  const [qrValue, setQrValue] = useState<string | null>(null);

  // Load wallet from local storage
  useEffect(() => {
    const storedWallet = localStorage.getItem('solanaWallet');
    if (storedWallet) {
      try {
        setWallet(JSON.parse(storedWallet));
      } catch (error) {
        console.error('Failed to parse stored wallet:', error);
        localStorage.removeItem('solanaWallet');
      }
    }
  }, []);

  const generateQrCode = () => {
    if (!wallet) {
      // Handle case where wallet is not loaded yet
      alert('Please create or load a wallet first.');
      return;
    }
    const paymentAmount = parseFloat(amount);
    if (isNaN(paymentAmount) || paymentAmount <= 0) {
      alert('Please enter a valid positive amount.');
      return;
    }

    // Simple format: solana:<address>?amount=<amount>
    // More complex formats exist (like Solana Pay spec), but this is basic.
    const value = `solana:${wallet.address}?amount=${paymentAmount}`;
    setQrValue(value);
  };

  if (!wallet) {
    return (
       <Alert>
        <Terminal className="h-4 w-4" />
        <AlertTitle>No Wallet Found</AlertTitle>
        <AlertDescription>
          Please create or connect a Solana wallet on the Wallet page before generating a QR code.
        </AlertDescription>
      </Alert>
    )
  }


  return (
    <div className="container mx-auto py-8 space-y-8">
      <h1 className="text-3xl font-bold">Generate Payment QR Code</h1>

      <Card>
        <CardHeader>
          <CardTitle>Request Payment</CardTitle>
          <CardDescription>Enter the amount you want to request via QR code.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="amount">Amount (SOL)</Label>
            <Input
              id="amount"
              type="number"
              placeholder="0.0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              step="any"
              min="0"
            />
          </div>
           <p className="text-sm text-muted-foreground">Your Wallet Address: <span className="font-mono">{wallet.address}</span></p>
          <Button onClick={generateQrCode} disabled={!amount}>
            Generate QR Code
          </Button>
        </CardContent>
      </Card>

      {qrValue && (
        <Card className="flex flex-col items-center">
          <CardHeader>
            <CardTitle>Scan to Pay</CardTitle>
             <CardDescription>Scan this QR code to send {amount} SOL to {wallet.address}</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <QRCodeSVG // Changed from QRCode to QRCodeSVG
              value={qrValue}
              size={256} // Adjust size as needed
              level={"H"} // Error correction level
              includeMargin={true}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
