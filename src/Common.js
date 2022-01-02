import React, {useState} from "react";
import _ from 'lodash';
import ColorChooser from 'color-chooser';
import 'color-chooser/lib/color-chooser.css';
import {CONTROLLER_STYLE, CONTROLLER_STYLE_2, LABEL_STYLE, WIDE_CONTROLLER_STYLE} from "./styles";


const compToHex = c => {
	const h = c.toString(16);
	return h.length === 1 ? ("0" + h) : h;
};

const colorToHex = ({r, g, b, a}) => `#${compToHex(r)}${compToHex(g)}${compToHex(b)}${compToHex(a)}`;

const hexToColor = s => ({
	r: parseInt(s.substring(1, 3), 16),
	g: parseInt(s.substring(3, 5), 16),
	b: parseInt(s.substring(5, 7), 16),
	a: parseInt(s.substring(7, 9), 16),
});

export const ColorSelector = ({color, setColor}) => {
	const [open, setOpen] = useState(false);
	if (!open) {
		console.log('color', color);
		return (
			<div style={{
				width: '100%',
				height: '100%',
				display: 'grid',
				gridTemplateColumns: '50% 50%',
			}}>
				<button onClick={() => setOpen(true)}>
					Color...
				</button>
				<div style={{
					backgroundColor: colorToHex(color),
					width: '100%',
					height: '100%'
				}} />
			</div>
		);
	}
	return (
		<div>
			<button onClick={() => setOpen(false)}>Done</button>
			<ColorChooser
				alpha
				color={colorToHex(color)}
				onChange={h => setColor(hexToColor(h))}
			/>
		</div>
	);
};

export const NumberSetting = ({label, value, setValue, ...rest}) => (
    <>
		<label>{label}:</label>
        <div>
            <input
                type="number"
                value={value}
                onChange={({target: {value}}) => setValue(Number(value))}
                {...rest}
            />
        </div>
    </>
);


export const Point = ({label, point, step, set}) => (
	<div>
		<label>{label || 'Point'}</label>
		<br/>
		<label>x:</label>
		<input type="number" step={step || 0.01} value={_.get(point, 'x', 0)}
			   onChange={({target: {value}}) => set({...point, x: Number(value)})}/>
		<label>y:</label>
		<input type="number" step={step || 0.01} value={_.get(point, 'y', 0)}
			   onChange={({target: {value}}) => set({...point, y: Number(value)})}/>
	</div>
);


const DefaultedPointSetting = ({label, value: {x, y}, setValue, ...rest}) => (
	<>
			<label>{label}:</label>
			<label>x:</label>
			<input
				type="number"
				value={x}
				onChange={({target: {value}}) => setValue({y, x: Number(value)})}
				{...rest}
			/>
			<label>y:</label>
			<input
				type="number"
				value={y}
				onChange={({target: {value}}) => setValue({x, y: Number(value)})}
				{...rest}
			/>
	</>
);

export const PointSetting = ({label, step, value, setValue, ...rest}) => (
	<DefaultedPointSetting
		label={label || "Please provide a label"}
		step={step || 0.1}
		value={{x: _.get(value, 'x', 0), y: _.get(value, 'y', 0)}}
		setValue={setValue}
		{...rest}
	/>
);


export const BoolSetting = ({label, value, setValue, ...rest}) => (
	<>
		<label>{label}:</label>
		<div>
			<input
				type="checkbox"
				checked={value}
				onChange={({target: {checked}}) => setValue(checked)}
				{...rest}
			/>
		</div>
	</>
);

export const OptionSetting = ({label, value, setValue, children}) => (
	<>
		<label>{label}:</label>
		<div>
			<select value={value} onChange={({target: {value}}) => setValue(value)}>
				{children}
			</select>
		</div>
	</>
);

export const StringSetting = ({label, value, setValue, ...rest}) => (
	<>
		<label>{label}:</label>
		<input
			type="text"
			value={value}
			onChange={({target: {value}}) => setValue(value)}
			{...rest}
		/>
	</>
)


export const MaybeNumber = ({label, use, setUse, value, setValue, ...rest}) => (
	<>
		<label>{label}:</label>
		<div>
			<input
				type="checkbox"
				checked={use}
				onChange={({target: {checked}}) => setUse(checked)}/>
		</div>
		<div>
			<input
				disabled={!use}
				value={value}
				onChange={({target: {value}}) => setValue(Number(value))}
				type="number"
				{...rest}
			/>
		</div>
	</>
);




const DateOptions = {
	year: 'numeric',
	month: 'numeric',
	day: 'numeric',
	hour12: false
};

export const FormattedDate = ({unixTime}) => <label>
	{/*{new Date(unixTime).toLocaleDateString(undefined, DateOptions)}*/}
	{new Date(unixTime).toLocaleTimeString(undefined, DateOptions)}
</label>;
