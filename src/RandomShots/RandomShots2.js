
import React, {useState} from 'react';
import {BorderedStyle} from "../styles";
import _ from 'lodash';
import {DEFAULT_GRID_STATE, GridControlUi} from "../GridControl";
import {BoolSetting, MaybeNumber, NumberSetting, OptionSetting} from "../Common";
import {generateRandomPractice} from "./generateRandomPractice";
import GraphicsView from "../GraphicsView";

import {BY_VALUE, OptionsControl, PRACTICE_TYPES} from "./PracticeTypes";

const GlobalOptions = props => {
	return <div style={{
		...BorderedStyle,
		display: 'grid',
		gridTemplateColumns: '33% 33% 33%',
	}}>
			<label>Status:</label>
			<label>{props.statusMessage}</label>
			<div>
				<button onClick={props.generate}>Generate!</button>
			</div>

			<OptionSetting
				label="Practice type"
				value={props.practiceType}
				setValue={props.setPracticeType}
			>
				{
					PRACTICE_TYPES.map(({value, label}, index) => (
						<option key={`option-${index}`} value={value}>{label}</option>
					))
				}
			</OptionSetting><div/>
		<MaybeNumber
			label="Seed"
			use={props.useSeed}
			setUse={props.setUseSeed}
			value={props.seed}
			setValue={props.setSeed}
			min={0}
		/>
		<BoolSetting
			label="Draw shot lines"
			value={!!props.drawLines}
			setValue={props.setDrawLines}
		/><div/>
		<BoolSetting
			label="Use dots"
			value={!!props.useDots}
			setValue={props.setUseDots}
		/><div/>
		<NumberSetting
			label="Cut Threshold"
			value={props.minCut}
			onChange={props.setMinCut}
			min={0}
			step={0.01}
			max={1}
		/><div/>
	</div>
};


const SpecificOptions = ({options, state}) => {
	return <div style={{
		...BorderedStyle,
		display: 'grid',
		gridTemplateColumns: '50% 50%',
	}}>
		<label>Practice type options:</label>
		{(!options || options.length === 0) ? <label>None</label> : <div/>}
		<OptionsControl options={options} state={state} />
	</div>
};

const Preview = ({graphics}) => {
	return <div style={{
		...BorderedStyle,
		display: 'grid',
		gridTemplateColumns: '100%',
	}}>
		<GraphicsView graphics={graphics}/>
	</div>;
};




const RandomShots2 = ({configState}) => {
	let state = {configState};
	const [statusMessage, setStatusMessage] = useState('Ready');
	state = {...state, statusMessage, setStatusMessage};
	const [drawLines, setDrawLines] = useState(true);
	state = {...state, drawLines, setDrawLines};
	const [useDots, setUseDots] = useState(false);
	state = {...state, useDots, setUseDots};
	const [useSeed, setUseSeed] = useState(false);
	state = {...state, useSeed, setUseSeed};
	const [seed, setSeed] = useState(1776);
	state = {...state, seed, setSeed};
	const [minCut, setMinCut] = useState(0.02);
	state = {...state, minCut, setMinCut};
	const[options, setOptions] = useState({});
	state = {...state, options, setOptions};
	const [practiceType, rawSetPracticeType] = useState(PRACTICE_TYPES[0].value);
	const setPracticeType = prType => {rawSetPracticeType(prType); setOptions({});};
	state = {...state, practiceType, setPracticeType};
	const [graphics, setGraphics] = useState([]);
	state = {...state, graphics, setGraphics};
	const generate = () => generateRandomPractice(state);
	const typeOptions = _.get(BY_VALUE, `${practiceType}.options`, []);
	return (
		<>
			<GlobalOptions {...state} generate={generate}/>
			<SpecificOptions options={typeOptions} state={{options, setOptions}}/>
			<Preview graphics={graphics}/>
		{/*<div style={{*/}
		{/*	...BorderedStyle,*/}
		{/*	display: 'grid',*/}
		{/*	gridTemplateColumns: '33% 33% 33%',*/}
		{/*}}>*/}
		{/*	<OptionSetting*/}
		{/*		label="Shot steps"*/}
		{/*		value={shotStepsType}*/}
		{/*		setValue={setShotStepsType}*/}
		{/*	>*/}
		{/*		<option value="strike">Strike</option>*/}
		{/*		<option value="bank">Bank</option>*/}
		{/*		<option value="kick">Kick</option>*/}
		{/*		<option value="combo">Combo</option>*/}
		{/*		<option value="kiss">Kiss</option>*/}
		{/*	</OptionSetting><div/>*/}
		{/*	<OptionSetting*/}
		{/*		label="Distribution"*/}
		{/*		value={distribution}*/}
		{/*		setValue={setDistribution}*/}
		{/*	>*/}
		{/*		<option value="uniform">Uniform</option>*/}
		{/*		<option value="spot">Spot shot</option>*/}
		{/*	</OptionSetting><div/>*/}
		{/*	<GridControlUi*/}
		{/*		width={3}*/}
		{/*		disabled={distribution !== 'spot'}*/}
		{/*		gridState={gridState}*/}
		{/*		setGridState={setGridState}*/}
		{/*	/>*/}
		{/*	<BoolSetting*/}
		{/*		label="Allow cue ball on rail"*/}
		{/*		value={cueOnRail}*/}
		{/*		setValue={setCueOnRail}*/}
		{/*		disabled={distribution !== 'spot'}*/}
		{/*	/><div/>*/}
		{/*	<BoolSetting*/}
		{/*		label="Allow object ball on rail"*/}
		{/*		value={objOnRail}*/}
		{/*		setValue={setObjOnRail}*/}
		{/*		disabled={distribution !== 'spot'}*/}
		{/*	/><div/>*/}
		{/*	<BoolSetting*/}
		{/*		label="Generate Destination"*/}
		{/*		value={destination}*/}
		{/*		setValue={setDestination}*/}
		{/*	/><div/>*/}
		{/*	<NumberSetting*/}
		{/*		label="Destination Radius"*/}
		{/*		value={destinationRadius}*/}
		{/*		setValue={setDestinationRadius}*/}
		{/*		min={0}*/}
		{/*		set={0.5}*/}
		{/*		disabled={!destination}*/}
		{/*	/><div/>*/}
		{/*	<NumberSetting*/}
		{/*		label="Destination Max Spin"*/}
		{/*		value={destinationSpin}*/}
		{/*		setValue={setDestinationSpin}*/}
		{/*		step={0.1}*/}
		{/*		disabled={!destination}*/}
		{/*	/><div/>*/}
		{/*	<NumberSetting*/}
		{/*		label="Destination Max Speed"*/}
		{/*		value={destinationSpeed}*/}
		{/*		setValue={setDestinationSpeed}*/}
		{/*		min={0}*/}
		{/*		step={0.1}*/}
		{/*		disabled={!destination}*/}
		{/*	/><div/>*/}
		{/*	<Preview graphics={graphics}/>*/}
		{/*</div>*/}
		</>
	)
};

export default RandomShots2;

