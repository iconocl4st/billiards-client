import React, {useState} from "react";
import {LABEL_STYLE, CONTROLLER_STYLE} from "./styles";

export const GridControlUi = ({disabled, style, gridState, setGridState}) => {
    const updateNumRows = ({target: {value}}) => setGridState({...gridState, numRows: Number(value)});
    const updateNumCols = ({target: {value}}) => setGridState({...gridState, numCols: Number(value)});
    const updateShowGrid = ({target: {checked: showGrid}}) => setGridState({...gridState, showGrid});
    const {numRows, numCols, showGrid} = gridState;
    return (
        <div style={style}>
            <div style={LABEL_STYLE}><label>Show grid:</label></div>
            <div style={CONTROLLER_STYLE}>
                <input
                    type="checkbox"
                    disabled={disabled}
                    checked={showGrid}
                    onChange={updateShowGrid}/>
            </div>
            <br/>
            <div style={LABEL_STYLE}>
                <label>Number of Rows:</label>
            </div>
            <div style={CONTROLLER_STYLE}>
                <input
                    disabled={disabled || !showGrid}
                    value={numRows}
                    onChange={updateNumRows}
                    min={1}
                    type="number"/>
            </div>
            <br/>
            <div style={LABEL_STYLE}>
                <label>Number of Columns:</label>
            </div>
            <div style={CONTROLLER_STYLE}>
                <input
                    disabled={disabled || !showGrid}
                    value={numCols}
                    onChange={updateNumCols}
                    min={1}
                    type="number"/>
            </div>
            <br/>
        </div>
    );
};

export const DEFAULT_GRID_STATE = {
    showGrid: false,
    numRows: 3,
    numCols: 7
};

export const GridControl = ({disabled, style}) => {
    const [gridState, setGridState] = useState(DEFAULT_GRID_STATE);
    return <GridControlUi
        disabled={disabled}
        style={style}
        gridState={gridState}
        setGridState={setGridState}/>;
};

export default GridControl;
