import { FC, useState } from "react";
import styled, { css } from "styled-components";
import Image from "next/image";

import FAQArrowDown from "../../assets/utils/FAQArrowDown.svg";
import FAQArrowUp from "../../assets/utils/FAQArrowUp.svg";
import RocketLogo from "../../assets/utils/RocketLogo.svg";
import PictureLogo from "../../assets/utils/PictureLogo.svg";

const Content: FC = () => {

  const [FAQs, setFAQs] = useState(
    [
      {
        logo: RocketLogo,
        category: 'GETTING STARTED',
        question: 'What is Wrappr?',
        answer: ['A wrapper functions as an AMM that is always willing to swap, e.g. 1 ETH to/from 1sETH.  This allows an alternative way of deploying capital into the Synthetix ecosystem.', <br/>, 'At the present time, there are lusd <> susd and eth <> seth wrappers.  For example, if you have 100 ETH and want to deploy that capital into Synthetix you could sell the ETH for stables, swap into sUSD and then trade at Kwenta or Lyra.', <br/>, 'However, those transactions may incur fees and slippage in ways that are not as efficient as possible.  A wrapper might allow the user to instead swap 100 ETH directly into 100 sETH.  A potentially more efficient and elegant solution depending on available liquidity in the wrappers.'],
        open: false
      },
      {
        logo: RocketLogo,
        category: 'GETTING STARTED',
        question: 'Why use a wrapper?',
        answer: ['While many traders may wish to simply swap their stablecoin into sUSD to trade through the Synthetix ecosystem, some users may find it more simple or capital efficient to directly swap their other digital assets into synths and begin interacting this way.', <br/>, 'In addition, there have been periods where sUSD liquidity has fluctuated due to increased demand and wrappers can provide an alternative source of entry into the system.  Wrappers mostly help make synths "cheaper" to aquire.'],
        open: false
      },
      {
        logo: RocketLogo,
        category: 'GENERAL',
        question: 'Will I be able to "unwrap" my collateral?',
        answer: ['Like virtually all aspects of DeFi, there are periodic liquidity constraints and times where one route may be unavailable.  For example, wrapped ETH is not "held" pending unwrapping for individual users.  So, if the wrapper has no liquidity left to swap sETH back to ETH, then a user may need to swap on a secondary AMM.', <br/>, 'There has generally always been consistent liquidity available on secondary markets near to peg for ETH and sETH, e.g. Curve.Fi and also Velodrome.Finance on Optimism.  As well as the ability to swap sETH to sUSD and then sUSD to USDC, DAI, USDT, etc.'],
        open: false
      },
      {
        logo: PictureLogo,
        category: 'FEES',
        question: 'What are the fees for wrappers?',
        answer: 'Mint/burn fees are configurable and Synthetix governance can and does change these fees based on market conditions. The UI will display the current fees applicable, which are always subject to change based on governance decisions.',
        open: false
      },
      {
        logo: PictureLogo,
        category: 'FEES',
        question: 'Why would Synthetix governance change fees?',
        answer: ['What is important to understand is that wrappers are an alternate source of entering/exiting positions in Synthetix and are often an efficient route for advanced users under certain market conditions. Fees are reasonable as these contracts are basically fixed price stableswap AMMs (like a Curve.Fi pool with A-factor set to infinity).', <br/>, 'Governance has in the past changed fees to capture arbitrage premium should a secondary synthetic market deviate from the intended peg. For example, if sETH is trading at 1.01 ETH, governance might set the fee to 90bp so it gets arbitraged down to 1.009 ETH - and then walk it down gradually so stakers earn profit from the premium on the way down.', <br/>, 'Other times in the past, governance has also changed mint/burn fees in different wrappers to direct arbitrage traders through one or the other. For instance, if the debt pool is very long ETH and synths are at a premium, governance might increase the mint fee on the LUSD wrapper and lower it on the ETH wrapper so people wrap ETH to arb instead of LUSD.', <br/>, 'Again, these are decisions made to generally provide options to users and create incentives to ensure a proper functioning marketplace for all Synthetix ecosystem users.'],
        open: false
      },
      {
        logo: PictureLogo,
        category: 'FEES',
        question: 'What part of Synthetix governance changes fees?',
        answer: 'Fees are presently set by the Spartan Council.',
        open: false
      },
    ]
  );

  const handleOpen = (index: number) => {
    let newFAQs = [...FAQs];
    newFAQs[index].open = !newFAQs[index].open;
    setFAQs(newFAQs);
  }

  return (
    <Container>
      <QuestionsContainer>
        {FAQs.map((faq, i) => (
          <QuestionBox key={i}>
            <TopPart>
              <Image src={faq.logo} alt="rocket-logo" priority={true} />
              <TextContainer>
                <h3>{faq.category}</h3>
                <span>{faq.question}</span>
              </TextContainer>
              <ArrowButton onClick={() => handleOpen(i)}>
                <Image src={faq.open ? FAQArrowDown : FAQArrowUp} alt="rocket-logo" priority={true} />
              </ArrowButton>
            </TopPart>
            <AnswerContainer active={faq.open}>
              <p>{faq.answer}</p>
            </AnswerContainer>
          </QuestionBox>
        ))}
      </QuestionsContainer>
    </Container>
  );
};

const AnswerContainer = styled.div<{ active?: boolean }>`
  display: none;
  padding-right: 20px;
  margin-top: 5px;

  p {
    margin: 0px;
    font-family: 'GT America Mono';
    font-style: normal;
    font-weight: 300;
    font-size: 14px;
    line-height: 150%;
    color: #FFFFFF;
  }

  ${(props) =>
    props.active &&
    css`
      display: flex;
    `}
`;

const ArrowButton = styled.div`
  background: linear-gradient(121.5deg, #101215 55.37%, #22272B 106.67%);
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.9);
  border-radius: 40px;

  width: 35px;
  height: 35px;

  display: flex;
  align-items: center;
  justify-content: center;

  margin-left: auto;

  &:hover {
    background: rgba(130, 130, 149, 0.3);
  }
`;

const TextContainer = styled.div`
  display: flex;
  flex-direction: column;

  h3 {
    margin: 0px;
    font-family: 'GT America Mono';
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    line-height: 14px;
    color: #828295;
  }

  span {
    margin-top: 2px;
    font-family: 'GT America Mono';
    font-style: normal;
    font-weight: 700;
    font-size: 16px;
    line-height: 21px;
    color: #FFFFFF;
  }

`;

const TopPart = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
  width: 100%;

  align-items: flex-start;
`;

const QuestionBox = styled.div`
  display: flex;
  flex-direction: column;

  align-items: flex-start;

  padding: 15px 14px 15px 24px;
  background: linear-gradient(121.5deg, #101215 55.37%, #22272B 106.67%);
  border: 3px solid #000000;
  box-shadow: 0px 14px 14px rgba(0, 0, 0, 0.25);
  border-radius: 5px;
`;

const QuestionsContainer = styled.div`
  width: 700px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 5px;

  margin-top: 20px;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100%;
`;

export default Content;
