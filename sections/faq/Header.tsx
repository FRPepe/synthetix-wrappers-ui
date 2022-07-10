import { FC } from "react";
import styled from "styled-components";
import Image from "next/image";
import Link from "next/link";

import SynthetixLogo from "../../assets/logos/synthetix.svg";
import Button from "../../components/Button";
import LinkArrow from "../../assets/utils/link-arrow.svg";


const Header: FC = () => {
  return (
    <Container>
      <LogoAndButtonContainer>
        <Image src={SynthetixLogo} alt="synthetix-logo" priority={true} />
        <Link href="/">
          <LinkToWrapperButton>
            <span>GO TO WRAPPR</span>
            <Image src={LinkArrow} alt="link-arrow" priority={true} style={{ marginLeft: "2.5px" }} />
          </LinkToWrapperButton>
        </Link>
      </LogoAndButtonContainer>
      <HeaderTextContainer>
        <span>SYNTHETIX</span>
        <h1>Wrappr Help Center</h1>
      </HeaderTextContainer>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  margin-top: 80px;
`;

const LogoAndButtonContainer = styled.div`
  display: flex;
  width: 700px;
  flex-direction: row;
  justify-content: space-between;
`;

const LinkToWrapperButton = styled(Button)`
  width: 100%;
  width: 150px;
  height: 32px;
  margin-left: 84px;

  background: linear-gradient(121.5deg, #101215 55.37%, #22272B 106.67%);
  border: 1px solid #000000;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.9);
  border-radius: 40px;
`;

const HeaderTextContainer = styled.div`
  width: 700px;
  align-items: left;
  margin-top: 15px;
  margin-left: 3px;

  span {
    font-family: 'GT America Mono';
    font-style: normal;
    font-weight: 700;
    font-size: 12px;
    line-height: 13px;
  }

  h1 {
    font-family: 'Inter';
    font-style: normal;
    font-weight: 700;
    font-size: 32px;
    line-height: 35px;
    margin-top: 10px;
  }
`;


export default Header;
