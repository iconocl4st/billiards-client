import axios from 'axios';
import _ from 'lodash';


const respHandler = listener => (resp, msg) => {
    if (resp.status === 200 && resp.data.success) {
        listener(resp.data.message);
        return false;
    } else {
        listener(msg);
        return true;
    }
};

const createEmptyLayout = (table, locations) => ({
    table,
    layout: {
        name: "no name",
        locations,
        shots: [],
        graphics: []
    },
    infos: [],
    options: {}
});


export const generateLocations = ({useSeed, seed, numBalls, setGraphics, configState, listener}) => async () => {
    const table = _.get(configState, 'config.table', {});
    const dimensions = _.get(configState, 'config.table.dimensions', {});
    const layoutsUrl = _.get(configState, 'apiUrls.layoutsUrl');
    const graphicsUrl = _.get(configState, 'apiUrls.graphicsUrl');
    const projectorUrl = _.get(configState, 'apiUrls.projectorUrl');
    const isError = respHandler(listener);
    const params = {
        dimensions,
        'ball-radius': 1.13,
        balls: Array.from(Array(numBalls).keys()).map(
            idx => ({ type: 'object', number: idx + 1})),
        ...(useSeed ? {seed}: {})
    };
    const locResp = await axios.post(layoutsUrl + 'random/locations/', {params});
    if (isError(locResp, 'Unable to generate locations')) {
        return;
    }
    const locations = _.get(locResp, 'data.locations', {});

    const graphicsResp = await axios.post(
        graphicsUrl + 'layout/',
        {params: createEmptyLayout(table, locations)});
    if (isError(graphicsResp, 'Unable to generate graphics')) {
        return;
    }
    const graphics = _.get(graphicsResp, 'data.graphics', []);
    setGraphics(graphics);

    const projResp = await axios.put(projectorUrl + 'graphics/', {graphics});
    if (isError(projResp, 'Unable to post graphics')) {
        return;
    }
    listener('Success');
};

const WILD_CARDS = {
    strike: [{
        'step-type': 'cue',
        'choice-type': 'any',
    }, {
        'step-type': 'strike',
        'choice-type': 'any',
    }, {
        'step-type': 'pocket',
        'choice-type': 'any',
    }],
    bank: [{
        'step-type': 'cue',
        'choice-type': 'any',
    }, {
        'step-type': 'strike',
        'choice-type': 'any',
    }, {
        'step-type': 'rail',
        'choice-type': 'any',
    }, {
        'step-type': 'pocket',
        'choice-type': 'any',
    }],
    kick: [{
        'step-type': 'cue',
        'choice-type': 'any',
    }, {
        'step-type': 'rail',
        'choice-type': 'any',
    }, {
        'step-type': 'strike',
        'choice-type': 'any',
    }, {
        'step-type': 'pocket',
        'choice-type': 'any',
    }],
    combo: [{
        'step-type': 'cue',
        'choice-type': 'any',
    }, {
        'step-type': 'strike',
        'choice-type': 'any',
    }, {
        'step-type': 'strike',
        'choice-type': 'any',
    }, {
        'step-type': 'pocket',
        'choice-type': 'any',
    }],
    carom: [{
        'step-type': 'cue',
        'choice-type': 'any',
    }, {
        'step-type': 'strike',
        'choice-type': 'any',
    }, {
        'step-type': 'kiss',
        'choice-type': 'any',
    }, {
        'step-type': 'pocket',
        'choice-type': 'any',
    }],
    kiss: [{
        'step-type': 'cue',
        'choice-type': 'any',
    }, {
        'step-type': 'kiss',
        'choice-type': 'any',
    }, {
        'step-type': 'strike',
        'choice-type': 'any',
    }, {
        'step-type': 'pocket',
        'choice-type': 'any',
    }],
};

