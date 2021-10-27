
import React, { useRef, useEffect } from 'react'

const SCALE = 10;

const getColor = ({color}) => `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`;

const drawLine = (ctx, g) => {
	ctx.strokeStyle = getColor(g);
	ctx.strokeWidth = SCALE * g['line-width'];
	for (const s of g.segments) {
		ctx.beginPath();
		ctx.moveTo(SCALE * s.begin.x, SCALE * s.begin.y);
		ctx.lineTo(SCALE * s.end.x, SCALE * s.end.y);
		ctx.stroke();
	}
};

const drawPolygon = (ctx, g) => {
	ctx.strokeStyle = getColor(g);
	ctx.strokeWidth = SCALE * g['line-width'];
	ctx.beginPath();
	let first = true;
	for (const s of g.vertices) {
		if (first) {
			ctx.moveTo(SCALE * s.x, SCALE * s.y);
			first = false;
		} else {
			ctx.lineTo(SCALE * s.x, SCALE * s.y);
		}
	}
	ctx.stroke();
};

const drawCircle = (ctx, g) => {
	if (g.fill) {
		ctx.fillStyle = getColor(g);
	} else {
		ctx.strokeStyle = getColor(g);
		ctx.strokeWidth = SCALE * g['line-width'];
	}
	ctx.beginPath();
	ctx.arc(SCALE * g.center.x, SCALE * g.center.y, SCALE * g.r, 0, 2 * Math.PI);

	if (g.fill) {
		ctx.fill();
	} else {
		ctx.stroke();
	}
};


const drawGraphic = (ctx, g) => {
	const drawer = {
		'lines': drawLine,
		'circle': drawCircle,
		'polygon': drawPolygon,
	}[g.type];

	drawer(ctx, g);
}

const draw = (ctx, graphics) => {
	ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
	ctx.fillStyle = 'rgb(0, 0, 0)';
	ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

	for (const g of graphics) {
		drawGraphic(ctx, g);
	}

	ctx.fillStyle = "rgb(0, 0, 255)";
	// ctx.beginPath();
	// ctx.arc(10, 10, 20, 0, 2*Math.PI);
	// ctx.fill();
};

const GraphicsView = ({graphics, ...props}) => {
	const canvasRef = useRef(null);
	console.log(graphics);

	useEffect(() => {
		const canvas = canvasRef.current
		const context = canvas.getContext('2d')

		//Our draw come here
		draw(context, graphics || [])
	}, [draw, graphics])

	return <canvas
		style={{
			width: 400,
			height: 200,
		}}
		width={SCALE * 92}
		height={SCALE * 46}
		ref={canvasRef}
		{...props}
	/>
};

export default GraphicsView;
