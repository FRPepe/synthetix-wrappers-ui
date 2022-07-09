import { FC } from "react";
import styled from "styled-components";
import Image from "next/image";

import Button from "../../components/Button";
import CrossIcon from "../../assets/utils/cross.svg";

type LoadingWeb3Props = {
  display: boolean;
  errorMessage: string;
  setErrorMessage: (errorMessage: string) => void;
};

const ErrorMessage: FC<LoadingWeb3Props> = ({ display, errorMessage, setErrorMessage }) => {

  return (
    <>
      {display && (
        <Overlay>
          <Container>
            <CrossContainer>
              <div style={{ width: "100%" }}>
              </div>
              <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
                <h1>Error :</h1>
              </div>
              <div style={{ width: "100%", display: "flex", justifyContent: "end" }}>
                <Button size="xs" onClick={() => setErrorMessage('')}>
                  <Image src={CrossIcon} alt="cross-icon" priority={true} />
                </Button>
              </div>
            </CrossContainer>
            <div style={{ textAlign: "center" }}>
              <span>{errorMessage}</span>
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
  padding: 0px 20px 0px 20px;

  /* Basic styling */
  width: 300px;
  height: 180px;

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

const CrossContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  margin-bottom: 10px;
`;

export default ErrorMessage;
