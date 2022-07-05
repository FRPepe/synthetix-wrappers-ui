import { useState, useEffect } from "react";
import Head from "next/head";
import styled, { css } from "styled-components";

import { ethers, utils, BigNumber, constants } from 'ethers';
import Web3Modal from "web3modal";

import { ADDRESSES, ABIs } from '../contractData';

import styles from "../styles/Home.module.css";

import Header from "../sections/home/Header";
import Content from "../sections/home/Content";
import Footer from "../sections/home/Footer";
import Wallet from "../sections/home/WalletOverlay";
import TVLChart from "../sections/home/TVLChartOverlay";
import LoadingWeb3 from "../sections/home/LoadingWeb3";
import ErrorMessage from "../sections/home/ErrorMessage";


let web3Modal: Web3Modal | null;
if (typeof window !== 'undefined') {
  web3Modal = new Web3Modal({
    cacheProvider: true, // optional
    providerOptions: {} // required
  });
}

// TBD : add option to burn sETH into ETH or WETH ?
// TBD : which options for wallet providers ?
// modal pop-up with link to block explorer + pop-up info about transaction outcome
// TVL : fetch events of the past month to calculate past balances ?
// testing : kovan or capacity on OP / L1 ?
// approval : infinite at first tx or per-transaction ?
// fee rate info tip by hovering : add content ?

