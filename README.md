# Web3 Signin Explainer

A Proof of Concept (PoC) app that demonstrates Web3 identity through wallet connection, message signing, and signature verification using ethers v6.

## Features

- Connect to MetaMask or other Web3 wallets
- Sign a predefined message
- Verify the signature against the connected address
- Educational content explaining Web3 identity concepts
- Clean, modern UI with Tailwind CSS and shadcn/ui components

## Tech Stack

- **Frontend**: Vite + React + TypeScript
- **Styling**: Tailwind CSS
- **Components**: shadcn/ui
- **Web3**: ethers v6
- **Icons**: Lucide React
- **Package Manager**: Yarn Berry

## Getting Started

### Prerequisites

- Node.js 18+
- Yarn (via Corepack)

### Installation

1. Enable Corepack:
   ```bash
   corepack enable
   ```

2. Install dependencies:
   ```bash
   yarn
   ```

3. Start the development server:
   ```bash
   yarn dev
   ```

4. Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
yarn build
```

### Preview Production Build

```bash
yarn preview
```

## Deployment

This project is configured for GitHub Pages deployment. The workflow automatically builds and deploys on pushes to the `main` branch.

To deploy:

1. Push your code to the `main` branch of your GitHub repository named `web3-identity-playground`.
2. Enable GitHub Pages in your repository settings.
3. The app will be available at `https://jakecastillo.github.io/web3-identity-playground/`.

## Usage

1. **Connect Wallet**: Click "Connect Wallet" to link your Web3 wallet.
2. **Sign Message**: Sign the predefined message to create a digital signature.
3. **Verify Signature**: Verify that the signature matches your address.

## Educational Content

The app includes explanations of:
- Wallet addresses as public identifiers
- Free message signing (no gas costs)
- Signature verification process
- Security best practices

## Security Notes

- This is a demonstration app only.
- No data is stored or transmitted.
- Always verify the source code before interacting with Web3 applications.

## License

MIT License
