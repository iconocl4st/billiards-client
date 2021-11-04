import axios from 'axios';
import {getApiUrl} from "./Apis";
import _ from 'lodash';


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

export const generateShot = async (state, listener, graphics_receiver, configData) => {
    const table = _.get(configData, 'data.config.table', {});
    const dimensions = _.get(configData, 'data.config.table.dimensions', {});

    // const {data: {message: cmessage, config, success: csuccess}, status: cstatus} = await axios.get(
    //     getUrl("Configuration"));
    // if (!csuccess || cstatus !== 200) {
    //     listener('Unable to retrieve config');
    //     return;
    // }
    // listener(cmessage);

    // TODO: remove the following line
    const params = createParams(state, dimensions);
    const {data: {message: lmessage, locations, success: lsuccess}, status: lstatus} = await axios.post(
        getApiUrl("Layouts", configData) + 'random/locations/', {params});
    if (!lsuccess || lstatus !== 200) {
        listener('Unable to generate positions');
        return;
    }
    listener(lmessage);
    const {data: {message: smessage, shots, success: ssuccess}, status: sstatus} = await axios.post(
        getApiUrl("Shots", configData) + 'list/', {
            params: {
                table,
                locations,
                'cut-tolerance': state.minCut,
                range: {begin: 0, end: 50},
                'step-wild-cards': WILD_CARDS[state.shotStepsType]
            }
        });
    if (!ssuccess || sstatus !== 200) {
        listener('Unable to list shots');
        return;
    }
    listener(smessage);
    console.log('shots', shots)

    const numShots = shots.length;
    if (numShots <= 0) {
        listener('no shots found');
        return;
    }
    // Should use the same seed...
    // only side or only corner...
    const shot = shots[Math.floor(Math.random() * numShots)];
    const {data: {message: imessage, 'shot-info': shotInfo, success: isuccess}, status: istatus} = await axios.post(
        getApiUrl("Shots", configData) + 'info/', {
            params: {
                table,
                locations,
                shot
            },
        });
    if (!isuccess || istatus !== 200) {
        listener('Unable to retrieve shot information');
        return;
    }
    listener(imessage);

    console.log('shot info', shotInfo);

    const {data: {message: gmessage, graphics, success: gsuccess}, status: gstatus} = await axios.post(
        getApiUrl("Graphics", configData) + 'shot-info/', {
            params: {
                table,
                locations,
                'shot-info': shotInfo,
            },
        });
    if (!gsuccess || gstatus !== 200) {
        listener('Unable to retrieve graphics');
        return;
    }
    listener(gmessage);

    console.log('graphics', graphics);
    graphics_receiver(graphics);

    const {data: {message: pmessage, success: psuccess}, status: pstatus} = await axios.put(
        getApiUrl("Projector", configData) + 'graphics/', {graphics}
    );
    if (!psuccess || pstatus !== 200) {
        listener('Unable to post graphics');
        return;
    }
    listener(pmessage);
};

