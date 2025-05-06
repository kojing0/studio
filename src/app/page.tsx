import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Wallet, QrCode, Map } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] space-y-8 text-center">
      <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-5xl md:text-6xl">
        Welcome to YataiPay
      </h1>
      <p className="max-w-2xl text-lg text-muted-foreground sm:text-xl">
        The seamless way to make and accept payments using Solana blockchain technology via simple QR codes.
      </p>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3 max-w-4xl w-full">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-center gap-2">
              <Wallet className="text-primary" /> Solana Wallet
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Create and manage your Solana wallet directly within the app. Securely store, send, and receive SOL.
            </CardDescription>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-center gap-2">
              <QrCode className="text-primary" /> QR Code Payments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Generate unique QR codes to request payments or scan codes to send SOL instantly. Fast and easy transactions.
            </CardDescription>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-center gap-2">
              <Map className="text-primary" /> Merchant Map
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Discover nearby merchants and businesses that accept Solana payments through an interactive map.
            </CardDescription>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
