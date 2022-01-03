import GraphicsView from "../../GraphicsView";


const SelectionView = ({curIndex, points, screenSize: table}) => {
	const indexColor = index => index === curIndex ? {r: 128, g: 128, b: 0, a: 255} : {r: 255, g: 255, b: 255, a: 255};
	const createCircle = ([x, y], index) => ({
		type: 'circle',
		r: 10,
		fill: true,
		center: {x, y},
		color: indexColor(index),
	});
	// Dimensions are TODO
	return <GraphicsView graphics={points.map(createCircle)} dims={{table}}/>
}

export default SelectionView;
