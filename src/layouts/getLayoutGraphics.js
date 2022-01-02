
import axios from 'axios';
import _ from 'lodash';


export const getLayoutGraphics = async (configState, logger, uuid) => {
	console.log('the config state: ', configState);
	const table = _.get(configState, 'config.table', {});
	const layoutsUrl = _.get(configState, 'apiUrls.layoutsUrl', 'none');
	const shotsUrl = _.get(configState, 'apiUrls.shotsUrl', 'none');
	const graphicsUrl = _.get(configState, 'apiUrls.graphicsUrl', 'none');
	console.log('the table', table);

	const layoutResp = await axios.get(layoutsUrl + "layout/" + uuid);
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
		const infoResp = await axios.post(shotsUrl + "info/", {params});
		console.log(infoResp)
		if (infoResp.status !== 200 || !infoResp.data.success) {
			logger('Unable to calculate a shot info');
			continue;
		}
		const shotInfo = _.get(infoResp, 'data.shot-info', {});
		infos.push(shotInfo)
	}

	const graphicsResp = await axios.post(
		graphicsUrl + "layout/",
		{params: {table, layout, infos}});
	if (graphicsResp.status !== 200 || !graphicsResp.data.success) {
		logger('Unable to get graphics');
	}
	logger(graphicsResp.data.message);

	return _.get(graphicsResp, 'data.graphics', []);
};
