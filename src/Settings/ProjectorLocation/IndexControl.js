import {CompStyle} from "../../styles";


const IndexControl = ({curIndex, setCurIndex, max}) => {
	const left = () => setCurIndex(Math.max(0, curIndex - 1));
	const canGoLeft = curIndex > 0;
	const right = () => setCurIndex(Math.min(max, curIndex + 1));
	const canGoRight = curIndex < max;

	return <div style={{
		...CompStyle,
		display: 'grid',
		gridTemplateColumns: '33% 33% 33%',
	}}>
		<button disabled={!canGoLeft} onClick={left}>Previous</button>
		<label style={{textAlign: 'center'}}>Current: {curIndex}</label>
		<button disabled={!canGoRight} onClick={right}>Next</button>
	</div>
};

export default IndexControl;
