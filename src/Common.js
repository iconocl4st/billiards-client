
import _ from 'lodash';

export const Point = ({label, point, step, set}) => (
	<div>
	<label>{label || 'Point'}</label>
	<br/>
	<label>x</label>
	<input type="number" step={step || 0.01} value={_.get(point, 'x', 0)} onChange={({target: {value}}) => set({...point, x: Number(value)})}/>
	<label>y</label>
	<input type="number" step={step || 0.01} value={_.get(point, 'y', 0)} onChange={({target: {value}}) => set({...point, y: Number(value)})}/>
	</div>
);
