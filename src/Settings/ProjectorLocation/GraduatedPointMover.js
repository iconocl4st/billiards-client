
import {BorderedStyle, CompStyle} from "../../styles";
import React, {useState} from "react";
import SaveDelay from "../../SaveDelay";
import _ from "lodash";


const range = len => {
	return Array(len).fill().map((_, idx) => idx);
}

const rep = (char, num) => range(num).map(() => char).join('');

const Divs = ({num}) => {
	return <>
		{range(num).map(idx => <div key={`div-range-${idx}`}/>)}
	</>
}

const PointMoverRow = ({radius, index, char, onClicks}) => {
	return <>
		<Divs num={radius}/>
		<button onClick={onClicks(index-1)}>{rep(char, index)}</button>
		<Divs num={radius}/>
	</>
};


const GraduatedPointMover = ({point, setPoint, refresh}) => {
	const increments = [1, 10, 100];
	const radius = increments.length;
	const x = _.get(point, 'x', 0);
	const y = _.get(point, 'y', 0);
	const setX = x => setPoint({x, y});
	const setY = y => setPoint({x, y});
	const incx = idx => async () => { setX(x + increments[idx]); await refresh();}
	const decx = idx => async () => { setX(x - increments[idx]); await refresh();}
	const incy = idx => async () => { setY(y + increments[idx]); await refresh();}
	const decy = idx => async () => { setY(y - increments[idx]); await refresh();}
	const {value: xVal, setValue: setXValue} = SaveDelay(x, setX, refresh);
	const {value: yVal, setValue: setYValue} = SaveDelay(y, setY, refresh);
	// const {value: xVal, setValue: setXValue} = {value: x, setValue: setX};
	// const {value: yVal, setValue: setYValue} = {value: y, setValue: setY};
	const gridTemplateColumns = [
		...range(radius).map(() => '10%'),
		...['auto'],
		...range(radius).map(() => '10%')
	].join(' ');
	return (
		<div style={{
			...BorderedStyle,
			gridGap: '10px',
			display: 'grid',
			gridTemplateColumns,
		}}>
			{range(radius).map(idx =>
				<PointMoverRow
					key={`up-row-${idx}`}
					radius={radius}
					index={radius - idx}
					char={'🠕'}
					onClicks={incy}
				/>)}
			{range(radius).map(idx =>
				<button
					key={`right-${idx}`}
					onClick={decx(radius - 1 - idx)}
				>
					{rep('🠔', radius - idx)}
				</button>)}
			<div style={{
				...CompStyle,
				gridGap: '1%',
				display: 'grid',
				gridTemplateColumns: 'auto 100px',
			}}>
				<label>X:</label>
				<input
					type="number"
					value={xVal}
					onChange={({target: {value}}) => setXValue(value)}
				/>
				<label>Y:</label>
				<input
					type="number"
					value={yVal}
					onChange={({target: {value}}) => setYValue(value)}
				/>
			</div>
			{range(radius).map(idx =>
				<button
					key={`right-${idx}`}
					onClick={incx(idx)}
				>
					{rep('🠖', idx + 1)}
				</button>)}
			{range(radius).map(idx =>
				<PointMoverRow
					key={`decy-${idx}`}
					radius={radius}
					index={idx + 1}
					char={'🠗'}
					onClicks={decy}
				/>)}
		</div>
	)
};

export default GraduatedPointMover;
