import { FC, useState, useEffect } from "react";
import styled from "styled-components";
import Image from "next/image";

import Button from "../../components/Button";

import CrossIcon from "../../assets/utils/cross.svg";
import MetamaskIcon from "../../assets/wallets/metamask.svg";
import ConnectMobileIcon from "../../assets/wallets/connect-mobile.svg";

type WalletOverlayProps = {
  display: boolean;
  onClose: () => void;
  onConnectWallet: (providerInput: string) => void;
};

const WalletOverlay: FC<WalletOverlayProps> = ({ display, onClose, onConnectWallet }) => {

  const [isBrowser, setIsBrowser] = useState(false);

  useEffect(() => {
    setIsBrowser(true);
  }, []);

  const handleOnClose = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    onClose();
  };

  return (
    <>
      {display && (
        <Overlay>
          <Container>
            <CrossContainer>
              <Button size="xs" onClick={handleOnClose}>
                <Image src={CrossIcon} alt="cross-icon" priority={true} />
              </Button>
            </CrossContainer>
            <h1>Connect To Wallet</h1>
            <p>Please select a wallet to connect to this dapp:</p>
            <ListContainer>
              <NetworkButton
                onClick={() => onConnectWallet('metamask')}
              >
                <Image src={MetamaskIcon} alt="metamask-icon" priority={true} />
                <span>Browser Wallet</span>
              </NetworkButton>
              <NetworkButton
                onClick={() => onConnectWallet('walletconnect')}
              >
                <Image src={ConnectMobileIcon} alt="connect-mobile-icon" priority={true} />
                <span>Wallet Connect</span>
              </NetworkButton>
            </ListContainer>
          </Container>
        </Overlay>
      )}
    </>
  );
};

const Overlay = styled.div`
  /* Modal styling */
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;

  width: 100%;
  height: 100%;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 30px 20px 0px 20px;

  /* Basic styling */
  width: 370px;
  height: 320px;

  /* Background  */
  background: linear-gradient(0deg, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)),
    linear-gradient(311.52deg, #3d464c -36.37%, #131619 62.81%);

  /* Border */
  border: 2px solid #000000;
  border-radius: 20px;

  /* Shadow */
  box-shadow: 0px 14px 14px rgba(0, 0, 0, 0.25);

  /* Title */
  h1 {
    padding-top: 10px;
    font-family: "GT America Mono";
    font-style: normal;
    font-weight: 700;
    font-size: 18px;
    line-height: 20px;
    color: #ffffff;
  }

  /* Description */
  p {
    font-family: "GT America Mono";
    font-style: normal;
    font-weight: 400;
    font-size: 12px;
    line-height: 140%;
    color: #828295;
  }
`;

const CrossContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
`;

const ListContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 10px;
`;

const StyledButton = styled(Button)`
  /* Remove break lines */
  white-space: nowrap;

  /* Border */
  border: 1px solid transparent;
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
    border-width: 2px;
    background: linear-gradient(#000000 0 0) padding-box,
      linear-gradient(-73.6deg, #85ffc4 2.11%, #5cc6ff 90.45%) border-box;
  }

  &:active {
    border-width: 3px;
    box-shadow: inset -2px -2px 3px rgba(255, 255, 255, 0.25);
  }
`;

const NetworkButton = styled(StyledButton)`
  width: 100%;
  height: 48px;

  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  gap: 20px;
  padding-left: 24px;
`;

export default WalletOverlay;
