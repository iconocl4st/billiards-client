import React, { useState } from 'react';
import useAxios from 'axios-hooks';
import axios from 'axios';
import _ from 'lodash';
import {ColorSelector, Point} from "../Common";
import {SINGLE_COMP_STYLE} from "../styles";

const BALL_HEIGHT = 30;

const Ball = ({ball, setBall, style}) => {
	return (
		<div style={style}>
			<label style={{position: 'absolute', left: '0%', width: '15%'}}>
				Number:
			</label>
			<label style={{position: 'absolute', left: '15%', width: '5%'}}>
				{ball.number}
			</label>
			<ColorSelector
				style={{position: 'absolute', left: '20%', width: '35%', height: BALL_HEIGHT}}
				color={ball.color}
				set={color => setBall({color})}
			/>
			<label style={{position: 'absolute', left: '60%', width: '10%'}}>
				Radius:
			</label>
			<input
				style={{position: 'absolute', left: '75%', width: '20%'}}
				type="number"
				min="0"
				onChange={({target: {value}}) => setBall({radius: Number(value)})}
				step="0.01"
				value={ball.radius}/>
		</div>
	);
};

const pointSetter = (setPocket, pocket, key) => p => setPocket({...pocket, [key]: {...pocket[key], ...p}});

const Pocket = ({pocket, setPocket, number}) => (
	<div style={{border: '1px solid black'}}>
		<label>Pocket: {number.toString()}</label>
		<br/>
		<Point
			label="Inner Segment 1"
			point={pocket['inner-segment-1']}
			set={pointSetter(setPocket, pocket, 'inner-segment-1')}/>
		<Point
			label="Outer Segment 1"
			point={pocket['outer-segment-1']}
			set={pointSetter(setPocket, pocket, 'outer-segment-1')}/>
		<Point
			label="Outer Segment 2"
			point={pocket['outer-segment-2']}
			set={pointSetter(setPocket, pocket, 'outer-segment-2')}/>
		<br/>
	</div>
);

const range = len => {
    return [...Array(len).keys()];
};

const emptyBall = (_, number) => ({
    color: { r: 0, g: 0, b: 0, a: 0},
    name: number.toString(),
    number,
    radius: 1.13,
});

const emptyPocket = (_, number) => ({
    number,
    'inner-segment-1': {x: 0, y: 0},
    'outer-segment-1': {x: 0, y: 0},
    'outer-segment-2': {x: 0, y: 0},
});


const BallsConfig = ({balls, setBall}) => (
	<div style={{
		position: 'absolute',
		top: SINGLE_COMP_STYLE.top,
		backgroundColor: SINGLE_COMP_STYLE.backgroundColor,
		color: SINGLE_COMP_STYLE.color,
		border: SINGLE_COMP_STYLE.border,
		left: 0,
		width: '50%',
	}}>
		<div style={{
			height: BALL_HEIGHT, display: 'grid', placeItems: 'center', left: 0, width: '100%'}}>
			Balls
		</div>
		{balls.map((ball, index) => (
			<Ball
				style={{
					// position: 'absolute',
					height: BALL_HEIGHT,
					// top: (index + 1) * BALL_HEIGHT,
					left: 0,
					width: '100%',
				}}
				key={`ball-${index}`}
				ball={ball}
				setBall={b => setBall(index, b)}
			/>
		))}
	</div>
);

const PocketsConfig = ({pockets, setPocket}) => (
	<div style={{
		position: 'absolute',
		top: SINGLE_COMP_STYLE.top,
		backgroundColor: SINGLE_COMP_STYLE.backgroundColor,
		color: SINGLE_COMP_STYLE.color,
		border: SINGLE_COMP_STYLE.border,
		left: '50%',
		width: '50%',
	}}>
		<div style={{
			height: BALL_HEIGHT, display: 'grid', placeItems: 'center', left: 0, width: '100%'}}>
			Pockets
		</div>
		{pockets.map((pocket, index) => (
			<Pocket
				key={`pocket-${index}`}
				number={index}
				pocket={pocket}
				setPocket={p => setPocket(index, p)}
			/>
		))}
	</div>

);


const createPutData = config => ({
    table: {
	balls: _.get(config, 'table.balls', range(15).map(emptyBall)).map(({
	    name,
	    color: {r, g, b, a},
	    number,
	    radius,
	    ...ball
	}) => ({
	    name,
	    color: {r, g, b, a},
	    number,
	    radius,
	    'ball-type': ball['ball-type'],
	})),
	pockets: _.get(config, 'table.pockets', range(6).map(emptyPocket)).map(pocket => ({
	    'inner-segment-1': pocket['inner-segment-1'],
	    'outer-segment-1': pocket['outer-segment-2'],
	    'outer-segment-2': pocket['outer-segment-2']
	}))
    }
});
// {position: 'absolute', left: '0%', width: '100%'}
// style={{position: 'absolute', top: SINGLE_COMP_STYLE.top, height: 'auto', width: '100%'}}
const Table = () => {
	const [{data, loading, error}, refetch] = useAxios('http://localhost:18086/');
	const putData = createPutData(_.get(data, 'config', {}));
	const sendPutData = async () => {
		await axios.put('http://localhost:18086/', putData);
		await refetch();
	}
	return (
		<>
			<BallsConfig
				balls={putData.table.balls}
				setBall={async (index, b) => {
					putData.table.balls[index] = {...putData.table.balls[index], ...b};
					await sendPutData();
				}}
			/>
			<PocketsConfig
				pockets={putData.table.pockets}
				setPocket={async (index, p) => {
					putData.table.pockets[index] = {...putData.table.pockets[index], ...p};
					await sendPutData();
				}}
			/>
		</>
	);
};

export default Table;
