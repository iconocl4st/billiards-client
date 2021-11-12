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

export const ColorSelector = ({color, set, style, showStyle}) => {
	const [open, setOpen] = useState(false);
	if (!open) {
		return (
			<div style={{display: 'block', placeItems: 'center', ...style}}>
				<button
					style={{position: 'absolute', width: '50%'}}
					onClick={() => setOpen(true)}
				>
					Color...
				</button>
				<div style={{
					position: 'absolute',
					left: '50%',
					width: '50%',
					height: style.height,
					border: '1px solid white',
					backgroundColor: colorToHex(color)}} />
			</div>
		);
	}
	return (
		<div style={style}>
			<button onClick={() => setOpen(false)}>Done</button>
			<ColorChooser
				style={{
					position: 'absolute',
					zIndex: -5
				}}
				alpha
				color={colorToHex(color)}
				onChange={h => set(hexToColor(h))}
			/>
		</div>
	);
};

export const NumberSetting = ({label, value, setValue, ...rest}) => (
    <>
        <div style={LABEL_STYLE}>
            <label>{label}:</label>
        </div>
        <div style={CONTROLLER_STYLE}>
            <input
                type="number"
                value={value}
                onChange={({target: {value}}) => setValue(Number(value))}
                {...rest}
            />
        </div>
        <br/>
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
		<div style={LABEL_STYLE}>
			<label>{label}:</label>
		</div>
		<div style={CONTROLLER_STYLE}>
			<label>x:</label>
			<input
				type="number"
				value={x}
				onChange={({target: {value}}) => setValue({y, x: Number(value)})}
				{...rest}
			/>
		</div>
		<div style={CONTROLLER_STYLE_2}>
			<label>y:</label>
			<input
				type="number"
				value={y}
				onChange={({target: {value}}) => setValue({x, y: Number(value)})}
				{...rest}
			/>
		</div>
		<br/>
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
		<div style={LABEL_STYLE}>
			<label>{label}:</label>
		</div>
		<div style={CONTROLLER_STYLE}>
			<input
				type="checkbox"
				value={value}
				onChange={({target: {checked}}) => setValue(checked)}
				{...rest}
			/>
		</div>
		<br/>
	</>
);

export const OptionSetting = ({label, value, setValue, children}) => (
	<>
		<div style={LABEL_STYLE}>
			<label>{label}:</label>
		</div>
		<div style={CONTROLLER_STYLE}>
			<select value={value} onChange={({target: {value}}) => setValue(value)}>
				{children}
			</select>
		</div>
		<br/>
	</>
);

export const StringSetting = ({label, value, setValue, ...rest}) => (
	<>
		<div style={LABEL_STYLE}>
			<label>{label}:</label>
		</div>
		<div style={WIDE_CONTROLLER_STYLE}>
			<input
				type="text"
				value={value}
				onChange={({target: {value}}) => setValue(value)}
				{...rest}
			/>
		</div>
	</>
)


export const MaybeNumber = ({label, use, setUse, value, setValue, ...rest}) => (
	<>
		<div style={LABEL_STYLE}>
			<label>{label}:</label>
		</div>
		<div style={CONTROLLER_STYLE}>
			<input
				type="checkbox"
				checked={use}
				onChange={({target: {checked}}) => setUse(checked)}/>
		</div>
		<div style={CONTROLLER_STYLE_2}>
			<input
				disabled={!use}
				value={value}
				onChange={({target: {value}}) => setValue(Number(value))}
				type="number"
				{...rest}
			/>
		</div>
		<br/>
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
