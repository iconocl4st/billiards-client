import _ from "lodash";
import {BorderedStyle, CompStyle} from "../../styles";
import GraduatedPointMover from "./GraduatedPointMover";
import IndexControl from "./IndexControl";
import SelectionView from "./SelectionView";
import {useState} from "react";

const GeometryControl = ({map, setMap, refresh, screenSize}) => {
	const [curIndex, setCurIndex] = useState(0);
	const newMapInfo = _.cloneDeep(map);
	const points = _.get(map, 'screen.points', []);
	const point = {
		x: _.get(map, `screen.points[${curIndex}][0]`, 0),
		y: _.get(map, `screen.points[${curIndex}][1]`, 0),
	};
	const setPoint = async ({x, y}) => {
		_.set(newMapInfo, `screen.points[${curIndex}][0]`, x);
		_.set(newMapInfo, `screen.points[${curIndex}][1]`, y);
		await setMap(newMapInfo);
	};
	return <div style={{
		...BorderedStyle,
		display: 'grid',
		gridTemplateColumns: '100%',
	}}>
		<IndexControl curIndex={curIndex} setCurIndex={setCurIndex} max={points.length}/>
		<div style={{
			...CompStyle,
			display: 'grid',
			gridTemplateColumns: 'auto auto',
		}}>
			<GraduatedPointMover point={point} setPoint={setPoint} refresh={refresh}/>
			<SelectionView curIndex={curIndex} points={points} screenSize={screenSize}/>
		</div>
	</div>;
}

export default GeometryControl;
