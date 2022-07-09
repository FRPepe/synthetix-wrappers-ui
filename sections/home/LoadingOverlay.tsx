import { FC } from "react";
import styled, { css } from "styled-components";
import Image from "next/image";

import Spinner from "../../assets/utils/spinner.png";
import Button from "../../components/Button";
import CrossIcon from "../../assets/utils/cross.svg";
import Success from "../../assets/utils/success.svg";
import Revert from "../../assets/utils/revert.svg";

type LoadingProps = {
  display: boolean;
  loadingMessage: string;
  optionalExplorerLink: string;
  setLoadingMessage: (loadingMessage: string) => void;
  setExplorerLink: (explorerLink: string) => void;
};

const LoadingOverlay: FC<LoadingProps> = ({ display, loadingMessage, optionalExplorerLink, setLoadingMessage, setExplorerLink }) => {

  const handleClose = () => {
    setLoadingMessage('');
    setExplorerLink('');
  }

  return (
    <>
      {display && (
        <Overlay>
          <Container>
            <CrossContainer active={loadingMessage == 'Transaction Confirmed !' || loadingMessage == 'Transaction Reverted !'}>
              <Button size="xs" onClick={() => handleClose()}>
                <Image src={CrossIcon} alt="cross-icon" priority={true} />
              </Button>
            </CrossContainer>
            <h1 style={{ textAlign: "center", marginBottom: "15px" }}>{loadingMessage}</h1>
            <SpinnerContainer active={loadingMessage == 'Web3 data loading...' || loadingMessage == 'Please confirm the transaction...' || loadingMessage == 'Transaction pending...'}>
              <img alt="spinner" src={Spinner.src} style={{ height: "28px", width: "28px" }} />
            </SpinnerContainer>
            <div style={{ display: loadingMessage == 'Transaction Confirmed !' ? "flex" : "none", height: "28px", width: "28px", marginBottom: "5px" }}>
              <Image src={Success} alt="success-icon" priority={true} />
            </div>
            <div style={{ display: loadingMessage == 'Transaction Reverted !' ? "flex" : "none", height: "28px", width: "28px", marginBottom: "5px" }}>
              <Image src={Revert} alt="revert-icon" priority={true} />
            </div>
            <div style={{ display: optionalExplorerLink.length > 0 ? "flex" : "none", marginTop: "5px" }}>
              <a href={optionalExplorerLink} target="_blank" >
                <span>{optionalExplorerLink.slice(0, 28) + '...' + optionalExplorerLink.slice(-6)}</span>
              </a>
            </div>
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
  padding: 20px 20px 20px 20px;


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
    padding-top: 0px;
    font-family: "GT America Mono";
    font-style: normal;
    font-weight: 700;
    font-size: 18px;
    line-height: 20px;
    color: #ffffff;
  }

  span {
    font-family: "GT America Mono";
  }

`;

const SpinnerContainer = styled.div<{ active: boolean }>`
  width: 100%;
  display: none;
  flex-direction: row;
  justify-content: center;
  margin-bottom: 5px;

  ${(props) =>
    props.active &&
    css`
      display: flex;
    `}
`;

const CrossContainer = styled.div<{ active: boolean }>`
  width: 100%;
  display: none;
  flex-direction: row;
  justify-content: flex-end;
  margin-bottom: 5px;

  ${(props) =>
    props.active &&
    css`
      display: flex;
    `}
`;

export default LoadingOverlay;
