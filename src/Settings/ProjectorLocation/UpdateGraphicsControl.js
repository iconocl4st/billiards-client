import {BorderedStyle} from "../../styles";
import _ from 'lodash';


const UpdateGraphicsControl = props => {
	const message = _.get(props, 'message', 'Ready');
	const showBoundary = _.get(props, 'showBoundary', () => {});
	return <div style={{
		...BorderedStyle,
		display: 'grid',
		gridTemplateColumns: 'auto auto',
	}}>
		<div style={{horizontalAlign: 'center'}}>
			<button onClick={showBoundary}>
				Show Boundary
			</button>
		</div>
		<label>{message}</label>
	</div>;
};



export default UpdateGraphicsControl;
