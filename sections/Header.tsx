import { FC } from 'react';
import styled, { css } from 'styled-components';
import Image from 'next/image';

import Button from '../components/Button';

import SynthetixLogo from '../assets/logos/synthetix.svg';
import EthereumLogo from '../assets/logos/ethereum.svg';
import OptimismLogo from '../assets/logos/optimism.svg';
import DownArrow from '../assets/utils/down-arrow.svg';
import BadgeLive from '../assets/utils/badge-live.svg';

type HeaderProps = {
    onConnect: () => void;
};

const Header: FC<HeaderProps> = ({
    onConnect,
}) => {
    return (
        <Container>
            <Image src={SynthetixLogo} priority={true}/>
            <MenuContainer>
                <NetworkContainerDropdown>
                    <Button
                        onClick={() => console.log('You clicked on the network button!')}
                    >
                        <NetworkContainer>
                            <Image src={EthereumLogo} priority={true}/>
                            <span>Ethereum</span>
                            <Image src={DownArrow} priority={true}/>
                        </NetworkContainer>
                    </Button>
                    <NetworkSelectorContainer>
                        <StyledNetworkContainer>
                            <Image src={OptimismLogo} priority={true}/>
                            <span>Optimism</span>
                        </StyledNetworkContainer>
                        <StyledNetworkContainer
                            active={true}
                        >
                            <Image src={EthereumLogo} priority={true}/>
                            <span>Ethereum</span>
                        </StyledNetworkContainer>
                    </NetworkSelectorContainer>
                </NetworkContainerDropdown>
                <ConnectWalletButton
                    onClick={onConnect}
                >
                    <span>Connect Wallet</span>
                </ConnectWalletButton>
                <DotButton
                    size='sm'
                    onClick={() => console.log('You clicked on the option button!')}
                >
                    <span>...</span>
                </DotButton>
            </MenuContainer>
        </Container>
    );
};

const BaseContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
`;

const Container = styled(BaseContainer)`
    justify-content: space-between;
    padding: 40px;
    width: 100%;
`;

const MenuContainer = styled(BaseContainer)`
    justify-content: center;
    padding: 0px;
    gap: 18px;
`;

const NetworkSelectorContainer = styled.div`
    /* Hide the dropdown menu by default */
    display: none;
    flex-direction: column;
    gap: 10px;
    padding: 8px;

    /* Basic style */
    height: 114px;
    width: 160px;

    /* Background */
    background:
        linear-gradient(0deg, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)),
        linear-gradient(311.52deg, #3D464C -36.37%, #131619 62.81%);

    /* Border */
    border: 1px solid #8282954D;
    border-radius: 4px;
`;

const NetworkContainer = styled(BaseContainer)`
    justify-content: center;
    gap: 5px;
`;

const StyledNetworkContainer = styled(NetworkContainer)<{active?: boolean}>`
    padding: 8px;
    justify-content: left;

    ${(props) =>
        props.active &&
        css`
            background: rgba(130, 130, 149, 0.3);
            border-radius: 4px;

            &::after {
                display: block;
                content: ' ';
                // TODO: Fix the issue with the svg not showing.
                background-image: url(${BadgeLive});
                background-size: 8px 8px;
                height: 8px;
                width: 8px;
        
                border: 2px solid #FFFFFF;
            }
        `}
    
    /* Text */
    span {
        color: #FFFFFF;
        font-family: 'Inter';
        font-style: normal;
        font-weight: 600;
        font-size: 14px;
        line-height: 20px;
    }
`;

const NetworkContainerDropdown = styled(BaseContainer)`
    flex-direction: column;
    gap: 8px;

    /* Reveal the dropdown menu when the button is clicked and then if the dropdown menu is hovered */
    &:hover, > ${NetworkSelectorContainer}:hover {
        display: flex;
        
        > ${NetworkSelectorContainer} {
            position: absolute;
            display: flex;
            margin-top: 54px;
        }
    }
`;

const ConnectWalletButton = styled(Button)`
    /* Remove break lines */
    white-space: nowrap;

    /* Border */
    border: 2px solid transparent;
    background:
        linear-gradient(#000000 0 0) padding-box,
        linear-gradient(73.6deg, #85FFC4 2.11%, #5CC6FF 90.45%) border-box;

    /* Text */
    span {
        font-weight: 700;

        /* Gradient */
        background-color: white;
        background-image: linear-gradient(73.6deg, #85FFC4 2.11%, #5CC6FF 90.45%);
        background-size: 100%;
        background-repeat: repeat;
        -webkit-text-fill-color: transparent;
        -webkit-background-clip: text;
        color: transparent;
    }

    &:hover {
        border-width: 3px;
        background:
            linear-gradient(#000000 0 0) padding-box,
            linear-gradient(-73.6deg, #85FFC4 2.11%, #5CC6FF 90.45%) border-box;
    }

    &:active {
        border-width: 4px;
        box-shadow: inset -2px -2px 3px rgba(255, 255, 255, 0.25);
    }
`;

const DotButton = styled(Button)`
    span {
        font-weight: 700;
        font-size: 20px;
    }
`;

export default Header;
