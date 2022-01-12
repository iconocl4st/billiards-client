
import {useState} from 'react';
import useAxios from "axios-hooks";
import _ from "lodash";
import {BorderedStyle, Colors, CompStyle} from "../../styles";
import {Point} from "../../Common";


const PointEditor = ({existing, value, setValue, index}) => {
	const handler = name => ({target: {value: v}}) => setValue({[name]: Number(v)});
	return (
		<>
			<label>Current:</label>
			<label>{existing.x}</label>
			<label>{existing.y}</label>
			<label>Changes:</label>
			<input
				type="number"
				value={value.x}
				onChange={handler('x')}
				step={1}
			/>
			<input
				type="number"
				value={value.y}
				onChange={handler('y')}
				step={1}
			/>
			<label>{index}.</label>
		</>
	);
};

const changesHandler = (points, changes, setChanges) => idx => updates => {
	const defaults = changes.length !== points.length ? points.map(() => ({})) : changes;
	const newChanges = defaults.map((p, i) => (i === idx ? _.merge(_.cloneDeep(p), updates) : p));
	setChanges(newChanges);
};

const PointsEditor = ({label, points, setPoints}) => {
	const [changes, setChanges] = useState([]);
	const values = _.merge(_.cloneDeep(points), changes);
	const handler = changesHandler(points, changes, setChanges);
	const [msg, setMsg] = useState('Ready');
	// console.log('existing', points);
	// console.log('values', values);
	// console.log('changes', changes);
	const noChanges = _.isEqual(values, points);
	const push = () => { setPoints(setMsg, values); setChanges([]); };
	return (
		<div style={{
			...BorderedStyle,
			display: 'grid',
			gridTemplateColumns: '100%'
		}}>
			<div style={{
				textAlign: 'center',
				display: 'grid',
				gridTemplateColumns: '33% 33% 33%'
				// border: '1px solid ' + Colors.textColor
			}}>
				<label style={{fontWeight: 'bold'}}>{label} Table Location:</label>
				<div><button disabled={noChanges} onClick={push}>Push</button></div>
				<label>{msg}</label>
			</div>
			<div style={{
				...CompStyle,
				display: 'grid',
				gridTemplateColumns: 'auto auto auto auto auto auto auto'
			}}>
			{points.map((existing, idx) => <PointEditor
				key={`point-editor-${idx}`}
				value={values[idx]}
				index={idx}
				existing={existing}
				setValue={handler(idx)}/>)}
			</div>
		</div>
	);
};

const arr2point = ([x, y]) => ({x, y});
const point2arr = ({x, y}) => ([x, y]);

const AllAtOnce = props => {
	const projectorUrl = _.get(props, 'projectorUrl', '');
	const setMap = _.get(props, 'setMap', async () => {})
	const [resp, refresh] = useAxios(projectorUrl + 'mapping/');
	const physicalPoints = _.get(resp, 'data.mapping.physical.points', []).map(arr2point);
	const screenPoints = _.get(resp, 'data.mapping.screen.points', []).map(arr2point);

	const map = _.get(resp, 'data.mapping', {});
	const handler = key => async (listener, values) => {
		const newMap = _.set(_.cloneDeep(map), key, values.map(point2arr));
		listener('Pushing changes...');
		// console.log('the new map', newMap)
		await setMap(newMap);
		listener('Refreshing...');
		await refresh();
		listener('Done.');
	}
	return (
		<>
			<PointsEditor
				label="Screen"
				points={screenPoints}
				refresh={refresh}
				setPoints={handler('screen.points')}
			/>
			<PointsEditor
				label="Physical"
				points={physicalPoints}
				refresh={refresh}
				setPoints={handler('physical.points')}
			/>
		</>
	);
};


export default AllAtOnce;
