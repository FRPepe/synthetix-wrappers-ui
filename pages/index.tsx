import { useState, useEffect } from "react";
import Head from "next/head";
import styled, { createGlobalStyle, css } from "styled-components";

import { ethers, utils, constants, ContractTransaction } from 'ethers';
import WalletConnectProvider from "@walletconnect/web3-provider";

import { ADDRESSES, ABIs } from '../contractData';

import styles from "../styles/Home.module.css";

import Header from "../sections/home/Header";
import Content from "../sections/home/Content";
import Footer from "../sections/home/Footer";
import Wallet from "../sections/home/WalletOverlay";
import TVLChart from "../sections/home/TVLChartOverlay";
import LoadingOverlay from "../sections/home/LoadingOverlay";
import ErrorMessage from "../sections/home/ErrorMessage";

declare var window: any;

const HomePage = () => {
  // UI
  const [showWalletOverlay, setShowWalletOverlay] = useState<boolean>(false);
  const [showTVLChartOverlay, setShowTVLChartOverlay] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>('');
  const [explorerLink, setExplorerLink] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const [inputValue, setInputValue] = useState<string>("");
  const [outputValue, setOutputValue] = useState<string>("");
  const [isMinting, setIsMinting] = useState<boolean>(true);

  // tx data
  const [inputCurrency, setInputCurrency] = useState<string>("WETH");
  const [outputCurrency, setOutputCurrency] = useState<string>("sETH");

  // wallet input
  const [walletType, setWalletType] = useState<string>('');
  const [originalProvider, setOriginalProvider] = useState<any>({});
  const [currentProvider, setCurrentProvider] = useState<ethers.providers.Web3Provider>();
  const [currentAccount, setCurrentAccount] = useState<string>("");
  const [currentChainId, setCurrentChainId] = useState<number>(0);

  // user balances & contract data
  const [userBalances, setUserBalances] = useState(
    {
      WETH: "0",
      sETH: "0",
      LUSD: "0",
      sUSD: "0"
    }
  );
  const [userApprovals, setUserApprovals] = useState(
    {
      WETH: "0",
      sETH: "0",
      LUSD: "0",
      sUSD: "0"
    }
  );
  const [ETHwrapperData, setETHwrapperData] = useState(
    {
      ETHmintFeeRate: "0",
      ETHburnFeeRate: "0",
      maxETH: "0",
      WETHreserves: "0",
      ETHcapacity: "0"
    }
  );
  const [USDwrapperData, setUSDwrapperData] = useState(
    {
      USDmintFeeRate: "0",
      USDburnFeeRate: "0",
      maxUSD: "0",
      LUSDreserves: "0",
      USDcapacity: "0"
    }
  );

  // TVL data

  interface WrapperEventObject {
    blockNumber: number;
    value: number;
  }

  const [ETHmintsLastMonthArray, setETHMintsLastMonthArray] = useState<WrapperEventObject[]>([]);
  const [ETHburnsLastMonthArray, setETHBurnsLastMonthArray] = useState<WrapperEventObject[]>([]);
  const [USDmintsLastMonthArray, setUSDMintsLastMonthArray] = useState<WrapperEventObject[]>([]);
  const [USDburnsLastMonthArray, setUSDBurnsLastMonthArray] = useState<WrapperEventObject[]>([]);
  const [latestBlockNumber, setLatestBlockNumber] = useState<number>(0);

  const connectWallet = async (providerInput: string) => {

    // close down wallet overlay
    setShowWalletOverlay(false);
    // open loading overlay
    setLoadingMessage('Web3 data loading...');

    setWalletType(providerInput);
    let originalProvider;
    let provider;
    if(providerInput == 'metamask') {
      originalProvider = window.ethereum;
      try {
        provider = new ethers.providers.Web3Provider(originalProvider, "any");
        await provider.send("eth_requestAccounts", []);
      } catch(error) {
        setLoadingMessage('');
        setErrorMessage('Could not connect to Web3 wallet.');
      }
    } else if(providerInput == 'walletconnect') {
      try {
        originalProvider = new WalletConnectProvider({
          rpc: {
            1: "https://mainnet.infura.io/v3/",
            10: "https://mainnet.optimism.io/"
          }
        });
        await originalProvider.enable();
        provider = new ethers.providers.Web3Provider(originalProvider, "any");
      } catch(error) {
        setLoadingMessage('');
        setErrorMessage('Could not connect to Web3 wallet.');
      }
    } else {
      return;
    }

    if(provider) {
      try {
        // initiate Web3 and fetch wallet data
        const accounts = await provider.listAccounts();
        const network = await provider.getNetwork();
        setOriginalProvider(originalProvider);
        setCurrentProvider(provider);
        if (accounts) setCurrentAccount(accounts[0]);
        setCurrentChainId(network.chainId);

        // instantiate contracts
        let SETH, WETH, SUSD, LUSD, EtherWrapper, LUSDwrapper;
        if (network.chainId == 1) { // Ethereum L1
          SETH = new ethers.Contract(ADDRESSES.ETHEREUM.SETH, ABIs.SETH, provider);
          WETH = new ethers.Contract(ADDRESSES.ETHEREUM.WETH, ABIs.WETH, provider);
          SUSD = new ethers.Contract(ADDRESSES.ETHEREUM.SUSD, ABIs.SUSD, provider);
          LUSD = new ethers.Contract(ADDRESSES.ETHEREUM.LUSD, ABIs.LUSD, provider);
          EtherWrapper = new ethers.Contract(ADDRESSES.ETHEREUM.ETHwrapper, ABIs.ETHwrapper, provider);
          LUSDwrapper = new ethers.Contract(ADDRESSES.ETHEREUM.LUSDwrapper, ABIs.LUSDwrapper, provider);
        } else if (network.chainId == 10) { // Optimism
          SETH = new ethers.Contract(ADDRESSES.OPTIMISM.SETH, ABIs.SETH, provider);
          WETH = new ethers.Contract(ADDRESSES.OPTIMISM.WETH, ABIs.WETH, provider);
          SUSD = new ethers.Contract(ADDRESSES.OPTIMISM.SUSD, ABIs.SUSD, provider);
          LUSD = new ethers.Contract(ADDRESSES.OPTIMISM.LUSD, ABIs.LUSD, provider);
          EtherWrapper = new ethers.Contract(ADDRESSES.OPTIMISM.ETHwrapper, ABIs.LUSDwrapper, provider);
          LUSDwrapper = new ethers.Contract(ADDRESSES.OPTIMISM.LUSDwrapper, ABIs.LUSDwrapper, provider);
        } else {
          setErrorMessage("Network not supported, please connect to the Ethereum Mainnet or the Optimism Mainnet.");
          setLoadingMessage('');
          setShowWalletOverlay(false);
          disconnectWallet();
          return;
        }

        // fetch balances & wrapper contract data
        const [
          WETHBalanceFetched,
          SETHBalanceFetched,
          LUSDBalanceFetched,
          SUSDBalanceFetched,
          WETHApprovalFetched,
          SETHApprovalFetched,
          LUSDApprovalFetched,
          SUSDApprovalFetched,
          ETHmintFeeRateFetched,
          ETHburnFeeRateFetched,
          maxETHFetched,
          WETHreservesFetched,
          ETHcapacityFetched,
          USDmintFeeRateFetched,
          USDburnFeeRateFetched,
          maxUSDFetched,
          LUSDreservesFetched,
          USDcapacityFetched
        ] = await Promise.all(
          [
            await WETH?.balanceOf(accounts[0]),
            await SETH?.balanceOf(accounts[0]),
            await LUSD?.balanceOf(accounts[0]),
            await SUSD?.balanceOf(accounts[0]),
            await WETH?.allowance(accounts[0], EtherWrapper?.address),
            await SETH?.allowance(accounts[0], EtherWrapper?.address),
            await LUSD?.allowance(accounts[0], LUSDwrapper?.address),
            await SUSD?.allowance(accounts[0], LUSDwrapper?.address),
            await EtherWrapper?.mintFeeRate(),
            await EtherWrapper?.burnFeeRate(),
            await EtherWrapper?.maxTokenAmount(),
            await EtherWrapper?.getReserves(),
            await EtherWrapper?.capacity(),
            await LUSDwrapper?.mintFeeRate(),
            await LUSDwrapper?.burnFeeRate(),
            await LUSDwrapper?.maxTokenAmount(),
            await LUSDwrapper?.getReserves(),
            await LUSDwrapper?.capacity(),
          ]
        );
        setUserBalances({
          WETH: utils.formatEther(WETHBalanceFetched),
          sETH: utils.formatEther(SETHBalanceFetched),
          LUSD: utils.formatEther(LUSDBalanceFetched),
          sUSD: utils.formatEther(SUSDBalanceFetched)
        });
        setUserApprovals({
          WETH: utils.formatEther(WETHApprovalFetched),
          sETH: utils.formatEther(SETHApprovalFetched),
          LUSD: utils.formatEther(LUSDApprovalFetched),
          sUSD: utils.formatEther(SUSDApprovalFetched)
        });
        setETHwrapperData({
          ETHmintFeeRate: utils.formatEther(ETHmintFeeRateFetched),
          ETHburnFeeRate: utils.formatEther(ETHburnFeeRateFetched),
          maxETH: utils.formatEther(maxETHFetched),
          WETHreserves: utils.formatEther(WETHreservesFetched),
          ETHcapacity: utils.formatEther(ETHcapacityFetched)
        });
        setUSDwrapperData({
          USDmintFeeRate: utils.formatEther(USDmintFeeRateFetched),
          USDburnFeeRate: utils.formatEther(USDburnFeeRateFetched),
          maxUSD: utils.formatEther(maxUSDFetched),
          LUSDreserves: utils.formatEther(LUSDreservesFetched),
          USDcapacity: utils.formatEther(USDcapacityFetched)
        });

        // stop displaying loading overlay
        setLoadingMessage('');

      } catch (error) {
        setErrorMessage('Could not fetch contract data.');
        disconnectWallet();
        // stop displaying loading overlay
        setLoadingMessage('');
      }
    }
  };

  const disconnectWallet = () => {
      setWalletType('');
      setCurrentProvider(undefined);
      setCurrentAccount("");
      setCurrentChainId(0);
      setUserBalances({
        WETH: "0",
        sETH: "0",
        LUSD: "0",
        sUSD: "0"
      });
      setUserApprovals({
        WETH: "0",
        sETH: "0",
        LUSD: "0",
        sUSD: "0"
      });
      setETHwrapperData({
        ETHmintFeeRate: "0",
        ETHburnFeeRate: "0",
        maxETH: "0",
        WETHreserves: "0",
        ETHcapacity: "0"
      });
      setUSDwrapperData({
        USDmintFeeRate: "0",
        USDburnFeeRate: "0",
        maxUSD: "0",
        LUSDreserves: "0",
        USDcapacity: "0"
      });
      setInputValue("0");
      setOutputValue("0");

  }

  const toggleNetwork = async (newChainId: number) => {

    if (currentProvider) {
      if (newChainId == 10 && currentProvider?.provider.request) {
        try {
          await currentProvider?.provider?.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: '0xa' }]
          });
        } catch (err: any) {
          if (err.code === 4902) {
            try {
              await currentProvider?.provider?.request({
                method: "wallet_addEthereumChain",
                params: [
                  {
                    chainId: '0xa',
                    chainName: "Optimism",
                    rpcUrls: ["https://mainnet.optimism.io/"],
                    blockExplorerUrls: ["https://optimistic.etherscan.io"],
                  },
                ]
              });
            } catch (error) {
              setErrorMessage('Could not switch to target network.');
              disconnectWallet();
            }
          }
        }
      } else if (newChainId == 1 && currentProvider?.provider.request) {
        try {
          await currentProvider?.provider?.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: '0x1' }]
          });
        } catch (err: any) {
          if (err.code === 4902) {
            try {
              await currentProvider?.provider?.request({
                method: "wallet_addEthereumChain",
                params: [
                  {
                    chainId: '1',
                    chainName: "Ethereum Mainnet",
                    rpcUrls: ["https://api.mycryptoapi.com/eth"],
                    blockExplorerUrls: ["https://etherscan.io"],
                  },
                ]
              });
            } catch (error) {
              setErrorMessage('Could not switch to target network.');
              disconnectWallet();
            }
          }
        }
      }
      await connectWallet(walletType);
    } else {
      setCurrentChainId(newChainId);
    }
  }

  const toggleMintOrBurn = () => {
    setIsMinting(!isMinting);
    setInputValue("");
    setOutputValue("");
    if (inputCurrency == 'WETH') {
      setInputCurrency('sETH');
      setOutputCurrency('WETH');
    } else if (inputCurrency == 'sETH') {
      setInputCurrency('WETH');
      setOutputCurrency('sETH');
    } else if (inputCurrency == 'LUSD') {
      setInputCurrency('sUSD');
      setOutputCurrency('LUSD');
    } else if (inputCurrency == 'sUSD') {
      setInputCurrency('LUSD');
      setOutputCurrency('sUSD');
    }
  }

  const handleInputValue = (e: any) => {
    const regex = /^[0-9]*[.,]?[0-9]*$/;
    if (e.target.value === '') {
      setInputValue("");
      setOutputValue("");
    } else if (regex.test(e.target.value)) {
      setInputValue(e.target.value);
      let newOutputValue = calculateInputOrOutputValue(e.target.value, true);
      setOutputValue(newOutputValue);
    }
  }

  const handleOutputValue = (e: any) => {
    const regex = /^[0-9]*[.,]?[0-9]*$/;
    if (e.target.value === '') {
      setInputValue("");
      setOutputValue("");
    } else if (regex.test(e.target.value)) {
      setOutputValue(e.target.value);
      let newInputValue = calculateInputOrOutputValue(e.target.value, false);
      setInputValue(newInputValue);
    }
  }

  const calculateInputOrOutputValue = (userEntry: string, isInput: boolean): string => {
    let newValue: string = '';
    if (isInput) {
      if (inputCurrency == 'WETH') {
        newValue = `${parseFloat(userEntry) * (10000 - parseFloat(ETHwrapperData.ETHmintFeeRate) * 10000) / 10000}`;
      } else if (inputCurrency == 'sETH') {
        newValue = `${parseFloat(userEntry) * (10000 - parseFloat(ETHwrapperData.ETHburnFeeRate) * 10000) / 10000}`;
      } else if (inputCurrency == 'LUSD') {
        newValue = `${parseFloat(userEntry) * (10000 - parseFloat(USDwrapperData.USDmintFeeRate) * 10000) / 10000}`;
      } else if (inputCurrency == 'sUSD') {
        newValue = `${parseFloat(userEntry) * (10000 - parseFloat(USDwrapperData.USDburnFeeRate) * 10000) / 10000}`;
      }
    } else {
      if (inputCurrency == 'WETH') {
        newValue = `${(10000 * parseFloat(userEntry)) / (10000 - parseFloat(ETHwrapperData.ETHmintFeeRate) * 10000)}`;
      } else if (inputCurrency == 'sETH') {
        newValue = `${(10000 * parseFloat(userEntry)) / (10000 - parseFloat(ETHwrapperData.ETHburnFeeRate) * 10000)}`;
      } else if (inputCurrency == 'LUSD') {
        newValue = `${(10000 * parseFloat(userEntry)) / (10000 - parseFloat(USDwrapperData.USDmintFeeRate) * 10000)}`;
      } else if (inputCurrency == 'sUSD') {
        newValue = `${parseFloat(userEntry) * (10000 - parseFloat(USDwrapperData.USDburnFeeRate) * 10000) / 10000}`;
      }
    }
    return newValue;
  }

  const handleMaxButton = () => {
    setInputValue(userBalances[inputCurrency as keyof typeof userBalances]);
    let outputValue = calculateInputOrOutputValue(userBalances[inputCurrency as keyof typeof userBalances], true);
    setOutputValue(outputValue);
  }

  const handleCurrency = (currency: string) => {
    setInputValue("0");
    setOutputValue("0");
    setInputCurrency(currency);
    if (currency == 'WETH') {
      setOutputCurrency('sETH');
    } else if (currency == 'LUSD') {
      setOutputCurrency('sUSD');
    } else if (currency == 'sETH') {
      setOutputCurrency('WETH');
    } else if (currency == 'sUSD') {
      setOutputCurrency('LUSD');
    }
  }

  const getUserBalancesAndApprovals = async (account: string) => {

    let network = await currentProvider?.getNetwork();
    let inputChainId = network?.chainId;

    // instantiate contracts
    let SETH, WETH, SUSD, LUSD, EtherWrapper, LUSDwrapper;
    if (inputChainId == 1) { // Ethereum L1
      SETH = new ethers.Contract(ADDRESSES.ETHEREUM.SETH, ABIs.SETH, currentProvider);
      WETH = new ethers.Contract(ADDRESSES.ETHEREUM.WETH, ABIs.WETH, currentProvider);
      SUSD = new ethers.Contract(ADDRESSES.ETHEREUM.SUSD, ABIs.SUSD, currentProvider);
      LUSD = new ethers.Contract(ADDRESSES.ETHEREUM.LUSD, ABIs.LUSD, currentProvider);
      EtherWrapper = new ethers.Contract(ADDRESSES.ETHEREUM.ETHwrapper, ABIs.ETHwrapper, currentProvider);
      LUSDwrapper = new ethers.Contract(ADDRESSES.ETHEREUM.LUSDwrapper, ABIs.LUSDwrapper, currentProvider);
    } else if (inputChainId == 10) { // Optimism
      SETH = new ethers.Contract(ADDRESSES.OPTIMISM.SETH, ABIs.SETH, currentProvider);
      WETH = new ethers.Contract(ADDRESSES.OPTIMISM.WETH, ABIs.WETH, currentProvider);
      SUSD = new ethers.Contract(ADDRESSES.OPTIMISM.SUSD, ABIs.SUSD, currentProvider);
      LUSD = new ethers.Contract(ADDRESSES.OPTIMISM.LUSD, ABIs.LUSD, currentProvider);
      EtherWrapper = new ethers.Contract(ADDRESSES.OPTIMISM.ETHwrapper, ABIs.LUSDwrapper, currentProvider);
      LUSDwrapper = new ethers.Contract(ADDRESSES.OPTIMISM.LUSDwrapper, ABIs.LUSDwrapper, currentProvider);
    }

    // fetch balances & wrapper contract data
    try {
    const [
      WETHBalanceFetched,
      SETHBalanceFetched,
      LUSDBalanceFetched,
      SUSDBalanceFetched,
      WETHApprovalFetched,
      SETHApprovalFetched,
      LUSDApprovalFetched,
      SUSDApprovalFetched,
      WETHreservesFetched,
      ETHcapacityFetched,
      LUSDreservesFetched,
      USDcapacityFetched
    ] = await Promise.all(
      [
        await WETH?.balanceOf(account),
        await SETH?.balanceOf(account),
        await LUSD?.balanceOf(account),
        await SUSD?.balanceOf(account),
        await WETH?.allowance(account, EtherWrapper?.address),
        await SETH?.allowance(account, EtherWrapper?.address),
        await LUSD?.allowance(account, LUSDwrapper?.address),
        await SUSD?.allowance(account, LUSDwrapper?.address),
        await EtherWrapper?.getReserves(),
        await EtherWrapper?.capacity(),
        await LUSDwrapper?.getReserves(),
        await LUSDwrapper?.capacity(),
      ]
    );
    setUserBalances({
      WETH: utils.formatEther(WETHBalanceFetched),
      sETH: utils.formatEther(SETHBalanceFetched),
      LUSD: utils.formatEther(LUSDBalanceFetched),
      sUSD: utils.formatEther(SUSDBalanceFetched)
    });
    setUserApprovals({
      WETH: utils.formatEther(WETHApprovalFetched),
      sETH: utils.formatEther(SETHApprovalFetched),
      LUSD: utils.formatEther(LUSDApprovalFetched),
      sUSD: utils.formatEther(SUSDApprovalFetched)
    });
    setETHwrapperData({
      ...ETHwrapperData,
      WETHreserves: utils.formatEther(WETHreservesFetched),
      ETHcapacity: utils.formatEther(ETHcapacityFetched)
    });
    setUSDwrapperData({
      ...USDwrapperData,
      LUSDreserves: utils.formatEther(LUSDreservesFetched),
      USDcapacity: utils.formatEther(USDcapacityFetched)
    });
    } catch {
      setErrorMessage('Could not update user balances');
    }
  }

  const sendApprovalTransaction = async () => {

    let network = await currentProvider?.getNetwork();
    let inputChainId = network?.chainId;

    // instantiate contracts
    let SETH, WETH, SUSD, LUSD;
    if (inputChainId == 1) { // Ethereum L1
      SETH = new ethers.Contract(ADDRESSES.ETHEREUM.SETH, ABIs.SETH, currentProvider?.getSigner());
      WETH = new ethers.Contract(ADDRESSES.ETHEREUM.WETH, ABIs.WETH, currentProvider?.getSigner());
      SUSD = new ethers.Contract(ADDRESSES.ETHEREUM.SUSD, ABIs.SUSD, currentProvider?.getSigner());
      LUSD = new ethers.Contract(ADDRESSES.ETHEREUM.LUSD, ABIs.LUSD, currentProvider?.getSigner());
    } else if (inputChainId == 10) { // Optimism
      SETH = new ethers.Contract(ADDRESSES.OPTIMISM.SETH, ABIs.SETH, currentProvider?.getSigner());
      WETH = new ethers.Contract(ADDRESSES.OPTIMISM.WETH, ABIs.WETH, currentProvider?.getSigner());
      SUSD = new ethers.Contract(ADDRESSES.OPTIMISM.SUSD, ABIs.SUSD, currentProvider?.getSigner());
      LUSD = new ethers.Contract(ADDRESSES.OPTIMISM.LUSD, ABIs.LUSD, currentProvider?.getSigner());
    }

    if (inputChainId == 1) { // Ethereum L1
      if (inputCurrency == 'WETH') {
        await sendTransaction(WETH?.approve(ADDRESSES.ETHEREUM.ETHwrapper, constants.MaxUint256));
      } else if (inputCurrency == 'sETH') {
        await sendTransaction(SETH?.approve(ADDRESSES.ETHEREUM.ETHwrapper, constants.MaxUint256));
      } else if (inputCurrency == 'LUSD') {
        await sendTransaction(LUSD?.approve(ADDRESSES.ETHEREUM.LUSDwrapper, constants.MaxUint256));
      } else if (inputCurrency == 'sUSD') {
        await sendTransaction(SUSD?.approve(ADDRESSES.ETHEREUM.LUSDwrapper, constants.MaxUint256));
      }
    } else if (inputChainId == 10) { // Optimism
      if (inputCurrency == 'WETH') {
        await sendTransaction(WETH?.approve(ADDRESSES.OPTIMISM.ETHwrapper, constants.MaxUint256));
      } else if (inputCurrency == 'sETH') {
        await sendTransaction(SETH?.approve(ADDRESSES.OPTIMISM.ETHwrapper, constants.MaxUint256));
      } else if (inputCurrency == 'LUSD') {
        await sendTransaction(LUSD?.approve(ADDRESSES.OPTIMISM.LUSDwrapper, constants.MaxUint256));
      } else if (inputCurrency == 'sUSD') {
        await sendTransaction(SUSD?.approve(ADDRESSES.OPTIMISM.LUSDwrapper, constants.MaxUint256));
      }
    }
  }

  const sendSwapTransaction = async () => {

    let network = await currentProvider?.getNetwork();
    let inputChainId = network?.chainId;

    // instantiate contracts
    let EtherWrapper, LUSDwrapper;
    if (inputChainId == 1) { // Ethereum L1
      EtherWrapper = new ethers.Contract(ADDRESSES.ETHEREUM.ETHwrapper, ABIs.ETHwrapper, currentProvider?.getSigner());
      LUSDwrapper = new ethers.Contract(ADDRESSES.ETHEREUM.LUSDwrapper, ABIs.LUSDwrapper, currentProvider?.getSigner());
    } else if (inputChainId == 10) { // Optimism
      EtherWrapper = new ethers.Contract(ADDRESSES.OPTIMISM.ETHwrapper, ABIs.LUSDwrapper, currentProvider?.getSigner());
      LUSDwrapper = new ethers.Contract(ADDRESSES.OPTIMISM.LUSDwrapper, ABIs.LUSDwrapper, currentProvider?.getSigner());
    }

    if (inputChainId == 1) { // Ethereum L1
      if (inputCurrency == 'WETH') {
        await sendTransaction(EtherWrapper?.mint(utils.parseEther(inputValue)));
      } else if (inputCurrency == 'sETH') {
        await sendTransaction(EtherWrapper?.burn(utils.parseEther(inputValue)));
      } else if (inputCurrency == 'LUSD') {
        await sendTransaction(LUSDwrapper?.mint(utils.parseEther(inputValue)));
      } else if (inputCurrency == 'sUSD') {
        await sendTransaction(LUSDwrapper?.burn(utils.parseEther(inputValue)));
      }
    } else if (inputChainId == 10) { // Optimism
      if (inputCurrency == 'WETH') {
        await sendTransaction(EtherWrapper?.mint(utils.parseEther(inputValue)));
      } else if (inputCurrency == 'sETH') {
        await sendTransaction(EtherWrapper?.burn(utils.parseEther(inputValue)));
      } else if (inputCurrency == 'LUSD') {
        await sendTransaction(LUSDwrapper?.mint(utils.parseEther(inputValue)));
      } else if (inputCurrency == 'sUSD') {
        await sendTransaction(LUSDwrapper?.burn(utils.parseEther(inputValue)));
      }
    }
  }

  const sendTransaction = async (transaction: Promise<ContractTransaction>) => {

    setLoadingMessage('Please confirm the transaction...');

    try {
      const tx = await transaction;
      const explorer = currentChainId == 1 ? 'https://etherscan.io/tx' : 'https://optimistic.etherscan.io/tx';
      setLoadingMessage('Transaction pending...');
      setExplorerLink(`${explorer}/${tx.hash}`);

      const receipt = await tx.wait();
      if (receipt.status === 1) {
        setLoadingMessage('Transaction Confirmed !');
      } else {
        setLoadingMessage('Transaction Reverted !');
      }
      await getUserBalancesAndApprovals(currentAccount);
    } catch (err: any) {
      setLoadingMessage('');
      setExplorerLink('');
      setErrorMessage(err.message);
    }
  }

  const loadTVLdata = async() => {
    if(currentProvider) {
      setLoadingMessage('TVL data loading...');

      let network = await currentProvider.getNetwork();
      let inputChainId = network?.chainId;
  
      // instantiate contracts
      let EtherWrapper, LUSDwrapper;
      if (inputChainId == 1) { // Ethereum L1
        EtherWrapper = new ethers.Contract(ADDRESSES.ETHEREUM.ETHwrapper, ABIs.ETHwrapper, currentProvider);
        LUSDwrapper = new ethers.Contract(ADDRESSES.ETHEREUM.LUSDwrapper, ABIs.LUSDwrapper, currentProvider);
      } else if (inputChainId == 10) { // Optimism
        EtherWrapper = new ethers.Contract(ADDRESSES.OPTIMISM.ETHwrapper, ABIs.LUSDwrapper, currentProvider);
        LUSDwrapper = new ethers.Contract(ADDRESSES.OPTIMISM.LUSDwrapper, ABIs.LUSDwrapper, currentProvider);
      }

      try {
        // extract TVL data from past mint/burn wrapper contract events

        const latestBlockNumberFetched = await currentProvider.getBlockNumber();
        setLatestBlockNumber(latestBlockNumberFetched);
        const blocksInADay = Math.round((60 * 60 * 24) / 13);
        const blocksInAMonth = blocksInADay * 30;

        let ETHfilterMintsLastMonth: any = EtherWrapper?.filters.Minted();
        ETHfilterMintsLastMonth.fromBlock = latestBlockNumber - blocksInAMonth;
        ETHfilterMintsLastMonth.toBlock = 'latest';
        let ETHlogsMintLastMonth = await currentProvider.getLogs(ETHfilterMintsLastMonth);
        const ETHmintsLastMonthArrayFetched = ETHlogsMintLastMonth.map((el) => {
          const container = {
            blockNumber: el.blockNumber,
            value: parseFloat(utils.formatEther(utils.defaultAbiCoder.decode(["uint256", "uint256", "uint256"], el.data)[2]))
          }
          return container;
        });
        setETHMintsLastMonthArray(ETHmintsLastMonthArrayFetched);

        let ETHfilterBurnsLastMonth: any = EtherWrapper?.filters.Burned();
        ETHfilterBurnsLastMonth.fromBlock = latestBlockNumber - blocksInAMonth;
        ETHfilterBurnsLastMonth.toBlock = 'latest';
        let ETHlogsBurnLastMonth = await currentProvider.getLogs(ETHfilterBurnsLastMonth);
        const ETHburnsLastMonthArrayFetched = ETHlogsBurnLastMonth.map((el) => {
          const container = {
            blockNumber: el.blockNumber,
            value: parseFloat(utils.formatEther(utils.defaultAbiCoder.decode(["uint256", "uint256", "uint256"], el.data)[0]))
          }
          return container;
        });
        setETHBurnsLastMonthArray(ETHburnsLastMonthArrayFetched);

        let USDfilterMintsLastMonth: any = LUSDwrapper?.filters.Minted();
        USDfilterMintsLastMonth.fromBlock = latestBlockNumber - blocksInAMonth;
        USDfilterMintsLastMonth.toBlock = 'latest';
        let USDlogsMintLastMonth = await currentProvider.getLogs(USDfilterMintsLastMonth);
        const USDmintsLastMonthArrayFetched = USDlogsMintLastMonth.map((el) => {
          const container = {
            blockNumber: el.blockNumber,
            value: parseFloat(utils.formatEther(utils.defaultAbiCoder.decode(["uint256", "uint256", "uint256"], el.data)[2]))
          }
          return container;
        });
        setUSDMintsLastMonthArray(USDmintsLastMonthArrayFetched);

        let USDfilterBurnsLastMonth: any = LUSDwrapper?.filters.Burned();
        USDfilterBurnsLastMonth.fromBlock = latestBlockNumber - blocksInAMonth;
        USDfilterBurnsLastMonth.toBlock = 'latest';
        let USDlogsBurnLastMonth = await currentProvider.getLogs(USDfilterBurnsLastMonth);
        const USDburnsLastMonthArrayFetched = USDlogsBurnLastMonth.map((el) => {
          const container = {
            blockNumber: el.blockNumber,
            value: parseFloat(utils.formatEther(utils.defaultAbiCoder.decode(["uint256", "uint256", "uint256"], el.data)[0]))
          }
          return container;
        });
        setUSDBurnsLastMonthArray(USDburnsLastMonthArrayFetched);

        // close loading screen and display TVL chart
        setLoadingMessage('');
        setShowTVLChartOverlay(true);

      } catch {
        setLoadingMessage('');
        setErrorMessage('Could not fetch TVL data');
      }
    } else {
      setErrorMessage('You must connect your wallet to see TVL data');
    }
  }

  useEffect(() => {
    if (originalProvider.on) {

      const handleAccountsChanged = async (accounts: string[]) => {
        console.log("accountsChanged", accounts);
        if (accounts && accounts[0] && currentProvider) {
          setLoadingMessage('Web3 data loading...');
          await getUserBalancesAndApprovals(accounts[0]);
          setCurrentAccount(accounts[0]);
          setLoadingMessage('');
        } else {
          disconnectWallet();
        };
      };

      const handleChainChanged = async (_hexChainId: string) => {
        console.log("chainChanged", _hexChainId);
        if (currentProvider) { // do not trigger if wallet is disconnected
          if (_hexChainId == '0x1') {
            try {
            setLoadingMessage('Web3 data loading...');
            await toggleNetwork(1);
            setLoadingMessage('');
            } catch {
              setErrorMessage("Could not fetch Web3 data");
            }
          } else if (_hexChainId == '0xa') {
            try {
            setLoadingMessage('Web3 data loading...');
            await toggleNetwork(10);
            setLoadingMessage('');
            } catch {
              setErrorMessage("Could not fetch Web3 data");
            }
          } else if (_hexChainId != '0xa' && _hexChainId != '0x1') {
            setErrorMessage("Network not supported, please connect to the Ethereum Mainnet or the Optimism Mainnet.");
            disconnectWallet();
          }
        }
      };

      originalProvider.on("accountsChanged", handleAccountsChanged);
      originalProvider.on("chainChanged", handleChainChanged);

      return () => {
        if (originalProvider.removeListener) {
          originalProvider.removeListener("accountsChanged", handleAccountsChanged);
          originalProvider.removeListener("chainChanged", handleChainChanged);
        }
      };
    }
  }, [currentProvider?.provider]);

  return (
    <>
      <Head>
        <title>Synthetix Wrappr</title>
        <meta
          name="description"
          content="Simple user interface that allows to interact with the various Synthetix Wrappr contracts"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <Home blur={showWalletOverlay || showTVLChartOverlay || loadingMessage.length > 0 || errorMessage.length > 0}>
          <Header
            onConnect={() => setShowWalletOverlay(currentAccount.length == 0)}
            account={currentAccount}
            onDisconnectWallet={disconnectWallet}
            toggleNetwork={toggleNetwork}
            chainId={currentChainId}
          />
          <Content
            onTVLClick={() => loadTVLdata()}
            userBalances={userBalances}
            userApprovals={userApprovals}
            ETHwrapperData={ETHwrapperData}
            USDwrapperData={USDwrapperData}
            isMinting={isMinting}
            toggleMintOrBurn={toggleMintOrBurn}
            inputValue={inputValue}
            outputValue={outputValue}
            handleInputValue={handleInputValue}
            handleOutputValue={handleOutputValue}
            handleMaxButton={handleMaxButton}
            handleCurrency={handleCurrency}
            inputCurrency={inputCurrency}
            outputCurrency={outputCurrency}
            sendApprovalTransaction={sendApprovalTransaction}
            sendSwapTransaction={sendSwapTransaction}
          />
          <Footer />
        </Home>
        <StyledWalletOverlay
          display={showWalletOverlay}
          onConnectWallet={connectWallet}
          onClose={() => setShowWalletOverlay(false)}
        />
        <StyledTVLChartOverlay
          display={showTVLChartOverlay}
          onClose={() => setShowTVLChartOverlay(false)}
          WETHreserves={ETHwrapperData.WETHreserves}
          LUSDreserves={USDwrapperData.LUSDreserves}
          ETHmintsLastMonthArray={ETHmintsLastMonthArray}
          ETHburnsLastMonthArray={ETHburnsLastMonthArray}
          USDmintsLastMonthArray={USDmintsLastMonthArray}
          USDburnsLastMonthArray={USDburnsLastMonthArray}
          latestBlockNumber={latestBlockNumber}
          setErrorMessage={setErrorMessage}
          setLoadingMessage={setLoadingMessage}
        />
        <StyledLoadingOverlay
          display={loadingMessage.length > 0}
          loadingMessage={loadingMessage}
          optionalExplorerLink={explorerLink}
          setLoadingMessage={setLoadingMessage}
          setExplorerLink={setExplorerLink}
        />
        <ErrorMessageOverlay
          display={errorMessage.length > 0}
          errorMessage={errorMessage}
          setErrorMessage={setErrorMessage}
        />
      </main>
    </>
  );
};

const Home = styled.div<{ blur: boolean }>`
  /* Make the background blur if the wallet overlay is displayed */
  ${(props) =>
    props.blur &&
    css`
      filter: blur(3px);
      background: rgba(13, 13, 13, 0.82);
    `}>
`;

const StyledWalletOverlay = styled(Wallet)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 10;
  background-color: rgba(0, 0, 0, 0.5); /*dim the background*/
`;

const StyledTVLChartOverlay = styled(TVLChart)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 10;
  background-color: rgba(0, 0, 0, 0.5); /*dim the background*/
`;

const StyledLoadingOverlay = styled(LoadingOverlay)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 10;
  background-color: rgba(0, 0, 0, 0.5); /*dim the background*/
`;

const ErrorMessageOverlay = styled(ErrorMessage)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 10;
  background-color: rgba(0, 0, 0, 0.5); /*dim the background*/
`;

export default HomePage;
