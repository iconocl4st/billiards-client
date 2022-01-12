import {BorderedStyle} from "../../styles";
import _ from 'lodash';


const UpdateGraphicsControl = props => {
	const message = _.get(props, 'message', 'Ready');
	const showBoundary = _.get(props, 'showBoundary', () => {});
	const refresh = _.get(props, 'refresh', () => {});
	return <div style={{
		...BorderedStyle,
		display: 'grid',
		gridTemplateColumns: 'auto auto auto',
	}}>
		<label>{message}</label>
		<div style={{horizontalAlign: 'center'}}>
			<button onClick={showBoundary}>
				Show Boundary
			</button>
		</div>
		<div style={{horizontalAlign: 'center'}}>
			<button onClick={refresh}>
				Refresh
			</button>
		</div>
	</div>;
};



export default UpdateGraphicsControl;
