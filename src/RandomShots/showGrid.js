
export const showGrid = (w, h, nx, ny) => {
	const segments = [];
	for (let i = 0; i < nx + 2; i++) {
		segments.push({
			begin: {x: w * i / (nx + 1), y: 0},
			end: {x: w * i / (nx + 1), y: h}
		});
	}
	for (let i = 0; i < ny + 2; i++) {
		segments.push({
			begin: {x: 0, y: h * i / (ny + 1)},
			end: {x: w, y: h * i / (ny + 1)}
		});
	}
	return [{
		type: 'lines',
		fill: false,
		'line-width': 0.25,
		color: {r: 255, g: 255, b: 255, a: 255},
		segments,
	}];
};


const addDottedLine = ({x: bx, y: by}, {x: ex, y: ey}, nDots, segments) => {
	let begin = {x: bx, y: by};
	for (let i = 0; i < nDots; i++) {
		const s = (i + 1) / nDots;
		const end = {
			x: bx * (1 - s) + ex * s,
			y: by * (1 - s) + ey * s,
		};
		segments.push({begin, end});
		begin = end;
	}
	return segments;
};

export const showDottedGrid = (w, h, nx, ny, dist) => {
	const nDotsX = w / dist;
	const nDotsY = h / dist;

	const segments = [];
	for (let i = 0; i < nx + 2; i++) {
		addDottedLine(
			{x: w * i / (nx + 1), y: 0},
			{x: w * i / (nx + 1), y: h},
			nDotsX,
			segments);
	}
	for (let i = 0; i < ny + 2; i++) {
		addDottedLine(
			{x: 0, y: h * i / (ny + 1)},
			{x: w, y: h * i / (ny + 1)},
			nDotsY,
			segments);
	}
	return [{
		type: 'lines',
		fill: false,
		'line-width': 0.05,
		color: {r: 255, g: 255, b: 255, a: 255},
		segments,
	}];
};

