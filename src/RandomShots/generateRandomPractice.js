import _ from "lodash";
import axios from 'axios';
import {BY_VALUE} from "./PracticeTypes";
import {showGrid} from './showGrid';

export const respHandler = listener => (resp, msg) => {
	if (resp.status !== 200 || resp.statusText !== 'OK') {
		listener('Unable to ' + msg);
		return true;
	}
	if (resp.data.success) {
		listener(resp.data.message);
		return false;
	} else {
		listener('Unable to ' + msg + ': ' + resp.data.message);
		return true;
	}
};

const getGridGraphics = (options, config) => {
	if (!options['show-grid']) {
		return [];
	}
	const nx = _.get(options, 'n-grid-x', 7);
	const ny = _.get(options, 'n-grid-y', 3);
	const w = _.get(config, 'dimensions.width');
	const h = _.get(config, 'dimensions.height');

	return showGrid(w, h, nx, ny);
};


export const generateRandomPractice = async state => {
	const config = _.get(state, 'configState.config.pool-config', {});
	const layoutsUrl = _.get(state, 'configState.apiUrls.layoutsUrl');
	const shotsUrl = _.get(state, 'configState.apiUrls.shotsUrl');
	const graphicsUrl = _.get(state, 'configState.apiUrls.graphicsUrl');
	const projectorUrl = _.get(state, 'configState.apiUrls.projectorUrl');
	const listener = _.get(state, 'setStatusMessage', () => {});

	const seed = _.get(state, 'seed', 1776);
	const useSeed = _.get(state, 'useSeed', false);
	const optionSelections = _.get(state, 'options', {});
	const practiceType = _.get(state, 'practiceType', 'no practice type');
	const drawLines = _.get(state, 'drawLines', true);
	const useDots = _.get(state, 'useDots', false);
	const setGraphics = _.get(state, 'setGraphics', () => {});

	const practiceSpec = _.get(BY_VALUE, `${practiceType}.options`, []);
	const defaultOptions = practiceSpec.reduce((acc, {name, defaultValue}) => ({...acc, [name]: defaultValue}), {});
	const options = {...defaultOptions, ...optionSelections};
	console.log('options in request', options, defaultOptions);


	const gridGraphics = getGridGraphics(options, config);

	// if ('show-grid' in)


	const isError = respHandler(listener);

	try {
		const genResp = await axios.post(layoutsUrl + 'random/practice/',
			{params: {'practice-type': practiceType, options, config, ...(useSeed ? {seed} : {})}}
		);
		if (isError(genResp, 'generate layout')) {
			return;
		}
		const layout = _.get(genResp, 'data.layout', {});
		const calcResp = await axios.post(shotsUrl + 'layout/', {params: {config, layout}});
		if (isError(calcResp, 'calculate shot')) {
			return;
		}

		const detailedLayout = _.get(calcResp, 'data.detailed-layout', {});
		const renderResp = await axios.post(
			graphicsUrl + 'layout/',
			{ params: {
				layout: detailedLayout,
				options: {'draw-lines': drawLines, 'use-dots': useDots}}});
		if (isError(renderResp, 'render shot')) {
			return;
		}
		const shotGraphics = _.get(renderResp, 'data.graphics', []);
		const graphics = [...gridGraphics, ...shotGraphics];
		setGraphics(graphics);
		console.log('shot graphics', shotGraphics);
		const projectResp = await axios.put(
			projectorUrl + 'graphics/',
			{graphics}
		);
		if (isError(projectResp, 'project shot')) {
			return;
		}
		listener("Success");
	} catch (e) {
		listener("Encountered an exception." + e);
	}
};