const REQUIRED_BALLS = {
    strike: [{type: 'cue'}, {type: 'object', number: 1}],
    bank: [{type: 'cue'}, {type: 'object', number: 1}],
    kick: [{type: 'cue'}, {type: 'object', number: 1}],
    combo: [{type: 'cue'}, {type: 'object', number: 1}, {type: 'object', number: 2}],
    kiss: [{type: 'cue'}, {type: 'object', number: 1}, {type: 'object', number: 2}],
    carom: [{type: 'cue'}, {type: 'object', number: 1}, {type: 'object', number: 2}],
};


export const createParams = ({
    distribution,
    destination,
    destinationRadius,
    destinationSpin,
    gridState: { showGrid, numRows, numCols},
    shotStepsType,
    useSeed,
    seed,
    cueOnRail,
    objOnRail
}, dimensions) => {
    const params = {
        balls: REQUIRED_BALLS[shotStepsType],
        distribution,
        dimensions,
        'ball-radius': 1.13
    };
    if (destination) {
        params['destination'] = {
            radius: destinationRadius,
            'max-spin': destinationSpin
        }
    }
    if (distribution === 'spot') {
        params['grid-state'] = {
            'show': showGrid,
            'num-rows': numRows,
            'num-cols': numCols
        };
    }
    if (useSeed) {
        params['seed'] = seed;
    }
    if (distribution === 'spot' && cueOnRail) {
        params['cue-on-rail'] = true;
    }
    if (distribution === 'spot' && objOnRail) {
        params['obj-on-rail'] = true;
    }

    return params;
};


// const getLocations = async params => {
//     const {data: {locations, success}, status} = await axios.post(
//         getUrl("Layouts") + 'random/locations/', {params});
//     return {
//         success: success && status === 200,
//         locations
//     };
// }

export const generateShot = async (state, listener, setGraphics, configState) => {
    const table = _.get(configState, 'config.table', {});
    const dimensions = _.get(configState, 'config.table.dimensions', {});
    const layoutsUrl = _.get(configState, 'apiUrls.layoutsUrl');
    const shotsUrl = _.get(configState, 'apiUrls.shotsUrl');
    const graphicsUrl = _.get(configState, 'apiUrls.graphicsUrl');
    const projectorUrl = _.get(configState, 'apiUrls.projectorUrl');
    const isError = respHandler(listener);

    // TODO: remove the following line
    const params = createParams(state, dimensions);

    const locResp = await axios.post(layoutsUrl + 'random/locations/', {params});
    if (isError(locResp, 'Unable to generate locations')) {
        return;
    }
    const locations = _.get(locResp, 'data.locations', {});

    const listResp = await axios.post(
        shotsUrl + 'list/', {
            params: {
                table,
                locations,
                'cut-tolerance': state.minCut,
                range: {begin: 0, end: 50},
                'step-wild-cards': WILD_CARDS[state.shotStepsType]
            }
        });
    if (isError(listResp, 'Unable to list shots')) {
        return;
    }
    const shots = _.get(listResp, 'data.shots');
    const numShots = shots.length;
    if (numShots <= 0) {
        listener('no shots found');
        return;
    }

    // Should use the same seed...
    // only side or only corner...
    const shot = shots[Math.floor(Math.random() * numShots)];
    const shotInfoResp = await axios.post(
        shotsUrl + 'info/', {
            params: {
                table,
                locations,
                shot
            },
        });
    if (isError(shotInfoResp, 'Unable to retrieve shot information')) {
        return;
    }
    const shotInfo = _.get(shotInfoResp, 'data.shot-info');

    const graphicsResp = await axios.post(
        graphicsUrl + 'shot-info/', { params: {
            table,
            locations,
            'shot-info': shotInfo,
            options: { 'draw-lines': state.drawLines}
        }});

    console.log('graphics response', graphicsResp);

    if (isError(graphicsResp, 'Unable to generate graphics')) {
        return;
    }
    const graphics = _.get(graphicsResp, 'data.graphics', []);
    setGraphics(graphics);

    const projResp = await axios.put(projectorUrl + 'graphics/', {graphics});
    if (isError(projResp, 'Unable to post graphics')) {
        return;
    }
    listener('Success');
};

