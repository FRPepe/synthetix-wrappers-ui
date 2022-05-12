import { FC } from 'react';
import styled from 'styled-components';

import Button from '../components/Button';

const Footer: FC = () => {
    return (
        <Container>
            <SquareButton
                size='sm'
                onClick={() => console.log('You clicked on the question mark button!')}
            >
                <span>?</span>
            </SquareButton>
        </Container>
    );
};

const Container = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    width: 100%;
    padding: 40px;
`;

const SquareButton = styled(Button)`
    span {
        font-size: 20px;
    }
`;

export default Footer;
