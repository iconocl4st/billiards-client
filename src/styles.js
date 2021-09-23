

export const COLORS_ARRAY = [
    'rgb(51, 92, 67)',
    'rgb(255, 243, 176)',
    'rgb(224, 159, 62)',
    'rgb(158, 42, 43)',
    'rgb(84, 11, 14)',
];

const NAVIGATION_HEIGHT = 30;
const COMPONENT_HEIGHT = 150;

export const NAVIGATION_STYLE = {
    position: 'relative',
    backgroundColor: COLORS_ARRAY[3],
    color: COLORS_ARRAY[1],
    width: '100%',
    height: NAVIGATION_HEIGHT,
    top: 0,
};
export const PRIMARY_STYLE = {
    position: 'fixed',
    backgroundColor: COLORS_ARRAY[0],
    color: COLORS_ARRAY[1],
    width: '100%',
    height: '90%',
    top: 1.1 * NAVIGATION_HEIGHT,
    // height: HEIGHT,
};

export const gridStyle = (index, ncols, voffset, hoffset, height) => {
    const row = (index - index % ncols) / ncols;
    const col = index % ncols;
    return ({
        position: 'fixed',
        textAlign: 'center',
        backgroundColor: (row % 2 === 0) ? COLORS_ARRAY[4] : COLORS_ARRAY[2],
        top: voffset + height * row,
        left: hoffset + (100 * col / ncols) + '%',
        width: (100 / ncols) + '%',
        height: height,
        border: '1px solid black',
    });
};

export const navGridStyle = (index) => ({
    ...gridStyle(index, 5, 0, 0, NAVIGATION_HEIGHT),
    backgroundColor: COLORS_ARRAY[3],
    color: COLORS_ARRAY[1],
});
export const compGridStyle = (index) => gridStyle(index, 2, PRIMARY_STYLE.top, 0, COMPONENT_HEIGHT);
