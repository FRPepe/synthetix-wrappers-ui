import { FC } from 'react';
import styled, { css } from 'styled-components';
import Image from 'next/image';

import Button from '../components/Button';

import Gear from '../assets/utils/gear.svg';
import Arrows from '../assets/utils/arrows.svg';
import EthereumLogo from '../assets/logos/ethereum.svg';
import sLUSDLogo from '../assets/synths/sLUSD.svg';
import DownArrowSmall from '../assets/utils/down-arrow-small.svg';

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
                    <BlackContainerRow>
                        <CurrencySelectoDropdown>
                            <CurrencySelectorButton
                                onClick={() => console.log('You clicked on the first currency selector!')}
                            >
                                <StyledCurrencyContainer>
                                    <Image src={EthereumLogo} priority={true}/>
                                    <span>ETH</span>
                                    <Image src={DownArrowSmall} priority={true}/>
                                </StyledCurrencyContainer>
                            </CurrencySelectorButton>
                            <CurrencySelectorContainer>
                                <CurrencyContainer>
                                    <Image src={sLUSDLogo} priority={true}/>
                                    <span>LUSD</span>
                                </CurrencyContainer>
                                <CurrencyContainer
                                    active={true}
                                >
                                    <Image src={EthereumLogo} priority={true}/>
                                    <span>ETH</span>
                                </CurrencyContainer>
                            </CurrencySelectorContainer>
                        </CurrencySelectoDropdown>
                        <NumericInput
                            type='text'
                            placeholder='0.0'
                        />
                    </BlackContainerRow>
                    <span>Balance: 129,937,738.0838</span>
                </BlackContainer>
                <ArrowButton
                    onClick={() => console.log('You clicked on the double arrows button!')}
                >
                    <Image src={Arrows} priority={true}/>
                </ArrowButton>
                <BlackContainer>
                </BlackContainer>
                <ActionButton
                    onClick={() => console.log('You clicked on the action button!')}
                >
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
    justify-content: center;
    padding: 10px 20px;
    gap: 4px;

    width: 464px;
    height: 79px;

    background: #000000;
    border-radius: 4px;

    span {
        /* Text */
        font-family: 'Inter';
        font-style: normal;
        font-weight: 400;
        font-size: 12px;
        line-height: 150%;
        color: #828295;
    }
`;

const BlackContainerRow = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;
    width: 100%;

    font-family: 'Inter';
    font-style: normal;
    font-weight: 700;
    font-size: 24px;
    line-height: 26px;
`;

const CurrencySelectorButton = styled(Button)`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;

    width: 138px;
    height: 37px;

    /* Border */
    border: 1px solid rgba(130, 130, 149, 0.3);
    border-radius: 8px;

    /* Remove background color */
    background: none;
`;

const CurrencyContainer = styled.div<{active?: boolean}>`
    display: flex;
    flex-direction: row;
    justify-content: left;
    align-items: center;
    gap: 8px;

    padding: 0px 10px;
    width: 100%;
    height: 40px;

    ${(props) =>
        props.active &&
        css`
            background: rgba(130, 130, 149, 0.3);
            border-radius: 4px;
        `}

    /* Text */
    span {
        font-family: 'Inter';
        font-style: normal;
        font-weight: 600;
        font-size: 14px;
        line-height: 20px;
        color: #FFFFFF;
    }
`;

const StyledCurrencyContainer = styled(CurrencyContainer)`
    justify-content: space-between;

    /* Text */
    span {
        font-weight: 700;
        font-size: 24px;
        line-height: 29px;
    }
`;

const CurrencySelectorContainer = styled.div`
    /* Hide the dropdown menu by default */
    display: none;
    flex-direction: column;
    gap: 10px;
    padding: 8px;

    /* Basic style */
    height: 104px;
    width: 139px;

    /* Background */
    background:
        linear-gradient(0deg, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)),
        linear-gradient(311.52deg, #3D464C -36.37%, #131619 62.81%);
    
    /* Border */
    border: 1px solid #8282954D;
    border-radius: 4px;

    /* Shadow */
    box-shadow: 0px 14px 14px rgba(0, 0, 0, 0.25);
`;

const CurrencySelectoDropdown = styled.div`
    flex-direction: column;
    gap: 8px;

    /* Reveal the dropdown menu when the button is clicked and then if the dropdown menu is hovered */
    &:hover, > ${CurrencySelectorContainer}:hover {
        display: flex;
        
        > ${CurrencySelectorContainer} {
            position: absolute;
            display: flex;
            margin-top: 44px;
            flex-direction: column;
            align-items: flex-start;
            padding: 12px 8px 8px;
            gap: 14px;
        }
    }
`;

const NumericInput = styled.input`
    /* Remove default styling */
    width: 50%;
    height: 100%;

    / * Remove default styling */
    padding: 0;
	background: none;
	border: none;
	border-radius: 0;
	outline: none;
	-webkit-appearance: none;
	-moz-appearance: none;
	appearance: none;

    /* Text */
    font-family: 'Inter';
    font-style: normal;
    font-weight: 700;
    font-size: 24px;
    line-height: 26px;
    color: #FFFFFF;
    text-align: right;
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
