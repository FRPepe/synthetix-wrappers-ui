import { FC } from "react";
import styled, { css } from "styled-components";
import Image from "next/image";

import Button from "../../components/Button";

import SynthetixLogo from "../../assets/logos/synthetix.svg";
import EthereumLogo from "../../assets/logos/ethereum.svg";
import OptimismLogo from "../../assets/logos/optimism.svg";
import DownArrow from "../../assets/utils/down-arrow.svg";
import BadgeLive from "../../assets/utils/badge-live.svg";
import CrossIcon from "../../assets/utils/cross.svg";

type HeaderProps = {
  onConnect: () => void;
  account: string;
  chainId: number;
  onDisconnectWallet: () => void;
  toggleNetwork: (arg0: number) => void;
};

const Header: FC<HeaderProps> = ({ onConnect, account, chainId, onDisconnectWallet, toggleNetwork }) => {

  return (
    <Container>
      <Image src={SynthetixLogo} alt="synthetix-logo" priority={true} />
      <MenuContainer>
        <NetworkContainerDropdown>
          <Button>
            <NetworkContainer>
              <Image src={chainId == 10 ? OptimismLogo : EthereumLogo} alt="ethereum-logo" priority={true} />
              <span>{chainId == 10 ? 'Optimism' : 'Ethereum'}</span>
              <Image src={DownArrow} alt="down-arrow" priority={true} />
            </NetworkContainer>
          </Button>
          <NetworkSelectorContainer>
            <StyledNetworkContainer
              onClick={() => toggleNetwork(10)}
            >
              <Image src={OptimismLogo} alt="optimism-logo" priority={true} />
              <span>Optimism</span>
              <img src={BadgeLive.src} alt="live-logo" style={{ display: chainId == 10 && account.length > 0 ? 'flex' : 'none', height: "25px", width: "25px" }} />
            </StyledNetworkContainer>
            <StyledNetworkContainer
              onClick={() => toggleNetwork(1)}
            >
              <Image src={EthereumLogo} alt="ethereum-logo" priority={true} />
              <span>Ethereum</span>
              <img src={BadgeLive.src} alt="live-logo" style={{ display: chainId == 1 && account.length > 0 ? 'flex' : 'none', height: "25px", width: "25px" }} />
            </StyledNetworkContainer>
          </NetworkSelectorContainer>
        </NetworkContainerDropdown>
        <ConnectWalletButton onClick={onConnect}>
          <span>{account.length > 0 ? account.slice(0, 7) + '...' + account.slice(-5) : 'Connect Wallet'}</span>
        </ConnectWalletButton>
        <Button
          size="sm"
          onClick={onDisconnectWallet}
          style={{ height: "35px", width: "35px" }}
        >
          <Image src={CrossIcon} alt="cross-icon" />
        </Button>
      </MenuContainer>
    </Container>
  );
};

const BaseContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const Container = styled(BaseContainer)`
  justify-content: space-between;
  padding: 40px;
  width: 100%;
`;

const MenuContainer = styled(BaseContainer)`
  justify-content: center;
  padding: 0px;
  gap: 18px;
`;

const NetworkSelectorContainer = styled.div`
  /* Hide the dropdown menu by default */
  display: none;
  flex-direction: column;
  gap: 10px;
  padding: 8px;

  /* Basic style */
  height: 114px;
  width: 160px;

  /* Background */
  background: linear-gradient(0deg, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)),
    linear-gradient(311.52deg, #3d464c -36.37%, #131619 62.81%);

  /* Border */
  border: 1px solid #8282954d;
  border-radius: 4px;
`;

const NetworkContainer = styled(BaseContainer)`
  justify-content: center;
  gap: 5px;
`;

const StyledNetworkContainer = styled(NetworkContainer) <{ active?: boolean }>`
  padding: 8px;
  justify-content: left;

  ${(props) =>
    props.active &&
    css`
      background: rgba(130, 130, 149, 0.3);
      border-radius: 4px;
    `}

  /* Text */
    span {
    color: #ffffff;
    font-family: "GT America Mono";
    font-style: normal;
    font-weight: 600;
    font-size: 14px;
    line-height: 20px;
  }

  &:hover {
    background: rgba(130, 130, 149, 0.3);
    border-radius: 4px;
  }
`;

const NetworkContainerDropdown = styled(BaseContainer)`
  flex-direction: column;
  gap: 8px;

  /* Reveal the dropdown menu when the button is clicked and then if the dropdown menu is hovered */
  &:hover,
  > ${NetworkSelectorContainer}:hover {
    display: flex;

    > ${NetworkSelectorContainer} {
      position: absolute;
      display: flex;
      margin-top: 45px;
    }
  }
`;

const ConnectWalletButton = styled(Button)`
  /* Remove break lines */
  white-space: nowrap;

  /* Border */
  border: 2px solid transparent;
  background: linear-gradient(#000000 0 0) padding-box,
    linear-gradient(73.6deg, #85ffc4 2.11%, #5cc6ff 90.45%) border-box;

  /* Text */
  span {
    font-weight: 700;

    /* Gradient */
    background-color: white;
    background-image: linear-gradient(73.6deg, #85ffc4 2.11%, #5cc6ff 90.45%);
    background-size: 100%;
    background-repeat: repeat;
    -webkit-text-fill-color: transparent;
    -webkit-background-clip: text;
    color: transparent;
  }

  &:hover {
    border-width: 3px;
    background: linear-gradient(#000000 0 0) padding-box,
      linear-gradient(-73.6deg, #85ffc4 2.11%, #5cc6ff 90.45%) border-box;
  }

  &:active {
    border-width: 4px;
    box-shadow: inset -2px -2px 3px rgba(255, 255, 255, 0.25);
  }
`;

export default Header;
