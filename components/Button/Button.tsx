import styled, { css } from 'styled-components';

type ButtonProps = {
	size?: 'sm';
};

const Button = styled.button<ButtonProps>`
    /* Basic style */
    padding: 10px, 16px;
    height: 44px;
    width: 160px;

    /* Small size styling */
    ${(props) =>
        props.size === 'sm' &&
        css`
            padding: 10px;
            width: 44px;
        `}

    /* Background */
    background:
        linear-gradient(0deg, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)),
        linear-gradient(311.52deg, #3D464C -36.37%, #131619 62.81%);

    /* Border */
    border: 1px solid #8282954D;
    border-radius: 4px;

    /* Shadow */
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.9);

    /* Text */
    span {
        color: #FFFFFF;
        font-family: 'Inter';
        font-style: normal;
        font-weight: 600;
        font-size: 14px;
        line-height: 20px;
    }

    &:hover {
        background: black;
    }

    &:active {
        box-shadow: inset -2px -2px 1px rgba(255, 255, 255, 0.15);
    }
`;

export default Button;