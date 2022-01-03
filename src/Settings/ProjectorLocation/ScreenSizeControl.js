import _ from "lodash";
import SaveDelay from "../../SaveDelay";
import {BorderedStyle} from "../../styles";
import {NumberSetting} from "../../Common";


const ScreenSizeControl = ({map, setMap, screenSize: {width, height}, refresh}) => {
	const setWidth = async width => {
		const newMapInfo = _.cloneDeep(map);
		_.set(newMapInfo, 'screen-size.width', width);
		await setMap(newMapInfo);
	};
	const setHeight = async height => {
		const newMapInfo = _.cloneDeep(map);
		_.set(newMapInfo, 'screen-size.height', height);
		await setMap(newMapInfo);
	};
	const {value: w, setValue: setW} = SaveDelay(width, setWidth, refresh);
	const {value: h, setValue: setH} = SaveDelay(height, setHeight, refresh);
	return (
		<div style={{
			...BorderedStyle,
			display: 'grid',
			gridTemplateColumns: 'auto auto',
		}}>
			<NumberSetting label="Projector resolution X" value={w} setValue={setW}/>
			<NumberSetting label="Projector resolution Y" value={h} setValue={setH}/>
		</div>
	)
};


export default ScreenSizeControl;
