# YataiPay

This is a NextJS application called YataiPay. It allows users to manage a Solana wallet, generate QR codes for payments, and view a map of merchants accepting Solana.

The application uses Next.js with the App Router, TypeScript, ShadCN UI components, and Tailwind CSS.

## Getting Started

First, install the dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:9002](http://localhost:9002) (or the port specified in your `package.json` dev script) with your browser to see the result.

You can start editing the page by modifying `src/app/page.tsx`. The application's pages and components are located in the `src` directory.

## Core Features

- **Solana Wallet Integration**: Create and manage a Solana wallet.
- **QR Code Generation**: Generate QR codes for payment transactions.
- **Merchant Map**: View merchants that accept Solana payments.

## Environment Variables

If you plan to use the Google Maps feature, you will need to set up Google Maps API keys:
- `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`: Your Google Maps JavaScript API key.
- `NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID`: (Optional) Your Google Maps Map ID for custom map styles.

Create a `.env.local` file in the root of your project and add your keys:
```
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=YOUR_API_KEY_HERE
NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID=YOUR_MAP_ID_HERE
```

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!
