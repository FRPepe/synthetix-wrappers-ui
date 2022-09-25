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
import CoinGecko from 'coingecko-api';

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
				maxTicksLimit: 11
			}
		}],
	},
	scales: {
		y: {
			display: false,
		}
	},
};

interface WrapperEventObject {
	blockNumber: number;
	value: number;
}

type TVLChartOverlayProps = {
	display: boolean;
	onClose: () => void;
	WETHreserves: string;
	LUSDreserves: string;
	ETHmintsLastMonthArray: WrapperEventObject[];
	ETHburnsLastMonthArray: WrapperEventObject[];
	USDmintsLastMonthArray: WrapperEventObject[];
	USDburnsLastMonthArray: WrapperEventObject[];
	latestBlockNumber: number;
	setErrorMessage: (errorMessage: string) => void;
	setLoadingMessage: (loadingMessage: string) => void;
};

const TVLChartOverlay: FC<TVLChartOverlayProps> = ({
	display,
	onClose,
	WETHreserves,
	LUSDreserves,
	ETHmintsLastMonthArray,
	ETHburnsLastMonthArray,
	USDmintsLastMonthArray,
	USDburnsLastMonthArray,
	latestBlockNumber,
	setErrorMessage,
	setLoadingMessage
}) => {
	const [isBrowser, setIsBrowser] = useState(false);
	const [interval, setInterval] = useState<string>('day');
	const [data, setData] = useState(
		{
			labels: [''],
			datasets: [
				{
					label: 'Total ETH wrapped',
					data: [0],
					borderColor: '#31D8A4',
					backgroundColor: 'hsla(161, 68%, 32%, 0.6)',
					fill: 1,
					tension: 0.2,
				},
				{
					label: 'Total LUSD wrapped',
					data: [0],
					borderColor: '#00D1FF',
					backgroundColor: 'hsla(191, 100%, 50%, 0.6)',
					fill: "origin",
					tension: 0.2,
				},
			],
		}
	);
	const [tvl, setTVL] = useState<string>('0');
	const [WETHtvl, setWETHtvl] = useState<string>('0');
	const [LUSDtvl, setLUSDtvl] = useState<string>('0');
	const [ETHprice, setETHprice] = useState<number>(0);
	const [LUSDprice, setLUSDprice] = useState<number>(0);
	

	const changeInterval = async (intervalInput: string) => {
		setLoadingMessage('Loading price data...');
		setInterval(intervalInput);

		const CoinGeckoClient = new CoinGecko();
		let newLabels = [];
		let dataArrayETH = [];
		let dataArrayLUSD = [];
		const blocksInAnHour = Math.round((60 * 60) / 13);
		const blocksInADay = Math.round((60 * 60 * 24) / 13);
		if (intervalInput == 'day') {
			for (let i = 0; i < 7; i++) {
				let currentTime = new Date();
				currentTime.setHours(currentTime.getHours() - i * 4);
				newLabels[6 - i] = `${currentTime.getHours()}:00`;
			}
			for (let i = 0; i < 7; i++) {
				let currentWETHreserves = parseFloat(WETHreserves);
				let filteredETHmintsLastMonthArray = ETHmintsLastMonthArray.filter(el => el.blockNumber > latestBlockNumber - i * 4 * blocksInAnHour);
				let filteredETHmintsLastMonthArrayValues = filteredETHmintsLastMonthArray.map(el => el.value);
				let sumOfETHmintsSinceDate = filteredETHmintsLastMonthArrayValues.length > 0 ? filteredETHmintsLastMonthArrayValues.reduce((a, b) => a + b) : 0;
				let filteredETHburnsLastMonthArray = ETHburnsLastMonthArray.filter(el => el.blockNumber > latestBlockNumber - i * 4 * blocksInAnHour);
				let filteredETHburnsLastMonthArrayValues = filteredETHburnsLastMonthArray.map(el => el.value);
				let sumOfETHburnsSinceDate = filteredETHburnsLastMonthArrayValues.length > 0 ? filteredETHburnsLastMonthArrayValues.reduce((a, b) => a + b) : 0;

				dataArrayETH[6 - i] = Math.round((currentWETHreserves - sumOfETHmintsSinceDate + sumOfETHburnsSinceDate) * ETHprice);

				let currentLUSDreserves = parseFloat(LUSDreserves);
				let filteredLUSDmintsLastMonthArray = USDmintsLastMonthArray.filter(el => el.blockNumber > latestBlockNumber - i * 4 * blocksInAnHour);
				let filteredLUSDmintsLastMonthArrayValues = filteredLUSDmintsLastMonthArray.map(el => el.value);
				let sumOfLUSDmintsSinceDate = filteredLUSDmintsLastMonthArrayValues.length > 0 ? filteredLUSDmintsLastMonthArrayValues.reduce((a, b) => a + b) : 0;
				let filteredLUSDburnsLastMonthArray = USDburnsLastMonthArray.filter(el => el.blockNumber > latestBlockNumber - i * 4 * blocksInAnHour);
				let filteredLUSDburnsLastMonthArrayValues = filteredLUSDburnsLastMonthArray.map(el => el.value);
				let sumOfLUSDburnsSinceDate = filteredLUSDburnsLastMonthArrayValues.length > 0 ? filteredLUSDburnsLastMonthArrayValues.reduce((a, b) => a + b) : 0;

				dataArrayLUSD[6 - i] = Math.round((currentLUSDreserves - sumOfLUSDmintsSinceDate + sumOfLUSDburnsSinceDate) * LUSDprice);
			}
			let newDatasets = [
				{
					label: 'Total ETH wrapped',
					data: dataArrayETH,
					borderColor: '#31D8A4',
					backgroundColor: 'hsla(161, 68%, 32%, 0.6)',
					fill: 1,
					tension: 0.2,
				},
				{
					label: 'Total LUSD wrapped',
					data: dataArrayLUSD,
					borderColor: '#00D1FF',
					backgroundColor: 'hsla(191, 100%, 50%, 0.6)',
					fill: "origin",
					tension: 0.2,
				},
			];
			setData({
				...data,
				labels: newLabels,
				datasets: newDatasets
			});
		} else if (intervalInput == 'week') {
			for (let i = 0; i < 7; i++) {
				let currentTime = new Date();
				currentTime.setDate(currentTime.getDate() - i);
				newLabels[6 - i] = String(currentTime.getMonth() + 1).padStart(2, '0') + '/' + String(currentTime.getDate()).padStart(2, '0');
			
				let currentWETHreserves = parseFloat(WETHreserves);
				let filteredETHmintsLastMonthArray = ETHmintsLastMonthArray.filter(el => el.blockNumber > latestBlockNumber - i * blocksInADay);
				let filteredETHmintsLastMonthArrayValues = filteredETHmintsLastMonthArray.map(el => el.value);
				let sumOfETHmintsSinceDate = filteredETHmintsLastMonthArrayValues.length > 0 ? filteredETHmintsLastMonthArrayValues.reduce((a, b) => a + b) : 0;
				let filteredETHburnsLastMonthArray = ETHburnsLastMonthArray.filter(el => el.blockNumber > latestBlockNumber - i * blocksInADay);
				let filteredETHburnsLastMonthArrayValues = filteredETHburnsLastMonthArray.map(el => el.value);
				let sumOfETHburnsSinceDate = filteredETHburnsLastMonthArrayValues.length > 0 ? filteredETHburnsLastMonthArrayValues.reduce((a, b) => a + b) : 0;

				let ETHpriceAtPastDate;
				if (i == 0) {
					ETHpriceAtPastDate = ETHprice;
				} else {
					try {
					let fetchedData = await CoinGeckoClient.coins.fetchHistory('ethereum', {
						date: `${currentTime.getDate()}-${currentTime.getMonth() + 1 >= 10 ? currentTime.getMonth() + 1 : `0${currentTime.getMonth() + 1}`}-${currentTime.getFullYear()}`
					  });
					  ETHpriceAtPastDate = fetchedData.data.market_data.current_price.usd;
					} catch {
						setLoadingMessage('');
						setErrorMessage('Could not fetch price data');
						return;
					}
				}

				dataArrayETH[6 - i] = Math.round((currentWETHreserves - sumOfETHmintsSinceDate + sumOfETHburnsSinceDate) * ETHpriceAtPastDate);

				let currentLUSDreserves = parseFloat(LUSDreserves);
				let filteredLUSDmintsLastMonthArray = USDmintsLastMonthArray.filter(el => el.blockNumber > latestBlockNumber - i * blocksInADay);
				let filteredLUSDmintsLastMonthArrayValues = filteredLUSDmintsLastMonthArray.map(el => el.value);
				let sumOfLUSDmintsSinceDate = filteredLUSDmintsLastMonthArrayValues.length > 0 ? filteredLUSDmintsLastMonthArrayValues.reduce((a, b) => a + b) : 0;
				let filteredLUSDburnsLastMonthArray = USDburnsLastMonthArray.filter(el => el.blockNumber > latestBlockNumber - i * blocksInADay);
				let filteredLUSDburnsLastMonthArrayValues = filteredLUSDburnsLastMonthArray.map(el => el.value);
				let sumOfLUSDburnsSinceDate = filteredLUSDburnsLastMonthArrayValues.length > 0 ? filteredLUSDburnsLastMonthArrayValues.reduce((a, b) => a + b) : 0;

				let LUSDpriceAtPastDate;
				if (i == 0) {
					LUSDpriceAtPastDate = LUSDprice;
				} else {
					try {
					let fetchedData = await CoinGeckoClient.coins.fetchHistory('liquity-usd', {
						date: `${currentTime.getDate()}-${currentTime.getMonth() + 1 >= 10 ? currentTime.getMonth() + 1 : `0${currentTime.getMonth() + 1}`}-${currentTime.getFullYear()}`
					  });
					  LUSDpriceAtPastDate = fetchedData.data.market_data.current_price.usd;
					} catch {
						setLoadingMessage('');
						setErrorMessage('Could not fetch price data');
						return;
					}
				}

				dataArrayLUSD[6 - i] = Math.round((currentLUSDreserves - sumOfLUSDmintsSinceDate + sumOfLUSDburnsSinceDate) * LUSDpriceAtPastDate);
			}
			let newDatasets = [
				{
					label: 'Total ETH wrapped',
					data: dataArrayETH,
					borderColor: '#31D8A4',
					backgroundColor: 'hsla(161, 68%, 32%, 0.6)',
					fill: 1,
					tension: 0.2,
				},
				{
					label: 'Total LUSD wrapped',
					data: dataArrayLUSD,
					borderColor: '#00D1FF',
					backgroundColor: 'hsla(191, 100%, 50%, 0.6)',
					fill: "origin",
					tension: 0.2,
				},
			];
			setData({
				...data,
				labels: newLabels,
				datasets: newDatasets
			});
		} else if (intervalInput == `month`) {
			for (let i = 0; i < 11; i++) {
				let currentTime = new Date();
				currentTime.setDate(currentTime.getDate() - i * 3);
				newLabels[10 - i] = String(currentTime.getMonth() + 1).padStart(2, '0') + '/' + String(currentTime.getDate()).padStart(2, '0');

				let currentWETHreserves = parseFloat(WETHreserves);
				let filteredETHmintsLastMonthArray = ETHmintsLastMonthArray.filter(el => el.blockNumber > latestBlockNumber - i * 3 * blocksInADay);
				let filteredETHmintsLastMonthArrayValues = filteredETHmintsLastMonthArray.map(el => el.value);
				let sumOfETHmintsSinceDate = filteredETHmintsLastMonthArrayValues.length > 0 ? filteredETHmintsLastMonthArrayValues.reduce((a, b) => a + b) : 0;
				let filteredETHburnsLastMonthArray = ETHburnsLastMonthArray.filter(el => el.blockNumber > latestBlockNumber - i * 3 * blocksInADay);
				let filteredETHburnsLastMonthArrayValues = filteredETHburnsLastMonthArray.map(el => el.value);
				let sumOfETHburnsSinceDate = filteredETHburnsLastMonthArrayValues.length > 0 ? filteredETHburnsLastMonthArrayValues.reduce((a, b) => a + b) : 0;

				let ETHpriceAtPastDate;
				if (i == 0) {
					ETHpriceAtPastDate = ETHprice;
				} else {
					try {
					let fetchedData = await CoinGeckoClient.coins.fetchHistory('ethereum', {
						date: `${currentTime.getDate()}-${currentTime.getMonth() + 1 >= 10 ? currentTime.getMonth() + 1 : `0${currentTime.getMonth() + 1}`}-${currentTime.getFullYear()}`
					  });
					  ETHpriceAtPastDate = fetchedData.data.market_data.current_price.usd;
					} catch {
						setLoadingMessage('');
						setErrorMessage('Could not fetch price data');
						return;
					}
				}

				dataArrayETH[10 - i] = Math.round((currentWETHreserves - sumOfETHmintsSinceDate + sumOfETHburnsSinceDate) * ETHpriceAtPastDate);

				let currentLUSDreserves = parseFloat(LUSDreserves);
				let filteredLUSDmintsLastMonthArray = USDmintsLastMonthArray.filter(el => el.blockNumber > latestBlockNumber - i * 3 * blocksInADay);
				let filteredLUSDmintsLastMonthArrayValues = filteredLUSDmintsLastMonthArray.map(el => el.value);
				let sumOfLUSDmintsSinceDate = filteredLUSDmintsLastMonthArrayValues.length > 0 ? filteredLUSDmintsLastMonthArrayValues.reduce((a, b) => a + b) : 0;
				let filteredLUSDburnsLastMonthArray = USDburnsLastMonthArray.filter(el => el.blockNumber > latestBlockNumber - i * 3 * blocksInADay);
				let filteredLUSDburnsLastMonthArrayValues = filteredLUSDburnsLastMonthArray.map(el => el.value);
				let sumOfLUSDburnsSinceDate = filteredLUSDburnsLastMonthArrayValues.length > 0 ? filteredLUSDburnsLastMonthArrayValues.reduce((a, b) => a + b) : 0;

				let LUSDpriceAtPastDate;
				if (i == 0) {
					LUSDpriceAtPastDate = LUSDprice;
				} else {
					try {
					let fetchedData = await CoinGeckoClient.coins.fetchHistory('liquity-usd', {
						date: `${currentTime.getDate()}-${currentTime.getMonth() + 1 >= 10 ? currentTime.getMonth() + 1 : `0${currentTime.getMonth() + 1}`}-${currentTime.getFullYear()}`
					  });
					  LUSDpriceAtPastDate = fetchedData.data.market_data.current_price.usd;
					} catch {
						setLoadingMessage('');
						setErrorMessage('Could not fetch price data');
						return;
					}
				}

				dataArrayLUSD[10 - i] = Math.round((currentLUSDreserves - sumOfLUSDmintsSinceDate + sumOfLUSDburnsSinceDate) * LUSDpriceAtPastDate);
			}
			let newDatasets = [
				{
					label: 'Total ETH wrapped',
					data: dataArrayETH,
					borderColor: '#31D8A4',
					backgroundColor: 'hsla(161, 68%, 32%, 0.6)',
					fill: 1,
					tension: 0.2,
				},
				{
					label: 'Total LUSD wrapped',
					data: dataArrayLUSD,
					borderColor: '#00D1FF',
					backgroundColor: 'hsla(191, 100%, 50%, 0.6)',
					fill: "origin",
					tension: 0.2,
				},
			];
			setData({
				...data,
				labels: newLabels,
				datasets: newDatasets
			});
		}
		setLoadingMessage('');
	};

	const handleOnClose = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		onClose();
	};

	useEffect(() => {
		setIsBrowser(true);
		changeInterval('day');
		const CoinGeckoClient = new CoinGecko();
		const fetchData = async () => {
			let result;
			try {
			result = await CoinGeckoClient.simple.price({
				ids: ['ethereum', 'liquity-usd'],
				vs_currencies: ['usd'],
			});
		} catch {
			setErrorMessage('Could not fetch price data');
			return;
		}
			setETHprice(result.data.ethereum.usd);
			setLUSDprice(result.data[`liquity-usd`].usd);
			let calculatedWETHtvl = parseFloat(WETHreserves) * result.data.ethereum.usd;
			setWETHtvl(calculatedWETHtvl.toLocaleString('en-US', {
				style: 'currency',
				currency: 'USD',
				minimumFractionDigits: 0,
				maximumFractionDigits: 0
			  }));
			let calculatedLUSDtvl = parseFloat(LUSDreserves) * result.data[`liquity-usd`].usd;
			setLUSDtvl(calculatedLUSDtvl.toLocaleString('en-US', {
				style: 'currency',
				currency: 'USD',
				minimumFractionDigits: 0,
				maximumFractionDigits: 0
			  }));
			let calculatedTotalTVL = calculatedWETHtvl + calculatedLUSDtvl;
			setTVL(calculatedTotalTVL.toLocaleString('en-US', {
				style: 'currency',
				currency: 'USD',
				minimumFractionDigits: 0,
				maximumFractionDigits: 0
			  }));
		}
		try {
			fetchData();
		}
		catch {
			setErrorMessage('Failed to fetch TVL data');
		}
	}, [WETHreserves, LUSDreserves]);

	return (
		<>
			{display && (
				<Overlay>
					<Container>
						<TitleContainer>
							<Column>
								<StyledRow>
									<h1>TOTAL VALUE LOCKED</h1>
								</StyledRow>
								<span className="tvl">{tvl}</span>
							</Column>
							<Row>
								<StyledButton
									active={interval === 'day'}
									onClick={() =>
										changeInterval('day')
									}
								>
									<span>1 Day</span>
								</StyledButton>
								<StyledButton
									active={interval === 'week'}
									onClick={() =>
										changeInterval('week')
									}
								>
									<span>1 Week</span>
								</StyledButton>
								<StyledButton
									active={interval === 'month'}
									onClick={() =>
										changeInterval('month')
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
								<span className="figure">{WETHtvl}</span>
							</Column>
							<Column>
								<span className="text, blue">Total LUSD wrapped</span>
								<span className="figure">{LUSDtvl}</span>
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
        font-family: 'GT America Mono';
        font-style: normal;
        font-weight: 700;
        font-size: 14px;
        line-height: 21px;
    }

    .tvl {
        font-family: 'GT America Mono';
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
		font-family: 'GT America Mono';
		font-weight: 700;
		font-size: 16px;
		line-height: 21px;
	}

	.text {
		font-family: 'GT America Mono';
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
        font-family: 'GT America Mono';
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
