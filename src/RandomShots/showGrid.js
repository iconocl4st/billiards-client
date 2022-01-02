
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
		'line-width': 0.5,
		color: {r: 255, g: 255, b: 255, a: 255},
		segments,
	}];
};
