import axios from 'axios';
import {URLS} from "./Apis";

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
        balls: {
            strike: [{type: 'cue'}, {type: 'object'}],
            bank: [{type: 'cue'}, {type: 'object'}],
            kick: [{type: 'cue'}, {type: 'object'}],
            combo: [{type: 'cue'}, {type: 'object'}, {type: 'object'}],
            kiss: [{type: 'cue'}, {type: 'object'}, {type: 'object'}],
        }[shotStepsType],
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


const getLocations = async params => {
    const {data: {locations, success}, status} = await axios.post(
        URLS.layouts + 'random/locations/', {params});
    return {
        success: success && status === 200,
        locations
    };
}

export const generateShot = async (state, listener) => {
    const {data: {message: cmessage, config, success: csuccess}, status: cstatus} = await axios.get(
        URLS.config);
    if (!csuccess || cstatus !== 200) {
        listener('Unable to retrieve config');
        return;
    }
    const {table} = config;
    const {dimensions} = table;

    listener(cmessage);

    // TODO: remove the following line
    const params = createParams(state, dimensions);
    const {data: {message: lmessage, locations, success: lsuccess}, status: lstatus} = await axios.post(
        URLS.layouts + 'random/locations/', {params});
    if (!lsuccess || lstatus !== 200) {
        listener('Unable to generate positions');
        return;
    }
    listener(lmessage);
    const {data: {message: smessage, shots, success: ssuccess}, status: sstatus} = await axios.post(
        URLS.shots, {
            params: {
                table,
                locations,
                'cut-tolerance': state.minCut,
                range: {begin: 0, end: 50},
                'step-wild-cards': {
                    strike: ['cue', 'strike', 'pocket'],
                    bank: ['cue', 'strike', 'rail', 'pocket'],
                    kick: ['cue', 'rail', 'strike', 'pocket'],
                    combo: ['cue', 'strike', 'strike', 'pocket'],
                    kiss: ['cue', 'strike', 'kiss', 'pocket'],
                }[state.shotStepsType]
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
        URLS.shots + 'info/', {
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
        URLS.graphics + 'shot-info/', {
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

    const {data: {message: pmessage, success: psuccess}, status: pstatus} = await axios.put(
        URLS.projector + 'graphics/', {graphics}
    );
    if (!psuccess || pstatus !== 200) {
        listener('Unable to post graphics');
        return;
    }
    listener(pmessage);
};

