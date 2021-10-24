import _ from "lodash";

const range = len => {
    return [...Array(len).keys()];
};

const emptyBall = (_, number) => ({
    color: { r: 0, g: 0, b: 0, a: 0},
    name: number.toString(),
    number,
    radius: 1.13,
});

const emptyPocket = (_, number) => ({
    number,
    'inner-segment-1': {x: 0, y: 0},
    'outer-segment-1': {x: 0, y: 0},
    'outer-segment-2': {x: 0, y: 0},
});

export const createPutData = config => ({
    table: {
        balls: _.get(config, 'table.balls', range(15).map(emptyBall)).map(({
            name, number, radius, type, color: {r, g, b, a}
        }) => ({
            name, number, radius, type, color: {r, g, b, a}
        })),
        pockets: _.get(config, 'table.pockets', range(6).map(emptyPocket)).map(pocket => ({
            'inner-segment-1': pocket['inner-segment-1'],
            'outer-segment-1': pocket['outer-segment-2'],
            'outer-segment-2': pocket['outer-segment-2']
        }))
    }
});


export const BALL_HEIGHT = 30;