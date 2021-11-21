
import axios from 'axios';
import _ from 'lodash';
import {getApiUrl} from "../Apis";

export const getLayoutGraphics = async ({configUrl, logger, uuid}) => {
	const config = await axios.get(configUrl);
	if (config.status !== 200 || !config.data.success) {
		logger('Unable to retrieve config');
		return;
	}
	logger(config.data.message);
	const table = _.get(config, 'data.config.table', {});

	const layoutResp = await axios.get(getApiUrl("Layouts", config) + "layout/" + uuid);
	if (layoutResp.status !== 200 || !layoutResp.data.success) {
		logger('Unable to retrieve layout');
		return;
	}
	logger(layoutResp.data.message);
	const layout = _.get(layoutResp, 'data.layout.entry', {});
	const locations = _.get(layoutResp, 'data.layout.entry.locations', {});
	const shots = _.get(layoutResp, 'data.layout.entry.shots', []);

	// TODO: Should be one request: calculate layout...
	const infos = [];
	for (const shot of shots) {
		const params = {table, locations, shot};
		const infoResp = await axios.post(getApiUrl("Shots", config) + "info/", {params});
		console.log(infoResp)
		if (infoResp.status !== 200 || !infoResp.data.success) {
			logger('Unable to calculate a shot info');
			continue;
		}
		const shotInfo = _.get(infoResp, 'data.shot-info', {});
		infos.push(shotInfo)
	}

	const graphicsResp = await axios.post(
		getApiUrl("Graphics", config) + "layout/",
		{params: {table, layout, infos}});
	if (graphicsResp.status !== 200 || !graphicsResp.data.success) {
		logger('Unable to get graphics');
	}
	logger(graphicsResp.data.message);

	return _.get(graphicsResp, 'data.graphics', []);
};
