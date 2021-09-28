
import axios from 'axios';

export const createParams = ({
    distribution,
    destination,
    destinationRadius,
    destinationSpin,
    gridState: { showGrid, numRows, numCols},
    useSeed,
    seed,
    cueOnRail,
    objOnRail
}, dimensions) => {
    const params = {
        balls: [{type: "cue"}, {type: "object"}],
        distribution,
        dimensions
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
        'http://localhost:18083/random/locations/', {params});
    return {
        success: success && status === 200,
        locations
    };
}

export const generateShot = async (state, listener) => {
    const {data: {message: cmessage, config, success: csuccess}, status: cstatus} = await axios.get(
        'http://localhost:18086/');
    if (!csuccess || cstatus !== 200) {
        return;
    }
    const {table} = config;
    const {dims: dimensions} = table;
    listener(cmessage);

    const params = createParams(state, dimensions);
    const {data: {message: lmessage, locations, success: lsuccess}, status: lstatus} = await axios.post(
        'http://localhost:18083/random/locations/', {params});
    if (!lsuccess || lstatus !== 200) {
        return;
    }
    listener(lmessage);
    const {data: {message: smessage, 'shot-infos': shots, success: ssuccess}, status: sstatus} = await axios.post(
        'http://localhost:18081/', {
            locations,
            params: {
                'cut-tolerance': state.minCut,
                table,
                range: {begin: 0, end: 50},
                steps: [{cue: 0}, {object: 1}, {type: "pocket"}]
            }
        });
    if (!ssuccess || sstatus !== 200) {
        return;
    }
    listener(smessage);

    const numShots = shots.length;
    if (numShots <= 0) {
        return;
    }
    // Should use the same seed...
    // only side or only corner...
    const shotInfo = shots[Math.floor(Math.random() * numShots)];
    const {data: {message: gmessage, graphics, success: gsuccess}, status: gstatus} = await axios.post(
        'http://localhost:18082/shot/', {
            params: {},
            table,
            locations,
            'shot-info': shotInfo,
        });
    if (!gsuccess || gstatus !== 200) {
        return;
    }
    listener(gmessage);

    const {data: {message: pmessage, success: psuccess}, status: pstatus} = await axios.put(
        'http://localhost:18080/graphics/', {graphics}
    );
    listener(pmessage);
};

