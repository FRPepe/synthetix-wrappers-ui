import { useState } from "react";
import Head from "next/head";
import styled, { css } from "styled-components";

import styles from "../styles/Home.module.css";

import Header from "../sections/home/Header";
import Content from "../sections/home/Content";
import Footer from "../sections/home/Footer";
import Wallet from "../sections/home/WalletOverlay";

const HomePage = () => {
  const [showWalletOverlay, setShowWalletOverlay] = useState<boolean>(false);

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
        <Home showWalletOverlay={showWalletOverlay}>
          <Header onConnect={() => setShowWalletOverlay(true)} />
          <Content />
          <Footer />
        </Home>
        <StyledWalletOverlay
          display={showWalletOverlay}
          onClose={() => setShowWalletOverlay(false)}
        />
      </main>
    </>
  );
};

const Home = styled.div<{ showWalletOverlay: boolean }>`
  /* Make the background blur if the wallet overlay is displayed */
  ${(props) =>
    props.showWalletOverlay &&
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

export default HomePage;
