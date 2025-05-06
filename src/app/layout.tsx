import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  SidebarInset,
} from '@/components/ui/sidebar';
import { Toaster } from '@/components/ui/toaster';
import Link from 'next/link';
import { Wallet, QrCode, Map } from 'lucide-react';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'SolanaPay',
  description: 'Pay with Solana using QR codes',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <SidebarProvider>
          <Sidebar>
            <SidebarHeader className="flex items-center justify-between">
              <Link href="/">
                <h1 className="text-xl font-semibold text-primary">SolanaPay</h1>
              </Link>
            </SidebarHeader>
            <SidebarContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <Link href="/wallet" passHref legacyBehavior>
                    <SidebarMenuButton tooltip="Wallet">
                      <Wallet />
                      <span>Wallet</span>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <Link href="/qr-code" passHref legacyBehavior>
                    <SidebarMenuButton tooltip="QR Code">
                      <QrCode />
                      <span>QR Code</span>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <Link href="/map" passHref legacyBehavior>
                    <SidebarMenuButton tooltip="Merchant Map">
                      <Map />
                      <span>Merchant Map</span>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarContent>
          </Sidebar>
          <SidebarInset>
            <header className="flex items-center p-4 border-b md:hidden">
                 <SidebarTrigger />
                 <Link href="/" className="ml-4">
                    <h1 className="text-xl font-semibold text-primary">SolanaPay</h1>
                 </Link>
            </header>
            <main className="flex-1 p-4 md:p-6">{children}</main>
          </SidebarInset>
        </SidebarProvider>
        <Toaster />
      </body>
    </html>
  );
}
