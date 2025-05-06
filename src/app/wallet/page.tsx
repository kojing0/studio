'use client';

import type React from 'react';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { createSolanaWallet, getSolanaWalletBalance, sendSolana } from '@/services/solana';
import type { SolanaWallet, SolanaTransaction } from '@/services/solana';
import { Loader2, Copy } from 'lucide-react';

export default function WalletPage() {
  const [wallet, setWallet] = useState<SolanaWallet | null>(null);
  const [loading, setLoading] = useState({
    create: false,
    balance: false,
    send: false,
  });
  const [recipientAddress, setRecipientAddress] = useState('');
  const [sendAmount, setSendAmount] = useState('');
  const { toast } = useToast();

  // Effect to load wallet from local storage (if exists) on mount
  useEffect(() => {
    const storedWallet = localStorage.getItem('solanaWallet');
    if (storedWallet) {
      try {
        const parsedWallet: SolanaWallet = JSON.parse(storedWallet);
        setWallet(parsedWallet);
        // Optionally fetch balance on load if wallet exists
         handleGetBalance(parsedWallet.address);
      } catch (error) {
        console.error('Failed to parse stored wallet:', error);
        localStorage.removeItem('solanaWallet'); // Clear invalid data
      }
    }
  }, []); // Empty dependency array ensures this runs only once on mount

  const handleCreateWallet = async () => {
    setLoading((prev) => ({ ...prev, create: true }));
    try {
      const newWallet = await createSolanaWallet();
      setWallet(newWallet);
      localStorage.setItem('solanaWallet', JSON.stringify(newWallet)); // Store wallet locally
      toast({
        title: 'Wallet Created',
        description: `Address: ${newWallet.address}`,
      });
    } catch (error) {
      console.error('Error creating wallet:', error);
      toast({
        title: 'Error',
        description: 'Failed to create wallet.',
        variant: 'destructive',
      });
    } finally {
      setLoading((prev) => ({ ...prev, create: false }));
    }
  };

  const handleGetBalance = async (address: string) => {
    setLoading((prev) => ({ ...prev, balance: true }));
    try {
      const balance = await getSolanaWalletBalance(address);
      setWallet((prevWallet) => {
        if (!prevWallet) return null;
        const updatedWallet = { ...prevWallet, balance };
        localStorage.setItem('solanaWallet', JSON.stringify(updatedWallet)); // Update stored wallet
        return updatedWallet;
      });
      toast({
        title: 'Balance Updated',
        description: `Current balance: ${balance} SOL`,
      });
    } catch (error) {
      console.error('Error getting balance:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch balance.',
        variant: 'destructive',
      });
    } finally {
      setLoading((prev) => ({ ...prev, balance: false }));
    }
  };

  const handleSendSolana = async () => {
    if (!wallet || !recipientAddress || !sendAmount) {
      toast({
        title: 'Error',
        description: 'Please fill in all fields.',
        variant: 'destructive',
      });
      return;
    }

    const amount = parseFloat(sendAmount);
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: 'Error',
        description: 'Invalid amount.',
        variant: 'destructive',
      });
      return;
    }

    setLoading((prev) => ({ ...prev, send: true }));
    try {
      const transaction: SolanaTransaction = await sendSolana(wallet.address, recipientAddress, amount);
      toast({
        title: 'Transaction Sent',
        description: `Transaction ID: ${transaction.transactionId} (${transaction.status})`,
      });
      // Refresh balance after sending
      await handleGetBalance(wallet.address);
      setRecipientAddress('');
      setSendAmount('');
    } catch (error) {
      console.error('Error sending SOL:', error);
      toast({
        title: 'Error',
        description: 'Failed to send SOL.',
        variant: 'destructive',
      });
    } finally {
      setLoading((prev) => ({ ...prev, send: false }));
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({ title: 'Copied!', description: 'Wallet address copied to clipboard.' });
    }).catch(err => {
      console.error('Failed to copy text: ', err);
      toast({ title: 'Error', description: 'Failed to copy address.', variant: 'destructive' });
    });
  };


  return (
    <div className="container mx-auto py-8 space-y-8">
      <h1 className="text-3xl font-bold">Solana Wallet</h1>

      {!wallet ? (
        <Card>
          <CardHeader>
            <CardTitle>Create Wallet</CardTitle>
            <CardDescription>Create a new Solana wallet to get started.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleCreateWallet} disabled={loading.create}>
              {loading.create && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Wallet
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Wallet Details</CardTitle>
              <CardDescription>Your Solana wallet address and balance.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Label htmlFor="walletAddress" className="w-24">Address:</Label>
                <Input id="walletAddress" value={wallet.address} readOnly className="flex-1 font-mono text-sm" />
                 <Button variant="ghost" size="icon" onClick={() => copyToClipboard(wallet.address)} aria-label="Copy address">
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex items-center space-x-2">
                <Label className="w-24">Balance:</Label>
                <span className="font-semibold text-lg">{wallet.balance.toFixed(4)} SOL</span>
                <Button variant="outline" size="sm" onClick={() => handleGetBalance(wallet.address)} disabled={loading.balance}>
                  {loading.balance && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Refresh Balance
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Send SOL</CardTitle>
              <CardDescription>Send Solana to another wallet address.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="recipientAddress">Recipient Address</Label>
                <Input
                  id="recipientAddress"
                  placeholder="Enter recipient wallet address"
                  value={recipientAddress}
                  onChange={(e) => setRecipientAddress(e.target.value)}
                  className="font-mono"
                />
              </div>
              <div>
                <Label htmlFor="sendAmount">Amount (SOL)</Label>
                <Input
                  id="sendAmount"
                  type="number"
                  placeholder="0.0"
                  value={sendAmount}
                  onChange={(e) => setSendAmount(e.target.value)}
                  step="any"
                  min="0"
                />
              </div>
              <Button onClick={handleSendSolana} disabled={loading.send || !recipientAddress || !sendAmount}>
                {loading.send && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Send SOL
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
