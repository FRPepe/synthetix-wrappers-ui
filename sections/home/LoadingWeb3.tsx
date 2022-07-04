import { FC, useState, useEffect } from "react";
import styled from "styled-components";
import Image from "next/image";

import Spinner from "../../assets/utils/spinner.png";

type LoadingWeb3Props = {
  display: boolean;
};

const LoadingWeb3: FC<LoadingWeb3Props> = ({ display }) => {

  return (
    <>
      {display && (
        <Overlay>
          <Container>
            <h1>Web3 data loading...</h1>
            <CrossContainer>
              <img alt="spinner" src={Spinner.src} style={{ height: "28px", width: "28px" }} />
            </CrossContainer>
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
  width: 220px;
  height: 150px;

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
    font-family: "Inter";
    font-style: normal;
    font-weight: 700;
    font-size: 18px;
    line-height: 20px;
    color: #ffffff;
  }

`;

const CrossContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
`;

export default LoadingWeb3;
