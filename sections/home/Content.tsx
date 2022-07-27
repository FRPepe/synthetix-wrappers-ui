import { FC, useState, useEffect } from "react";
import styled, { css } from "styled-components";
import Image from "next/image";

import Button from "../../components/Button";

import LinkArrow from "../../assets/utils/link-arrow.svg";
import Arrows from "../../assets/utils/arrows.svg";
import DownArrowSmall from "../../assets/utils/down-arrow-small.svg";
import BlueInfo from "../../assets/utils/blue-info.svg";
import LUSDLogo from "../../assets/synths/sLUSD.svg";
import sUSDLogo from "../../assets/synths/sUSD.png";
import sETHLogo from "../../assets/synths/sETH.png";
import WETHLogo from "../../assets/synths/weth.png";

type WrapprProps = {
  onTVLClick: () => void;
  handleInputValue: (e: any) => void;
  handleOutputValue: (e: any) => void;
  toggleMintOrBurn: () => void;
  handleMaxButton: () => void;
  handleCurrency: (currency: string) => void;
  sendApprovalTransaction: () => void;
  sendSwapTransaction: () => void;
  userBalances: any;
  userApprovals: any;
  ETHwrapperData: any;
  USDwrapperData: any;
  isMinting: boolean;
  inputValue: string;
  outputValue: string;
  inputCurrency: string;
  outputCurrency: string;
};

