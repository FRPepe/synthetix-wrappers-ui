import { FC, useState, useEffect } from "react";
import styled, { css } from "styled-components";
import Image from "next/image";
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

import Button from '../../components/Button';

import CrossIcon from "../../assets/utils/cross.svg";
import WhiteInfo from "../../assets/utils/white-info.svg";

ChartJS.register(
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Filler
);

const rand = (min: number, max: number): number => {
	return Math.floor(Math.random() * (max - min)) + min;
};

const randn = (min: number, max: number, n: number): number[] => {
	let array: number[] = [];
	for (let i = 0; i < n; i++) {
		array.push(rand(min, max));
	}
	return array;
};

const hourlyScale = (min: number, max: number, n: number): string[] => {
	let array: string[] = [];
	const step = (max - min) / n;
	for (let i = min; i < max; i += step) {
		array.push(Math.floor(i) + ':00');
	}
	return array;
};

const options = {
	responsive: true,
	plugins: {
		title: {
			display: false,
			text: 'Total Value Locked (TVL) Chart',
		},
		xAxes: [{
			type: 'time',
			ticks: {
				autoSkip: true,
				maxTicksLimit: 10
			}
		}],
	},
	scales: {
		y: {
			display: false,
		}
	},
};

const data = {
	labels: hourlyScale(6, 24, 6),
	datasets: [
		{
			label: 'Total ETH wrapped',
			data: randn(480_000, 520_000, 100),
			borderColor: '#31D8A4',
			backgroundColor: 'hsla(161, 68%, 32%, 0.6)',
			fill: 1,
			tension: 0.2,
		},
		{
			label: 'Total LUSD wrapped',
			data: randn(440_000, 470_000, 100),
			borderColor: '#00D1FF',
			backgroundColor: 'hsla(191, 100%, 50%, 0.6)',
			fill: "origin",
			tension: 0.2,
		},
	],
};

type TVLChartOverlayProps = {
	display: boolean;
	onClose: () => void;
};

const TVLChartOverlay: FC<TVLChartOverlayProps> = ({ display, onClose }) => {
	const [isBrowser, setIsBrowser] = useState(false);
	const [interval, setInterval] = useState<string>('day');
	const tvl: string = '1,000,000,000';

	useEffect(() => {
		setIsBrowser(true);
	}, []);

	const handleOnClose = (e: any) => {
		e.preventDefault();
		onClose();
	};

	return (
		<>
			{display && (
				<Overlay>
					<Container>
						<TitleContainer>
							<Column>
								<StyledRow>
									<h1>TOTAL VALUE LOCKED</h1>
									<Image className="tooltip" alt="tooltip" src={WhiteInfo} priority={true} />
								</StyledRow>
								<span className="tvl">${tvl}</span>
							</Column>
							<Row>
								<StyledButton
									active={interval === 'day'}
									onClick={() =>
										setInterval('day')
									}
								>
									<span>1 Day</span>
								</StyledButton>
								<StyledButton
									active={interval === 'week'}
									onClick={() =>
										setInterval('week')
									}
								>
									<span>1 Week</span>
								</StyledButton>
								<StyledButton
									active={interval === 'month'}
									onClick={() =>
										setInterval('month')
									}
								>
									<span>1 Month</span>
								</StyledButton>
								<Button size="xs" onClick={handleOnClose}>
									<Image src={CrossIcon} alt="cross-icon" priority={true} />
								</Button>
							</Row>
						</TitleContainer>
						<Chart
							options={options}
							data={data}
							width={2000}
							height={800}
						/>
						<DescriptionRow>
							<Column>
								<span className="text, green">Total ETH wrapped</span>
								<span className="figure">$512,345,678</span>
							</Column>
							<Column>
								<span className="text, blue">Total LUSD wrapped</span>
								<span className="figure">$487,654,322</span>
							</Column>
						</DescriptionRow>
					</Container>
				</Overlay>
			)}
		</>
	);
};

const Overlay = styled.div`
  /* Modal styling */
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;

  width: 100%;
  height: 100%;
`;

const Row = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: top;
    gap: 14px;
`;

const DescriptionRow = styled(Row)`
	justify-content: flex-start;
	gap: 84px;
	padding-left: 46px;
`;

const StyledRow = styled(Row)`
    justify-content: flex-start;
    gap: 10px;
`;

const Column = styled.div`
    display: flex;
    flex-direction: column;
    align-items: left;
`;

const Container = styled.div`
    width: 784px;
    height: 500px;

    box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.4);
    border-radius: 10px;
    border: 2px solid transparent;
    background:
        linear-gradient(#000000 0 0) padding-box,
        linear-gradient(73.6deg, #85FFC4 2.11%, #5CC6FF 90.45%) border-box;
    
    .tooltip {
        color: #FFFFFF;
    }

    h1 {
        font-family: 'Inter';
        font-style: normal;
        font-weight: 700;
        font-size: 14px;
        line-height: 21px;
    }

    .tvl {
        font-family: 'Inter';
        font-style: normal;
        font-weight: 700;
        font-size: 41px;
        line-height: 45px;
        /* or 110% */

        display: flex;
        align-items: center;
        text-transform: uppercase;

        /* Brand/Primary ClickableV2 */

        background: linear-gradient(73.6deg, #85FFC4 2.11%, #5CC6FF 90.45%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        text-fill-color: transparent;
    }

	.figure {
		font-family: 'Inter';
		font-weight: 700;
		font-size: 16px;
		line-height: 21px;
	}

	.text {
		font-family: 'Inter';
		font-weight: 700;
		font-size: 12px;
		line-height: 13px;
	}

	.green {
		color: #41C79D;
	}

	.blue {
		color: #00D1FF;
	}
`;

const TitleContainer = styled(Row)`
    padding: 20px 35px;
`;

const Chart = styled(Line)`
    padding: 0px 10px 10px 10px;
`;

const StyledButton = styled(Button) <{ active?: boolean }>`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding: 8px;

    width: 80px;
    height: 34px;

    border-radius: 100px;
    background: none;
    border: none;

    span {
        font-family: 'Inter';
        font-style: normal;
        font-weight: 600;
        font-size: 12px;
        line-height: 20px;
        text-align: center;
        color: #00D1FF;
    }

    &:hover {
        border: 2px solid transparent;
        background:
            linear-gradient(73.6deg, #85FFC4 2.11%, #5CC6FF 90.45%) border-box;

        span {
            color: #0B0B22;
        }
    }

    &:active {
        background: #00D1FF;
    }

    ${(props) =>
		props.active &&
		css`
            background: #00D1FF;
            box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.9);

            span {
                color: #0B0B22;
            }
        `}
`;

export default TVLChartOverlay;
