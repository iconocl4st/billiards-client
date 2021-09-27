import React, { useState } from 'react';
import useAxios from 'axios-hooks';
import axios from 'axios';
import ColorChooser from 'color-chooser';
import _ from 'lodash';

import 'color-chooser/lib/color-chooser.css';


const BALL_STYLE = {
    border: '1px solid black',

};


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

const Ball = ({ball, setBall}) => {
    const [colorIsOpen, setColorIsOpen] = useState(false);
    if (colorIsOpen) {
	return	(
		<div>
			<ColorChooser
    		    		alpha
    	    			color={colorToHex(ball.color)}
    	    			onChange={h => setBall({color: hexToColor(h)})}
	    			/>
			<button onClick={() => setColorIsOpen(false)}>Done</button>
		</div>
	);
    }
    return (
	    <div style={BALL_STYLE}>
	    <label>Number: {ball.number}</label>
	    <button onClick={() => setColorIsOpen(true)}>Color...</button>
	    <label>Radius</label>
	    <input
    		type="number"
	    	min="0"
    		onChange={({target: {value}}) => setBall({radius: Number(value)})}
	    	step="0.01"
    		value={ball.radius}/>
	    </div>
    );
};


const Point = ({x, y, set}) => (
	<div>
	<label>x</label>
	<input type="number" min="0" step="0.01" value={x} onChange={({target: {value}}) => set({x: Number(value)})} />
	<label>y</label>
	<input type="number" min="0" step="0.01" value={y} onChange={({target: {value}}) => set({y: Number(value)})} />	
	</div>
);


const pointSetter = (setPocket, pocket, key) => p => setPocket({...pocket, [key]: {...pocket[key], ...p}});


const Pocket = ({pocket, setPocket}) => (
	<div style={{border: '1px solid black'}}>
	<label>Pocket: {_.get(pocket, 'number', -1).toString()}</label>
	<br/>
	<label>Inner Segment 1</label>
	<Point set={pointSetter(setPocket, pocket, 'inner-segment-1')} {...pocket['inner-segment-1']}/>
	<br/>
	<label>Outer Segment 1</label>
	<Point set={pointSetter(setPocket, pocket, 'outer-segment-1')} {...pocket['outer-segment-1']}/>
	<br/>
	<label>Outer Segment 2</label>
	<Point set={pointSetter(setPocket, pocket, 'outer-segment-2')} {...pocket['outer-segment-2']}/>
	</div>
);

const range = len => {
    return [...Array(len).keys()];
};

const emptyBall = (_, number) => ({
    color: { r: 0, g: 0, b: 0, a: 0},
    name: number.toString(),
    number,
    radius: 1.13,
});

const emptyPocket = (_, number) => ({
    number,
    'inner-segment-1': {x: 0, y: 0},
    'outer-segment-1': {x: 0, y: 0},
    'outer-segment-2': {x: 0, y: 0},
});


const BallsConfig = ({balls, setBall}) => (
	<div>
	{
	    balls.map(
		(ball, index) => (
			<Ball
		    		key={`ball-${index}`}
		    		ball={ball}
		    setBall={b => setBall(index, b)}
		    />
		)
	    )
	}
	</div>
);

const PocketsConfig = ({pockets, setPocket}) => (
	<div>
	{
	    pockets.map(
		(pocket, index) => (
			<Pocket
		    key={`pocket-${index}`}
		    pocket={pocket}
		    setPocket={p => setPocket(index, p)}
		    />
		)
	    )
	}
	</div>

);


const createPutData = config => ({
    table: {
	balls: _.get(config, 'table.balls', range(15).map(emptyBall)).map(({
	    name,
	    color: {r, g, b, a},
	    number,
	    radius,
	    ...ball
	}) => ({
	    name,
	    color: {r, g, b, a},
	    number,
	    radius,
	    'ball-type': ball['ball-type'],
	})),
	pockets: _.get(config, 'table.pockets', range(6).map(emptyPocket)).map(pocket => ({
	    'inner-segment-1': pocket['inner-segment-1'],
	    'outer-segment-1': pocket['outer-segment-2'],
	    'outer-segment-2': pocket['outer-segment-2']
	}))
    }
});


const Table = () => {
    const [{ data, loading, error }, refetch] = useAxios(
	'http://localhost:18086/'
    );

    const putData = createPutData(_.get(data, 'config', {}));

    return (
	<div>
	    <div style={{
		position: 'fixed',
		left: '0%',
		width: '50%'
	    }}>
	    	<BallsConfig
			balls={putData.table.balls}
			setBall={async (index, b) => {
	    			putData.table.balls[index] = {...putData.table.balls[index], ...b};
	    			const putResults = await axios.put('http://localhost:18086/', putData);
	    			await refetch();
			}}
	    	/>
	    </div>
	    <div style={{
		position: 'fixed',
		left: '50%',
		width: '50%'
	    }}>
	    	<PocketsConfig
			pockets={putData.table.pockets}
			setPocket={async (index, p) => {
	    			putData.table.pockets[index] = {...putData.table.pockets[index], ...p};
	    			const putResults = await axios.put('http://localhost:18086/', putData);
	    			await refetch();
			}}
	    	/>
	    </div>
	</div>
    );
};

export default Table;