const Wrappr: FC<WrapprProps> = ({
  onTVLClick,
  handleInputValue,
  handleOutputValue,
  toggleMintOrBurn,
  handleMaxButton,
  handleCurrency,
  sendApprovalTransaction,
  sendSwapTransaction,
  userBalances,
  userApprovals,
  ETHwrapperData,
  USDwrapperData,
  isMinting,
  inputValue,
  outputValue,
  inputCurrency,
  outputCurrency
}) => {

  /* Capacity */
  const [capacityPercentage, setCapacityPercentage] = useState<number>(0);

  useEffect(() => {
    let newPercentage: number = 0;
    if (inputCurrency == 'sETH' || inputCurrency == 'WETH') {
      newPercentage = parseFloat(ETHwrapperData.WETHreserves) > parseFloat(ETHwrapperData.maxETH) ? 100 :
        Math.round((parseFloat(ETHwrapperData.WETHreserves) * 100) / parseFloat(ETHwrapperData.maxETH))
    } else if (inputCurrency == 'LUSD' || inputCurrency == 'sUSD') {
      newPercentage = parseFloat(USDwrapperData.LUSDreserves) > parseFloat(USDwrapperData.maxUSD) ? 100 :
        Math.round((parseFloat(USDwrapperData.LUSDreserves) * 100) / parseFloat(USDwrapperData.maxUSD))
    }
    setCapacityPercentage(newPercentage);
  });

  /* Swap and Approval Buttons */
  const [swapButtonText, setSwapButtonText] = useState<string>('Enter an amount');

  useEffect(() => {
    if (parseFloat(inputValue) == 0 || inputValue.length == 0) {
      setSwapButtonText('Enter an amount');
    } else if (parseFloat(inputValue) > 0 && parseFloat(inputValue) > parseFloat(userBalances[inputCurrency])) {
      setSwapButtonText('Insufficient balance');
    } else if (inputCurrency == 'WETH' && parseFloat(inputValue) > parseFloat(ETHwrapperData.ETHcapacity)) {
      setSwapButtonText('Insufficient sETH minting capacity');
    } else if (inputCurrency == 'LUSD' && parseFloat(inputValue) > parseFloat(USDwrapperData.USDcapacity)) {
      setSwapButtonText('Insufficient sUSD minting capacity');
    } else if (inputCurrency == 'sETH' && parseFloat(inputValue) > parseFloat(ETHwrapperData.WETHreserves)) {
      setSwapButtonText('Insufficient WETH reserves');
    } else if (inputCurrency == 'sUSD' && parseFloat(inputValue) > parseFloat(USDwrapperData.LUSDreserves)) {
      setSwapButtonText('Insufficient LUSD reserves');
    } else {
      if (userApprovals[inputCurrency] > parseFloat(inputValue)) {
        setSwapButtonText('Swap');
      } else {
        setSwapButtonText(`Allow the Wrapper to use your ${inputCurrency}`);
      }
    }
  });

  const handleTransaction = async () => {
    if (swapButtonText == `Allow the Wrapper to use your ${inputCurrency}`) {
      await sendApprovalTransaction();
    } else if (swapButtonText == 'Swap') {
      await sendSwapTransaction();
    }
  }

  return (
    <Container>
      <ContainerRow>
        <SelectorContainer>
          <SelectorButton
            active={isMinting}
            onClick={() => toggleMintOrBurn()}
          >
            <span>Mint</span>
          </SelectorButton>
          <SelectorButton
            active={!isMinting}
            onClick={() => toggleMintOrBurn()}
          >
            <span>Burn</span>
          </SelectorButton>
        </SelectorContainer>
        <TVLButton
          className="align-right"
          onClick={onTVLClick}
        >
          <span>TVL</span>
          <Image src={LinkArrow} alt="link-arrow" priority={true} />
        </TVLButton>
      </ContainerRow>
      <WrapprContainerColumn>
        <WrapprContainerRow>
          <span>Wrappr</span>
        </WrapprContainerRow>
        <BlackContainer>
          <BlackContainerRow>
            <span className="big">Wrapping</span>
            <span>Balance: {parseFloat(userBalances[inputCurrency]).toFixed(2)}</span>
            <MaxButton
              onClick={() => handleMaxButton()}
            >
              <span>MAX</span>
            </MaxButton>
          </BlackContainerRow>
          <BlackContainerRow>
            <CurrencySelectoDropdown
              active={isMinting}
            >
              <CurrencySelectorButton>
                <StyledCurrencyContainer>
                  <div style={{ marginTop: "4px", display: inputCurrency == 'LUSD' ? 'initial' : 'none' }} >
                    <Image src={LUSDLogo} alt="LUSD-logo" priority={true} />
                  </div>
                  <div style={{ marginTop: "4px", display: inputCurrency == 'WETH' ? 'initial' : 'none' }} >
                    <img src={WETHLogo.src} alt="WETH-logo" style={{ width: "24px", height: "24px" }} />
                  </div>
                  <div style={{ marginTop: "2px", display: inputCurrency == 'sETH' ? 'initial' : 'none' }} >
                    <img src={sETHLogo.src} alt="sETH-logo" style={{ width: "27px", height: "27px", marginTop: "2px" }} />
                  </div>
                  <div style={{ marginTop: "4px", display: inputCurrency == 'sUSD' ? 'initial' : 'none' }} >
                    <img src={sUSDLogo.src} alt="sUSD-logo" style={{ width: "27px", height: "27px", marginTop: "2px" }} />
                  </div>
                  <span>{inputCurrency}</span>
                  <Image src={DownArrowSmall} alt="down-arrow" priority={true} />
                </StyledCurrencyContainer>
              </CurrencySelectorButton>
              <CurrencySelectorContainerMint>
                <CurrencyContainer
                  onClick={() => handleCurrency("LUSD")}
                >
                  <Image src={LUSDLogo} alt="LUSD-logo" priority={true} />
                  <span>LUSD</span>
                </CurrencyContainer>
                <CurrencyContainer
                  onClick={() => handleCurrency("WETH")}
                >
                  <img src={WETHLogo.src} alt="WETH-logo" style={{ width: "24px", height: "24px" }} />
                  <span>WETH</span>
                </CurrencyContainer>
              </CurrencySelectorContainerMint>
              <CurrencySelectorContainerBurn>
                <CurrencyContainer
                  onClick={() => handleCurrency("sUSD")}
                >
                    <img src={sUSDLogo.src} alt="sUSD-logo" style={{ width: "27px", height: "27px", marginTop: "2px" }} />
                  <span>sUSD</span>
                </CurrencyContainer>
                <CurrencyContainer
                  onClick={() => handleCurrency("sETH")}
                >
                  <img src={sETHLogo.src} alt="sETH-logo" style={{ width: "27px", height: "27px", marginTop: "0px" }} />
                  <span>sETH</span>
                </CurrencyContainer>
              </CurrencySelectorContainerBurn>
            </CurrencySelectoDropdown>
            <NumericInput type="text" placeholder="0.0" pattern="^[0-9]*[.,]?[0-9]*$" value={inputValue} onChange={(e: any) => handleInputValue(e)} maxLength={11} />
          </BlackContainerRow>
          <BlackContainerRow>
            <span style={{ display: inputCurrency == 'WETH' ? 'initial' : 'none' }}>Max mintable: {parseFloat(ETHwrapperData.ETHcapacity).toFixed(2)}Ξ</span>
            <span style={{ display: inputCurrency == 'LUSD' ? 'initial' : 'none' }}>Max mintable: {parseFloat(USDwrapperData.USDcapacity).toLocaleString('en-US', {
              style: 'currency',
              currency: 'USD',
              minimumFractionDigits: 0,
              maximumFractionDigits: 0
            })}</span>
            <span style={{ display: inputCurrency == 'sETH' ? 'initial' : 'none' }}>Max burnable: {parseFloat(ETHwrapperData.WETHreserves).toFixed(2)}Ξ</span>
            <span style={{ display: inputCurrency == 'sUSD' ? 'initial' : 'none' }}>Max burnable: {parseFloat(USDwrapperData.LUSDreserves).toLocaleString('en-US', {
              style: 'currency',
              currency: 'USD',
              minimumFractionDigits: 0,
              maximumFractionDigits: 0
            })}</span>
          </BlackContainerRow>
        </BlackContainer>
        <ArrowButton
          onClick={() => toggleMintOrBurn()}
        >
          <Image src={Arrows} alt="trade-arrows" priority={true} />
        </ArrowButton>
        <BlackContainer>
          <BlackContainerRow>
            <span>Into</span>
            <span>Balance: {parseFloat(userBalances[outputCurrency]).toFixed(2)}</span>
          </BlackContainerRow>
          <BlackContainerRow>
            <StyledCurrencyContainer2>
              <div style={{ marginTop: "4px", display: outputCurrency == 'LUSD' ? 'initial' : 'none' }} >
                <Image src={LUSDLogo} alt="LUSD-logo" priority={true} />
              </div>
              <div style={{ marginTop: "4px", display: outputCurrency == 'WETH' ? 'initial' : 'none' }} >
                <img src={WETHLogo.src} alt="WETH-logo" style={{ width: "24px", height: "24px" }} />
              </div>
              <div style={{ marginTop: "2px", display: outputCurrency == 'sETH' ? 'initial' : 'none' }} >
                <img src={sETHLogo.src} alt="sETH-logo" style={{ width: "27px", height: "27px", marginTop: "2px" }} />
              </div>
              <div style={{ marginTop: "4px", display: outputCurrency == 'sUSD' ? 'initial' : 'none' }} >
                <img src={sUSDLogo.src} alt="sUSD-logo" style={{ width: "27px", height: "27px", marginTop: "2px" }} />
              </div>
              <span>{outputCurrency}</span>
            </StyledCurrencyContainer2>
            <NumericInput type="text" placeholder="0.0" pattern="^[0-9]*[.,]?[0-9]*$" value={outputValue} onChange={(e: any) => handleOutputValue(e)} maxLength={11} />
          </BlackContainerRow>
          <StyledBlackContainerRow>
            <span style={{ display: inputCurrency == 'WETH' ? 'initial' : 'none' }}>Fee rate: {`${parseFloat(ETHwrapperData.ETHmintFeeRate) * 100}%`}</span>
            <span style={{ display: inputCurrency == 'sETH' ? 'initial' : 'none' }}>Fee rate: {`${parseFloat(ETHwrapperData.ETHburnFeeRate) * 100}%`}</span>
            <span style={{ display: inputCurrency == 'LUSD' ? 'initial' : 'none' }}>Fee rate: {`${parseFloat(USDwrapperData.USDmintFeeRate) * 100}%`}</span>
            <span style={{ display: inputCurrency == 'sUSD' ? 'initial' : 'none' }}>Fee rate: {`${parseFloat(USDwrapperData.USDburnFeeRate) * 100}%`}</span>
            <BlueInfoButton>
              <Image className="tooltip" src={BlueInfo} alt="info-icon" priority={true} />
              <TooltipBox>
                <span>The fee rate is decided by the Grants Council</span>
                <a href="https://docs.synthetix.io/integrations/ether-wrapper/" target="_blank">Learn More</a>
              </TooltipBox>
            </BlueInfoButton>
          </StyledBlackContainerRow>
        </BlackContainer>
        <SwapButton
          active={swapButtonText == `Allow the Wrapper to use your ${inputCurrency}` || swapButtonText == 'Swap'}
          onClick={() => handleTransaction()}
        >
          <span>{swapButtonText}</span>
        </SwapButton>
      </WrapprContainerColumn>
      <CapacityContainer>
        <TitleContainer>
          <span>Capacity</span>
        </TitleContainer>
        <GaugeContainer>
          <GaugeProgress percentage={capacityPercentage} />
        </GaugeContainer>
        <CapacityDescriptionContainer>
          <ColumnContainer>
            <span className="bold">Utilised</span>
            <span style={{ fontWeight: "100", display: inputCurrency == 'WETH' || inputCurrency == 'sETH' ? 'initial' : 'none' }}>{`${parseFloat(ETHwrapperData.WETHreserves).toFixed(2)}Ξ`}</span>
            <span style={{ fontWeight: "100", display: inputCurrency == 'LUSD' || inputCurrency == 'sUSD' ? 'initial' : 'none' }}>{`${parseFloat(USDwrapperData.LUSDreserves).toLocaleString('en-US', {
              style: 'currency',
              currency: 'USD',
              minimumFractionDigits: 0,
              maximumFractionDigits: 0
            })}`}</span>
          </ColumnContainer>
          <ColumnContainer>
            <span className="bold">Max Capacity</span>
            <span style={{ fontWeight: "100", display: inputCurrency == 'WETH' || inputCurrency == 'sETH' ? 'initial' : 'none' }}>{`${parseFloat(ETHwrapperData.maxETH).toFixed(2)}Ξ`}</span>
            <span style={{ fontWeight: "100", display: inputCurrency == 'LUSD' || inputCurrency == 'sUSD' ? 'initial' : 'none' }}>{`${parseFloat(USDwrapperData.maxUSD).toLocaleString('en-US', {
              style: 'currency',
              currency: 'USD',
              minimumFractionDigits: 0,
              maximumFractionDigits: 0
            })}`}</span>
          </ColumnContainer>
        </CapacityDescriptionContainer>
      </CapacityContainer>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding: 30px 40px 0px 40px;
`;

const ContainerRow = styled.div`
  width: 518px;
  //height: 44px;

  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;

  .align-right {
    //align-content: flex-end;
  }
`;

const TVLButton = styled(Button)`
  width: 100%;
  width: 68px;
  height: 32px;
  margin-left: 84px;

  background: linear-gradient(121.5deg, #101215 55.37%, #22272B 106.67%);
  border: 1px solid #000000;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.9);
  border-radius: 40px;
`;

const SelectorContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-evenly;
  padding: 2px;

  /* Basic style */
  height: 44px;
  width: 200px;

  /* Background */
  background: linear-gradient(0deg, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)),
    linear-gradient(311.52deg, #3d464c -36.37%, #131619 62.81%);

  /* Border */
  border: 1px solid rgba(130, 130, 149, 0.3);
  border-radius: 35px;
`;

const SelectorButton = styled(Button) <{ active?: boolean }>`
  width: 95px;
  height: 36px;
  border-radius: 34px;

  /* Text */
  span {
    font-weight: 700;
    font-size: 18px;
  }

  ${(props) =>
    props.active &&
    css`
      background:
        linear-gradient(0deg, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)),
        linear-gradient(73.6deg, #85FFC4 2.11%, #5CC6FF 90.45%);
      
      span {
        color: #00D1FF;
      }
    `}

  ${(props) =>
    !props.active &&
    css`
      background: none;
      border: none;
      box-shadow: none;
    `}
`;

const WrapprContainerColumn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;

  /* Basic style */
  height: 438px;
  width: 518px;
  margin-top: 25px;

  /* Background */
  background: linear-gradient(0deg, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)),
    linear-gradient(311.52deg, #3d464c -36.37%, #131619 62.81%);

  /* Border */
  border: 2px solid #000000;
  border-radius: 20px;

  /* Shadow */
  box-shadow: 0px 14px 14px rgba(0, 0, 0, 0.25);
`;

const WrapprContainerRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  width: 100%;
  padding: 30px 30px 0px 30px;

  font-family: "GT America Mono";
  font-style: normal;
  font-weight: 700;
  font-size: 32px;
  line-height: 35px;
`;

const BlackContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  padding: 10px 20px;
  gap: 4px;

  width: 464px;
  height: 102px;

  background: #000000;
  border-radius: 4px;

  span {
    /* Text */
    font-family: "GT America Mono";
    font-style: normal;
    font-weight: 400;
    font-size: 12px;
    line-height: 150%;
    color: #828295;
  }
`;

const BlackContainerRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;

  font-family: "GT America Mono";
  font-style: normal;
  font-weight: 700;
  font-size: 24px;
  line-height: 26px;

  .big {
    flex: 2;
  }

  .align-right {
    text-align: right;
  }
`;

const StyledBlackContainerRow = styled(BlackContainerRow)`
  justify-content: flex-start;
  gap: 4px;
`;

const CurrencySelectorButton = styled(Button)`
  display: flex;
  flex-direction: row;
  align-items: center;

  padding: 0;
  width: 150px;
  height: 37px;

  /* Border */
  border: 1px solid rgba(130, 130, 149, 0.3);
  border-radius: 8px;

  /* Remove background color */
  background: none;
`;

const CurrencyContainer = styled.div<{ active?: boolean }>`
  display: flex;
  flex-direction: row;
  justify-content: left;
  align-items: center;
  gap: 8px;

  padding: 0px 10px;
  width: 100%;
  height: 40px;

  &:hover {
    background: rgba(130, 130, 149, 0.3);
    border-radius: 4px;
  }

  /* Text */
    span {
    font-family: "GT America Mono";
    font-style: normal;
    font-weight: 600;
    font-size: 14px;
    line-height: 20px;
    color: #ffffff;
  }
`;

const StyledCurrencyContainer = styled(CurrencyContainer)`
  justify-content: space-between;
  width: 100%;
  height: 100%;

  &:hover {
  border-radius: 8px;
  }

  /* Text */
  span {
    font-weight: 700;
    font-size: 24px;
    line-height: 29px;
  }
`;

const StyledCurrencyContainer2 = styled(CurrencyContainer)`
  padding: 0;

  /* Text */
  span {
    font-weight: 700;
    font-size: 24px;
    line-height: 29px;
  }
`;

const CurrencySelectorContainerMint = styled.div`
  /* Hide the dropdown menu by default */
  display: none;
  flex-direction: column;
  gap: 10px;
  padding: 0px;

  /* Basic style */
  height: 80px;
  width: 120px;

  /* Background */
  background: linear-gradient(0deg, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)),
    linear-gradient(311.52deg, #3d464c -36.37%, #131619 62.81%);

  /* Border */
  border: 1px solid #8282954d;
  border-radius: 4px;

  /* Shadow */
  box-shadow: 0px 14px 14px rgba(0, 0, 0, 0.25);
`;

const CurrencySelectorContainerBurn = styled.div`
  /* Hide the dropdown menu by default */
  display: none;
  flex-direction: column;
  gap: 10px;
  padding: 0px;

  /* Basic style */
  height: 80px;
  width: 120px;

  /* Background */
  background: linear-gradient(0deg, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)),
    linear-gradient(311.52deg, #3d464c -36.37%, #131619 62.81%);

  /* Border */
  border: 1px solid #8282954d;
  border-radius: 4px;

  /* Shadow */
  box-shadow: 0px 14px 14px rgba(0, 0, 0, 0.25);
`;

const CurrencySelectoDropdown = styled.div<{ active?: boolean }>`
  flex-direction: column;
  gap: 8px;

  /* Reveal the dropdown menu when the button is clicked and then if the dropdown menu is hovered */
  &:hover,
  > ${(props) => props.active ? CurrencySelectorContainerMint : CurrencySelectorContainerBurn}:hover {
    display: flex;

    > ${(props) => props.active ? CurrencySelectorContainerMint : CurrencySelectorContainerBurn} {
      position: absolute;
      display: flex;
      margin-top: 38px;
      flex-direction: column;
      align-items: flex-start;
      padding: 4px;
    }
  }
`;

const MaxButton = styled.button`
  display: flex;

  /* Remove button styling */
  background: none;
	border: none;
	padding: 0;
	font: inherit;
	cursor: pointer;
	outline: inherit;

  padding-left: 10px;

  span {
    color: #00D1FF;
  }

  &:hover {
    span {
      color: #828295;
    }
  }

  &:active {
    span {
      color: #00D1FF;
    }
  }
`;

const NumericInput = styled.input`
    /* Remove default styling */
    width: 50%;
    height: 100%;

    / * Remove default styling */
    padding: 0;
	background: none;
	border: none;
	border-radius: 0;
	outline: none;
	-webkit-appearance: none;
	-moz-appearance: none;
	appearance: none;

    /* Text */
    font-family: 'GT America Mono';
    font-style: normal;
    font-weight: 700;
    font-size: 24px;
    line-height: 26px;
    color: #FFFFFF;
    text-align: right;
`;

const ArrowButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;

  padding: 10px;

  background: #000000;
  border: 1px solid #000000;
  border-radius: 20px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.9);

  &:hover {
    border: 1px solid rgba(130, 130, 149, 0.3);
    background:
      linear-gradient(0deg, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)),
      linear-gradient(311.52deg, #3D464C -36.37%, #131619 62.81%);
  }

  &:active {
    box-shadow: inset -1px -1px 1px rgba(255, 255, 255, 0.15);
  }
`;

const SwapButton = styled(Button) <{ active?: boolean }>`
  width: 464px;
  height: 40px;

  background: rgba(86, 86, 99, 0.6);
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.9);

  span {
    color: #565663;
    font-weight: 550;
    font-size: 20px;
    line-height: 29px;
  }

  ${(props) =>
    props.active &&
    css`
      background:
        linear-gradient(0deg, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)),
        linear-gradient(73.6deg, #85FFC4 2.11%, #5CC6FF 90.45%);
      
      span {
        color: #00D1FF;
      }
    `}

`;

const CapacityContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;

  /* Basic style */
  height: 150px;
  width: 518px;
  margin-top: 24px;
  padding: 15px;

  /* Background */
  background: linear-gradient(0deg, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)),
    linear-gradient(311.52deg, #3d464c -36.37%, #131619 62.81%);

  /* Border */
  border: 2px solid #000000;
  border-radius: 20px;

  /* Shadow */
  box-shadow: 18px 18px 36px rgba(0, 0, 0, 0.25);
`;

const TitleContainer = styled.div`
  width: 100%;
  text-align: center;

  /* Text */
  span {
    font-family: "GT America Mono";
    font-style: normal;
    font-weight: 700;
    font-size: 24px;
    line-height: 26px;
    color: #ffffff;
  }
`;

const ColumnContainer = styled.div`
  display: flex;
  flex-direction: column;

  span {
    font-family: "GT America Mono";
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    line-height: 21px;
  }

  .align-right {
    text-align: right;
  }

  .bold {
    font-weight: 700;
  }
`;

const CapacityDescriptionContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 0px 10px;

  & ${ColumnContainer}:nth-child(2) {
    text-align: right;
  }
`;

const GaugeContainer = styled.div`
  width: 95%;
  height: 26px;

  /* Border */
  border: 1px solid transparent;
  background: linear-gradient(#000000 0 0) padding-box,
    linear-gradient(73.6deg, #85ffc4 2.11%, #5cc6ff 90.45%) border-box;
  border-radius: 80px;
`;

const GaugeProgress = styled.div<{ percentage: number }>`
  width: 0%;
  height: 12px;
  margin: 6px 6px;

  background:
    linear-gradient(73.6deg, #85ffc4 2.11%, #5cc6ff 90.45%) padding-box,
    linear-gradient(#000000 0 0) border-box;
  border-radius: 50px 0px 0px 50px;

  /* Percentage */
  &:after {
    height: 100%;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    
    font-family: 'GT America Mono';
    font-style: normal;
    font-weight: 400;
    font-size: 12px;
    line-height: 150%;
    color: #FFFFFF;
  }

  ${(props) =>
    props.percentage >= 0 &&
    props.percentage < 100 &&
    css`
      width: ${(props.percentage * 97) / 100}%;

      &:after {
        content: '${props.percentage}%';
        width: calc(100% + ${props.percentage.toString().length} * 1ch + 2ch);
      }
    `}

  ${(props) =>
    props.percentage >= 100 &&
    css`
      width: 97.5%;
      border-radius: 50px 50px 50px 50px;

      &:after {
        content: '100%';
        width: calc(100% + 5.5ch);
      }
    `}
`;

const TooltipBox = styled.div`
  /* Hide the dropdown menu by default */
  display: none;
  flex-direction: column;
  justify-content: center;
  padding: 18px 16px;
  gap: 10px;

  /* Basic style */
  height: 100px;
  width: 225px;

  /* Background */
  background: rgba(86, 86, 99, 0.9);

  /* Border */
  border: 3px solid black;
  border-radius: 10px;

  span {
    font-family: "GT America Mono";
    font-style: normal;
    font-weight: 400;
    font-size: 12px;
    line-height: 16px;
    text-align: center;
    color: #FFFFFF;
  }
`;

const BlueInfoButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;

  padding: 0px;

  background: none;
  border: none;
  border-radius: 20px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.9);

  /* Reveal the dropdown menu when the button is clicked and then if the dropdown menu is hovered */
  &:hover,
  > ${TooltipBox}:hover {
    display: flex;

    > ${TooltipBox} {
      position: absolute;
      display: flex;
      margin-bottom: 110px;
      margin-left: 60px;
    }
  }

  &:active {
    box-shadow: inset -1px -1px 1px rgba(255, 255, 255, 0.15);
  }
`;

export default Wrappr;
