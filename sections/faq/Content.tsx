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
        answer: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras at iaculis odio diam pretium risus. Ornare id eu ut sed. Sit convallis purus suspendisse purus praesent nec massa, pellentesque purus. Integer molestie tempus volutpat eget risus, in pellentesque dolor.',
        open: false
      },
      {
        logo: RocketLogo,
        category: 'GETTING STARTED',
        question: 'Lorem Ipsum',
        answer: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras at iaculis odio diam pretium risus. Ornare id eu ut sed. Sit convallis purus suspendisse purus praesent nec massa, pellentesque purus. Integer molestie tempus volutpat eget risus, in pellentesque dolor.',
        open: false
      },
      {
        logo: RocketLogo,
        category: 'GENERAL',
        question: 'Lorem Ipsum',
        answer: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras at iaculis odio diam pretium risus. Ornare id eu ut sed. Sit convallis purus suspendisse purus praesent nec massa, pellentesque purus. Integer molestie tempus volutpat eget risus, in pellentesque dolor.',
        open: true
      },
      {
        logo: PictureLogo,
        category: 'WRAP',
        question: 'Lorem Ipsum',
        answer: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras at iaculis odio diam pretium risus. Ornare id eu ut sed. Sit convallis purus suspendisse purus praesent nec massa, pellentesque purus. Integer molestie tempus volutpat eget risus, in pellentesque dolor.',
        open: false
      },
      {
        logo: PictureLogo,
        category: 'WRAP',
        question: 'Lorem Ipsum',
        answer: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras at iaculis odio diam pretium risus. Ornare id eu ut sed. Sit convallis purus suspendisse purus praesent nec massa, pellentesque purus. Integer molestie tempus volutpat eget risus, in pellentesque dolor.',
        open: false
      },
      {
        logo: PictureLogo,
        category: 'UNWRAP',
        question: 'Lorem Ipsum',
        answer: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras at iaculis odio diam pretium risus. Ornare id eu ut sed. Sit convallis purus suspendisse purus praesent nec massa, pellentesque purus. Integer molestie tempus volutpat eget risus, in pellentesque dolor.',
        open: false
      },
      {
        logo: PictureLogo,
        category: 'UNWRAP',
        question: 'Lorem Ipsum',
        answer: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras at iaculis odio diam pretium risus. Ornare id eu ut sed. Sit convallis purus suspendisse purus praesent nec massa, pellentesque purus. Integer molestie tempus volutpat eget risus, in pellentesque dolor.',
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