const HomePage = () => {
  // UI
  const [showWalletOverlay, setShowWalletOverlay] = useState<boolean>(false);
  const [showTVLChartOverlay, setShowTVLChartOverlay] = useState<boolean>(false);
  const [isLoadingWeb3, setIsLoadingWeb3] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const [inputValue, setInputValue] = useState<string>("");
  const [outputValue, setOutputValue] = useState<string>("");
  const [isMinting, setIsMinting] = useState<boolean>(true);


  // tx data
  const [inputCurrency, setInputCurrency] = useState<string>("ETH");
  const [outputCurrency, setOutputCurrency] = useState<string>("sETH");


  // wallet input
  const [provider, setProvider] = useState<any>({});
  const [library, setLibrary] = useState<ethers.providers.Web3Provider>();
  const [account, setAccount] = useState<string>("");
  const [chainId, setChainId] = useState<number>(0);

  // user balances & contract data
  const [userBalances, setUserBalances] = useState(
    {
      ETH: "0",
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

  const connectWallet = async () => {

    // close down wallet overlay
    setShowWalletOverlay(false);
    // open loadingWeb3 overlay
    setIsLoadingWeb3(true);

    if (web3Modal) {
      try {
        // initiate Web3 and fetch wallet data
        const provider = await web3Modal.connect();
        const library = new ethers.providers.Web3Provider(provider);
        const signer = library.getSigner();
        const accounts = await library.listAccounts();
        const network = await library.getNetwork();
        setProvider(provider);
        setLibrary(library);
        if (accounts) setAccount(accounts[0]);
        setChainId(network.chainId);

        // instantiate contracts
        let SETH, WETH, SUSD, LUSD, EtherWrapper, NativeEtherWrapper, LUSDwrapper;
        if (network.chainId == 1) { // Ethereum L1
          SETH = new ethers.Contract(ADDRESSES.ETHEREUM.SETH, ABIs.SETH, library);
          WETH = new ethers.Contract(ADDRESSES.ETHEREUM.WETH, ABIs.WETH, library);
          SUSD = new ethers.Contract(ADDRESSES.ETHEREUM.SUSD, ABIs.SUSD, library);
          LUSD = new ethers.Contract(ADDRESSES.ETHEREUM.LUSD, ABIs.LUSD, library);
          NativeEtherWrapper = new ethers.Contract(ADDRESSES.ETHEREUM.NativeEtherWrapper, ABIs.NativeEtherWrapper, library);
          EtherWrapper = new ethers.Contract(ADDRESSES.ETHEREUM.ETHwrapper, ABIs.ETHwrapper, library);
          LUSDwrapper = new ethers.Contract(ADDRESSES.ETHEREUM.LUSDwrapper, ABIs.LUSDwrapper, library);
        } else if (network.chainId == 10) { // Optimism
          SETH = new ethers.Contract(ADDRESSES.OPTIMISM.SETH, ABIs.SETH, library);
          WETH = new ethers.Contract(ADDRESSES.OPTIMISM.WETH, ABIs.WETH, library);
          SUSD = new ethers.Contract(ADDRESSES.OPTIMISM.SUSD, ABIs.SUSD, library);
          LUSD = new ethers.Contract(ADDRESSES.OPTIMISM.LUSD, ABIs.LUSD, library);
          EtherWrapper = new ethers.Contract(ADDRESSES.OPTIMISM.ETHwrapper, ABIs.LUSDwrapper, library);
          LUSDwrapper = new ethers.Contract(ADDRESSES.OPTIMISM.LUSDwrapper, ABIs.LUSDwrapper, library);
        } else {
          setErrorMessage("Network not supported, please connect to the Ethereum Mainnet or the Optimism Mainnet.");
          setIsLoadingWeb3(false);
          setShowWalletOverlay(false);
          disconnectWallet();
          return;
        }

        // fetch balances & wrapper contract data
        let etherBalanceFetched;
        let maxETHFetched;
        if (network.chainId == 1) {
          etherBalanceFetched = await signer.getBalance();
          maxETHFetched = await EtherWrapper?.maxETH();
        } else if (network.chainId == 10) {
          maxETHFetched = await EtherWrapper?.maxTokenAmount();
        }
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
            await SETH?.allowance(accounts[0], network.chainId == 1 ? NativeEtherWrapper?.address : EtherWrapper?.address),
            await LUSD?.allowance(accounts[0], LUSDwrapper?.address),
            await SUSD?.allowance(accounts[0], LUSDwrapper?.address),
            await EtherWrapper?.mintFeeRate(),
            await EtherWrapper?.burnFeeRate(),
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
          ETH: etherBalanceFetched ? utils.formatEther(etherBalanceFetched) : "0",
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

        // stop displaying loadingWeb3 overlay
        setIsLoadingWeb3(false);

      } catch (error) {
        setErrorMessage('Could not connect to Web3 wallet.');
        // stop displaying loadingWeb3 overlay
        setIsLoadingWeb3(false);
      }
    }
  };

  const disconnectWallet = () => {
    if (web3Modal) {
      web3Modal.clearCachedProvider();
      setProvider({});
      setLibrary(undefined);
      setAccount("");
      setChainId(0);
      setUserBalances({
        ETH: "0",
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
  }

  const toggleNetwork = async (newChainId: number) => {
    if (library) {
      if (newChainId == 10 && library?.provider.request) {
        try {
          await library?.provider?.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: '0xa' }]
          });
        } catch (err: any) {
          if (err.code === 4902) {
            try {
              await library?.provider?.request({
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
      } else if (newChainId == 1 && library?.provider.request) {
        try {
          await library?.provider?.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: '0x1' }]
          });
        } catch (err: any) {
          if (err.code === 4902) {
            try {
              await library?.provider?.request({
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
      await connectWallet();
    } else {
      setChainId(newChainId);
    }
  }

  const toggleMintOrBurn = () => {
    setIsMinting(!isMinting);
    setInputValue("");
    setOutputValue("");
    if (inputCurrency == 'ETH' || inputCurrency == 'WETH') {
      setInputCurrency('sETH');
      setOutputCurrency('ETH');
    } else if (inputCurrency == 'sETH') {
      setInputCurrency('ETH');
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
      if (inputCurrency == 'ETH' || inputCurrency == 'WETH') {
        newValue = `${parseFloat(userEntry) * (10000 - parseFloat(ETHwrapperData.ETHmintFeeRate) * 10000) / 10000}`;
      } else if (inputCurrency == 'sETH') {
        newValue = `${parseFloat(userEntry) * (10000 - parseFloat(ETHwrapperData.ETHburnFeeRate) * 10000) / 10000}`;
      } else if (inputCurrency == 'LUSD') {
        newValue = `${parseFloat(userEntry) * (10000 - parseFloat(USDwrapperData.USDmintFeeRate) * 10000) / 10000}`;
      } else if (inputCurrency == 'sUSD') {
        newValue = `${parseFloat(userEntry) * (10000 - parseFloat(USDwrapperData.USDburnFeeRate) * 10000) / 10000}`;
      }
    } else {
      if (inputCurrency == 'ETH' || inputCurrency == 'WETH') {
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
    if (currency == 'ETH' || currency == 'WETH') {
      setOutputCurrency('sETH');
    } else if (currency == 'LUSD') {
      setOutputCurrency('sUSD');
    } else if (currency == 'sETH') {
      setOutputCurrency('ETH');
    } else if (currency == 'sUSD') {
      setOutputCurrency('LUSD');
    }
  }

  const getUserBalancesAndApprovals = async (account: string) => {
    // instantiate contracts
    let SETH, WETH, SUSD, LUSD, EtherWrapper, NativeEtherWrapper, LUSDwrapper;
    if (chainId == 1) { // Ethereum L1
      SETH = new ethers.Contract(ADDRESSES.ETHEREUM.SETH, ABIs.SETH, library);
      WETH = new ethers.Contract(ADDRESSES.ETHEREUM.WETH, ABIs.WETH, library);
      SUSD = new ethers.Contract(ADDRESSES.ETHEREUM.SUSD, ABIs.SUSD, library);
      LUSD = new ethers.Contract(ADDRESSES.ETHEREUM.LUSD, ABIs.LUSD, library);
      NativeEtherWrapper = new ethers.Contract(ADDRESSES.ETHEREUM.NativeEtherWrapper, ABIs.NativeEtherWrapper, library);
      EtherWrapper = new ethers.Contract(ADDRESSES.ETHEREUM.ETHwrapper, ABIs.ETHwrapper, library);
      LUSDwrapper = new ethers.Contract(ADDRESSES.ETHEREUM.LUSDwrapper, ABIs.LUSDwrapper, library);
    } else if (chainId == 10) { // Optimism
      SETH = new ethers.Contract(ADDRESSES.OPTIMISM.SETH, ABIs.SETH, library);
      WETH = new ethers.Contract(ADDRESSES.OPTIMISM.WETH, ABIs.WETH, library);
      SUSD = new ethers.Contract(ADDRESSES.OPTIMISM.SUSD, ABIs.SUSD, library);
      LUSD = new ethers.Contract(ADDRESSES.OPTIMISM.LUSD, ABIs.LUSD, library);
      EtherWrapper = new ethers.Contract(ADDRESSES.OPTIMISM.ETHwrapper, ABIs.LUSDwrapper, library);
      LUSDwrapper = new ethers.Contract(ADDRESSES.OPTIMISM.LUSDwrapper, ABIs.LUSDwrapper, library);
    }

    // fetch balances & wrapper contract data
    let etherBalanceFetched;
    if (chainId == 1) {
      etherBalanceFetched = await library?.getSigner().getBalance();
    }
    const [
      WETHBalanceFetched,
      SETHBalanceFetched,
      LUSDBalanceFetched,
      SUSDBalanceFetched,
      WETHApprovalFetched,
      SETHApprovalFetched,
      LUSDApprovalFetched,
      SUSDApprovalFetched,
    ] = await Promise.all(
      [
        await WETH?.balanceOf(account),
        await SETH?.balanceOf(account),
        await LUSD?.balanceOf(account),
        await SUSD?.balanceOf(account),
        await WETH?.allowance(account, EtherWrapper?.address),
        await SETH?.allowance(account, chainId == 1 ? NativeEtherWrapper?.address : EtherWrapper?.address),
        await LUSD?.allowance(account, LUSDwrapper?.address),
        await SUSD?.allowance(account, LUSDwrapper?.address),
      ]
    );
    setUserBalances({
      ETH: etherBalanceFetched ? utils.formatEther(etherBalanceFetched) : "0",
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
  }

  const sendApprovalTransaction = async () => {
    if (chainId == 1) { // Ethereum L1
      if (inputCurrency == 'WETH') {
        let WETH = new ethers.Contract(ADDRESSES.ETHEREUM.WETH, ABIs.WETH, library?.getSigner());
        await WETH.approve(ADDRESSES.ETHEREUM.ETHwrapper, constants.MaxUint256);
      } else if (inputCurrency == 'sETH') {
        let SETH = new ethers.Contract(ADDRESSES.ETHEREUM.SETH, ABIs.SETH, library?.getSigner());
        if (outputCurrency == 'WETH') {
          await SETH.approve(ADDRESSES.ETHEREUM.ETHwrapper, constants.MaxUint256);
        } else if (outputCurrency == 'ETH') {
          await SETH.approve(ADDRESSES.ETHEREUM.NativeEtherWrapper, constants.MaxUint256);
        }
      } else if (inputCurrency == 'LUSD') {
        let LUSD = new ethers.Contract(ADDRESSES.ETHEREUM.LUSD, ABIs.LUSD, library?.getSigner());
        await LUSD.approve(ADDRESSES.ETHEREUM.LUSDwrapper, constants.MaxUint256);
      } else if (inputCurrency == 'sUSD') {
        let SUSD = new ethers.Contract(ADDRESSES.ETHEREUM.SUSD, ABIs.SUSD, library?.getSigner());
        await SUSD.approve(ADDRESSES.ETHEREUM.LUSDwrapper, constants.MaxUint256);
      }
    } else if (chainId == 10) { // Optimism
      if (inputCurrency == 'WETH') {
        let WETH = new ethers.Contract(ADDRESSES.OPTIMISM.WETH, ABIs.WETH, library?.getSigner());
        await WETH.approve(ADDRESSES.OPTIMISM.ETHwrapper, constants.MaxUint256);
      } else if (inputCurrency == 'sETH') {
        let SETH = new ethers.Contract(ADDRESSES.OPTIMISM.SETH, ABIs.SETH, library?.getSigner());
        await SETH.approve(ADDRESSES.OPTIMISM.ETHwrapper, constants.MaxUint256);
      } else if (inputCurrency == 'LUSD') {
        let LUSD = new ethers.Contract(ADDRESSES.OPTIMISM.LUSD, ABIs.LUSD, library?.getSigner());
        await LUSD.approve(ADDRESSES.OPTIMISM.LUSDwrapper, constants.MaxUint256);
      } else if (inputCurrency == 'sUSD') {
        let SUSD = new ethers.Contract(ADDRESSES.OPTIMISM.SUSD, ABIs.SUSD, library?.getSigner());
        await SUSD.approve(ADDRESSES.OPTIMISM.LUSDwrapper, constants.MaxUint256);
      }
    }
  }

  const sendSwapTransaction = async () => {
    if (chainId == 1) { // Ethereum L1
      if (inputCurrency == 'ETH') {
        let NativeEtherWrapper = new ethers.Contract(ADDRESSES.ETHEREUM.NativeEtherWrapper, ABIs.NativeEtherWrapper, library?.getSigner());
        await NativeEtherWrapper.mint({ value: utils.parseEther(inputValue) });
      } else if (inputCurrency == 'WETH') {
        let EtherWrapper = new ethers.Contract(ADDRESSES.ETHEREUM.ETHwrapper, ABIs.ETHwrapper, library?.getSigner());
        await EtherWrapper.mint(utils.parseEther(inputValue));
      } else if (inputCurrency == 'sETH') {
        let NativeEtherWrapper = new ethers.Contract(ADDRESSES.ETHEREUM.NativeEtherWrapper, ABIs.NativeEtherWrapper, library?.getSigner());
        await NativeEtherWrapper.burn(utils.parseEther(inputValue));
      } else if (inputCurrency == 'LUSD') {
        let LUSDwrapper = new ethers.Contract(ADDRESSES.ETHEREUM.LUSDwrapper, ABIs.LUSDwrapper, library?.getSigner());
        await LUSDwrapper.mint(utils.parseEther(inputValue));
      } else if (inputCurrency == 'sUSD') {
        let LUSDwrapper = new ethers.Contract(ADDRESSES.ETHEREUM.LUSDwrapper, ABIs.LUSDwrapper, library?.getSigner());
        await LUSDwrapper.burn(utils.parseEther(inputValue));
      }
    } else if (chainId == 10) { // Optimism
      if (inputCurrency == 'WETH') {
        let EtherWrapper = new ethers.Contract(ADDRESSES.OPTIMISM.ETHwrapper, ABIs.ETHwrapper, library?.getSigner());
        await EtherWrapper.mint(utils.parseEther(inputValue));
      } else if (inputCurrency == 'sETH') {
        let EtherWrapper = new ethers.Contract(ADDRESSES.OPTIMISM.ETHwrapper, ABIs.NativeEtherWrapper, library?.getSigner());
        await EtherWrapper.burn(utils.parseEther(inputValue));
      } else if (inputCurrency == 'LUSD') {
        let LUSDwrapper = new ethers.Contract(ADDRESSES.OPTIMISM.LUSDwrapper, ABIs.LUSDwrapper, library?.getSigner());
        await LUSDwrapper.mint(utils.parseEther(inputValue));
      } else if (inputCurrency == 'sUSD') {
        let LUSDwrapper = new ethers.Contract(ADDRESSES.OPTIMISM.LUSDwrapper, ABIs.LUSDwrapper, library?.getSigner());
        await LUSDwrapper.burn(utils.parseEther(inputValue));
      }
    }
  }

  useEffect(() => {
    if (provider?.on) {

      const handleAccountsChanged = (accounts: string[]) => {
        console.log("accountsChanged", accounts);
        if (accounts && accounts[0] && library) {
          getUserBalancesAndApprovals(accounts[0]);
          setAccount(accounts[0]);
        } else {
          disconnectWallet()
        };
      };

      const handleChainChanged = (_hexChainId: string) => {
        if (library) { // do not trigger if wallet is disconnected
          if (_hexChainId == '0x1') {
            toggleNetwork(1).catch(console.error);
          } else if (_hexChainId == '0xa') {
            toggleNetwork(10).catch(console.error);
          } else if (_hexChainId != '0xa' && _hexChainId != '0x1') {
            setErrorMessage("Network not supported, please connect to the Ethereum Mainnet or the Optimism Mainnet.");
            disconnectWallet();
          }
        }
      };

      provider.on("accountsChanged", handleAccountsChanged);
      provider.on("chainChanged", handleChainChanged);

      return () => {
        if (provider.removeListener) {
          provider.removeListener("accountsChanged", handleAccountsChanged);
          provider.removeListener("chainChanged", handleChainChanged);
        }
      };
    }
  }, [provider]);

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
        <Home blur={showWalletOverlay || showTVLChartOverlay || isLoadingWeb3 || errorMessage.length > 0}>
          <Header
            onConnect={() => setShowWalletOverlay(account.length == 0)}
            account={account}
            onDisconnectWallet={disconnectWallet}
            toggleNetwork={toggleNetwork}
            chainId={chainId}
          />
          <Content
            onTVLClick={() => setShowTVLChartOverlay(true)}
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
        />
        <LoadingWeb3Overlay
          display={isLoadingWeb3}
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

const LoadingWeb3Overlay = styled(LoadingWeb3)`
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
