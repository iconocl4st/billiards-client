

export const COLORS_ARRAY = [
    'rgb(51, 92, 67)',
    'rgb(255, 243, 176)',
    'rgb(224, 159, 62)',
    'rgb(158, 42, 43)',
    'rgb(84, 11, 14)',
];

const NAVIGATION_HEIGHT = 30;
const COMPONENT_HEIGHT = 100;

export const NAVIGATION_STYLE = {
    position: 'absolute',
    width: '96%',
    height: NAVIGATION_HEIGHT,
    left: '2%',
    top: 10,
};
export const CONTENT_STYLE = {
    position: 'absolute',
    width: '96%',
    left: '2%',
    top: NAVIGATION_HEIGHT + 20,
    backgroundColor: COLORS_ARRAY[4],
    color: COLORS_ARRAY[1],
    border: '1px solid white'
};

export const LABEL_STYLE = {position: 'absolute', left: '1%', width: '33%'};
export const CONTROLLER_STYLE = {position: 'absolute', left: '33%', width: '33%'};
export const CONTROLLER_STYLE_2 = {position: 'absolute', left: '66%', width: '33%'};
export const WIDE_CONTROLLER_STYLE = {position: 'absolute', left: '33%', width: '66%'};

export const gridStyle = (index, ncols, height) => {
    const row = (index - index % ncols) / ncols;
    const col = index % ncols;
    return ({
        position: 'absolute',
        display: 'grid',
        placeItems: 'center',
        backgroundColor: COLORS_ARRAY[4],
        color: COLORS_ARRAY[1],
        // backgroundColor: (row % 2 === 0) ? COLORS_ARRAY[4] : COLORS_ARRAY[2],
        top: (height + 5) * row,
        left: (100 * col / ncols) + '%',
        width: (98 / ncols) + '%',
        height,
        border: '1px solid white',
    });
};

export const compGridStyle = (index, ncols) => gridStyle(
    index,
    ncols || 3,
    COMPONENT_HEIGHT);

export const SINGLE_COMP_STYLE = {
    ...compGridStyle(0, 1)
};
