
import React, {useState} from 'react';
import GraphicsView from "./GraphicsView";
import {BorderedStyle} from "./styles";

import {generateLocations} from "./generate_shot";


const RandomLocations = ({configState}) => {
	const [seed, setSeed] = useState(1776);
	const [useSeed, setUseSeed] = useState(false);
	const [numBalls, setNumBalls] = useState(5);
	const [graphics, setGraphics] = useState([]);
	const [status, setStatus] = useState('Ready');
	const genArgs = {useSeed, seed, numBalls, setGraphics, configState, listener: setStatus};
	return (
		<div style={{
			...BorderedStyle,
			display: 'grid',
			gridTemplateColumns: '33% 33% 33%',
		}}>
			<label>Number of balls:</label>
			<div>
				<input
					value={numBalls}
					onChange={({target: {value}}) => setNumBalls(Number(value))}
					type="number"
				/>
			</div>
			<div/>
			<label>Seed:</label>
			<div>
				<input
					type="checkbox"
					checked={useSeed}
					onChange={({target: {checked}}) => setUseSeed(checked)}
				/>
			</div>
			<div>
				<input
					disabled={!useSeed}
					value={seed}
					onChange={({target: {value}}) => setSeed(Number(value))}
					type="number"
				/>
			</div>
			<div/>
			<div>
				<button onClick={generateLocations(genArgs)}>Generate!</button>
			</div>
			<label>{status}</label>
			<div style={{
				gridColumnBegin: 0,
				gridColumnEnd: 3
			}}>
				<GraphicsView graphics={graphics}/>
			</div>
		</div>
	)
};

export default RandomLocations;
