## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Product Specifications

The Grants Council is funding a UI for the various Synthetix Wrappr contracts. The interface should be simple and allow for the minting/burning of synths.

UI Spec:

Connect Wallet button
Network Selector: Ethereum, Optimism
Drop down menu with Wrappr options: ETH Wrappr, LUSD Wrappr
Mint/Burn Selector
Fee Percentage display
Show available space to wrap/unwrap
Bonus: Stats button with popup displaying Wrappr TVL, etc

Docs:

https://docs.synthetix.io/integrations/ether-wrapper/

Contracts:

ETH Wrappr L1 - https://etherscan.io/address/0xCea392596F1AB7f1d6f8F241967094cA519E6129
LUSD Wrappr L1 - https://etherscan.io/address/0x7c22547779c8aa41bae79e03e8383a0befbcecf0
ETH Wrappr L2 - https://optimistic.etherscan.io/address/0x6202a3b0be1d222971e93aab084c6e584c29db70
LUSD Wrappr L2 - https://optimistic.etherscan.io/address/0x8a91e92fdd86e734781c38db52a390e1b99fba7c
