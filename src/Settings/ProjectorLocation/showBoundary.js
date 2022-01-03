import axios from "axios";
import _ from 'lodash';

import {showDottedGrid} from "../../RandomShots/showGrid";
import {respHandler} from "../../RandomShots/generateRandomPractice";


const constructTriangle = (points, [idx1, idx2, idx3]) => {
	return {
		type: 'polygon',
		fill: false,
		'line-width': 0.07,
		color: {r: 255, g: 0, b: 0, a: 255},
		vertices: [points[idx1], points[idx2], points[idx3]],
	};
}

const constructTriangles = points => {
	return [
		[1, 0, 4],
		[1, 4, 6],
		[1, 6, 8],
		[1, 8, 9],
		[1, 9, 2],
		[2, 9, 10],
		[2, 10, 11],
		[2, 11, 7],
		[2, 7, 5],
		[2, 5, 3],
	].map(arr => constructTriangle(points, arr))
}


const showBoundary = (projectorUrl, map, listener) => async () => {
	const isError = respHandler(listener);
	console.log('the map', map);
	const rawPoints = _.get(map, 'physical.points', []);
	const points = rawPoints.map(([x, y]) => ({x, y}));
	const createCircle = center => ({
		type: 'circle',
		r: 0.5,
		fill: true,
		center,
		color: {r: 0, g: 255, b: 0, a: 255},
	});

	const graphics = [
		...constructTriangles(points),
		...points.map(createCircle),
		// ...showDottedGrid()
	];

	console.log('graphics', graphics, map);

	const resp = await axios.put(projectorUrl + 'graphics/', {graphics});
	console.log(resp);
	if (isError(resp, "pushing graphics")) {
		return;
	}

};


export default showBoundary;
