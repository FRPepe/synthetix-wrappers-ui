import { FC } from 'react';
import styled from 'styled-components';
import Image from 'next/image';

import Button from '../components/Button';

import Gear from '../assets/utils/gear.svg';
import Arrows from '../assets/utils/arrows.svg';

const Wrappr: FC = () => {
    return(
        <Container>
            <SelectorContainer>
            </SelectorContainer>
            <WrapprContainerColumn>
                <WrapprContainerRow>
                    <span>Wrappr</span>
                    <GearButton
                        size='sm'
                        onClick={() => console.log('You clicked on the gear button!')}
                    >
                        <Image src={Gear} priority={true}/>
                    </GearButton>
                </WrapprContainerRow>
                <BlackContainer>
                    
                </BlackContainer>
                <ArrowButton>
                    <Image src={Arrows} priority={true}/>
                </ArrowButton>
                <BlackContainer>
                </BlackContainer>
                <ActionButton>
                    <span>Select amount to wrap</span>
                </ActionButton>
            </WrapprContainerColumn>
            <CapacityContainer>
            </CapacityContainer>
        </Container>
    );
};

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    padding: 30px 40px 0px 40px;
`;

const SelectorContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 4px 12px 4px 4px;
    gap: 10px;

    /* Basic style */
    height: 44px;
    width: 210px;

    /* Background */
    background:
        linear-gradient(0deg, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)),
        linear-gradient(311.52deg, #3D464C -36.37%, #131619 62.81%);

    /* Border */
    border: 1px solid rgba(130, 130, 149, 0.3);
    border-radius: 35px;
`;


const WrapprContainerColumn = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 15px;

    /* Basic style */
    height: 400px;
    width: 518px;
    margin-top: 25px;

    /* Background */
    background:
        linear-gradient(0deg, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)),
        linear-gradient(311.52deg, #3D464C -36.37%, #131619 62.81%);

    /* Border */
    border: 2px solid #000000;
    border-radius: 20px;

    /* Shadow */
    box-shadow: 0px 14px 14px rgba(0, 0, 0, 0.25);
`;

const WrapprContainerRow = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;
    width: 100%;
    padding: 30px 30px 0px 30px;

    font-family: 'Inter';
    font-style: normal;
    font-weight: 700;
    font-size: 32px;
    line-height: 35px;
`;

const BlackContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 12px 12px 8px;
    gap: 4px;

    width: 464px;
    height: 79px;

    background: #000000;
    border-radius: 4px;
`;

const GearButton = styled(Button)`
    padding-top: 12px;
`;

const ArrowButton = styled.button`
    padding: 10px;
    
    background: #000000;
    border: 2px solid #000000;
    border-radius: 100px;

    &:hover {
        background: #FFFFFF;
    }

    &:active {
        border: 2px solid #FFFFFF;
    }
`;

const ActionButton = styled(Button)`
    width: 464px;
    height: 40px;

    background: rgba(86, 86, 99, 0.6);
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.9);

    span {
        color: #565663;
    }
`;

const CapacityContainer = styled.div`
    /* Basic style */
    height: 140px;
    width: 518px;
    margin-top: 24px;

    /* Background */
    background:
        linear-gradient(0deg, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)),
        linear-gradient(311.52deg, #3D464C -36.37%, #131619 62.81%);

    /* Border */
    border: 2px solid #000000;
    border-radius: 20px;

    /* Shadow */
    box-shadow: 18px 18px 36px rgba(0, 0, 0, 0.25);
`;

export default Wrappr;
