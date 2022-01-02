
import _ from 'lodash';
import {NumberSetting, BoolSetting} from "../Common";

// progressive

export const PRACTICE_TYPES = [{
	label: 'Simple shot: uniformly distributed',
	value: 'uniform-simple',
	options: []
}, {
	label: 'Simple shot: distributed on grid',
	value: 'grid-simple',
	options: [{
		type: 'bool',
		name: 'show-grid',
		label: 'Show grid',
		defaultValue: false,
		props: {},
	}, {
		type: 'bool',
		name: 'include-rails',
		label: 'Allow balls on rails',
		defaultValue: false,
		props: {},
	}, {
		type: 'number',
		name: 'n-grid-x',
		label: 'Number of x grid lines',
		defaultValue: 7,
		props: {step: 1, min: 1},
	}, {
		type: 'number',
		name: 'n-grid-y',
		label: 'Number of y grid lines',
		defaultValue: 3,
		props: {step: 1, min: 1},
	}]
}, {
	label: 'Close object ball',
	value: 'short-shot',
	options: [],
}, {
	label: 'Object ball on rail',
	value: 'obj-on-rail',
	options: [],
}, {
	label: 'Cue ball on rail',
	value: 'cue-on-rail',
	options: [],
}, {
	label: 'Bank shot',
	value: 'bank',
	options: [{
		type: 'bool',
		name: 'half-table',
		label: 'Use half the table',
		defaultValue: false,
		props: {}
	}],
}, {
	label: 'Kick shot',
	value: 'kick',
	options: [],
}, {
	label: 'Run out',
	value: 'run-out',
	options: [{
		type: 'bool',
		name: 'half-table',
		label: 'Use half the table',
		defaultValue: false,
		props: {},
	}, {
		type: 'number',
		name: 'num-balls',
		label: 'Number of balls',
		defaultValue: 3,
		props: {step: 1, min: 1, max: 15},
	}]
}, {
	label: 'Combination [Not implemented]',
	value: 'combo',
	options: [],
}, {
	label: 'Cue ball carom [Not implemented]',
	value: 'cue-carom',
	options: [],
}, {
	label: 'Object ball carom [Not implemented]',
	value: 'obj-carom',
	options: [],
}, {
	label: 'White ball target [Not implemented]',
	value: 'target',
	options: [],
}, {
	label: 'Snookered shot [Not implemented]',
	value: 'snookered',
	options: [],
}, {
	label: 'Snooker [Not implemented]',
	value: 'snooker',
	options: [],
}, {
	label: 'Multi-rail shots [Not implemented]',
	value: 'multi-rail',
	options: [],
}];

export const BY_VALUE = PRACTICE_TYPES.reduce(
	(acc, practiceType) => ({...acc, [practiceType.value]: practiceType}), {});


const OptionControl = props => {
	const options = _.get(props, 'state.options', {});
	const setOptions = _.get(props, 'state.setOptions', () => {});
	const name = _.get(props, 'option.name', '');
	const type = _.get(props, 'option.type', 'string');
	const defaultValue = _.get(props, 'option.defaultValue', 0);
	const label = _.get(props, 'option.label', 'Unnamed option');
	const value = _.get(props, `state.options.${name}`, defaultValue);
	const setValue = newValue => setOptions({...options, [name]: newValue});
	const extraProps = _.get(props, 'option.props', {});
	const childProps = {label, value, setValue, ...extraProps};
	return (<>
		{type === 'bool' && <BoolSetting {...childProps}/>}
		{type === 'number' && <NumberSetting {...childProps}/>}
	</>);
}

export const OptionsControl = props => {
	const options = _.get(props, 'options', []);
	const state = _.get(props, 'state', {});
	return (<>
		{
			options.map((option, idx) => (
				<OptionControl
					key={`option-${idx}-${_.get(option, 'name', 'no-name')}`}
					state={state}
					option={option}
				/>
			))
		}
	</>);
};
