import React, {useState} from "react";
import {BorderedStyle} from "./styles";


export const GridControlUi = ({disabled, gridState, setGridState, width}) => {
    const updateNumRows = ({target: {value}}) => setGridState({...gridState, numRows: Number(value)});
    const updateNumCols = ({target: {value}}) => setGridState({...gridState, numCols: Number(value)});
    const updateShowGrid = ({target: {checked: showGrid}}) => setGridState({...gridState, showGrid});
    const {numRows, numCols, showGrid} = gridState;
    return (
        <>
            <label>Show grid:</label>
            <div>
                <input
                    type="checkbox"
                    disabled={disabled}
                    checked={showGrid}
                    onChange={updateShowGrid}/>
            </div>
            {width === 3 && <div/>}
            <label>Number of Rows:</label>
            <div>
                <input
                    disabled={disabled || !showGrid}
                    value={numRows}
                    onChange={updateNumRows}
                    min={1}
                    type="number"/>
            </div>
            {width === 3 && <div/>}
            <label>Number of Columns:</label>
            <div>
                <input
                    disabled={disabled || !showGrid}
                    value={numCols}
                    onChange={updateNumCols}
                    min={1}
                    type="number"/>
            </div>
            {width === 3 && <div/>}
        </>
    );
};

export const DEFAULT_GRID_STATE = {
    showGrid: false,
    numRows: 3,
    numCols: 7
};

export default ({disabled}) => {
    const [gridState, setGridState] = useState(DEFAULT_GRID_STATE);
    return (
        <div style={{
            ...BorderedStyle,
            display: 'grid',
            gridGap: '2px',
            gridTemplateColumns: '25% auto',
        }}>
        <GridControlUi
            gridState={gridState}
            setGridState={setGridState}
            disabled={!!disabled}
            width={2}
        />
    </div>)
};

