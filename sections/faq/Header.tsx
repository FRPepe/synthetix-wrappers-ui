import { FC } from "react";
import styled from "styled-components";

const Header: FC = () => {
  return (
    <Container>
      <p>You're on the FAQ page! :)</p>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

export default Header;
