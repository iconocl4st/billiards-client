import React, { useState } from 'react';
import {compGridStyle} from "./styles";


const Play = () => {
    const [numRows, setNumRows] = useState(3);
    const [numCols, setNumCols] = useState(7);
    const [showGrid, setShowGrid] = useState(false);
    const [timed, setTimed] = useState(false);
    const [duration, setDuration] = useState(30);

    return (
        <>
            <div style={compGridStyle(0)}>
                <label>Show grid</label>
                <input
                    type="checkbox"
                    checked={showGrid}
                    onChange={({target: {checked}}) => setShowGrid(checked)}/>
                <br/>
                <label>Number of Rows</label>
                <input
                    disabled={!showGrid}
                    value={numRows}
                    onChange={({target: {value}}) => setNumRows(Number(value))}
                    min={1}
                    type="number"/>
                <br/>
                <label>Number of Columns</label>
                <input
                    disabled={!showGrid}
                    value={numCols}
                    onChange={({target: {value}}) => setNumCols(Number(value))}
                    min={1}
                    type="number"/>
            </div>

            <div style={compGridStyle(1)}>
                <label>Enable timer</label>
                <input
                    checked={timed}
                    onChange={({target: {checked}}) => setTimed(checked)}
                    type="checkbox"/>
                <br/>
                <label>Timer duration:</label>
                <input
                    min={1}
                    value={duration}
                    onChange={({target: {value}}) => setDuration(Number(value))}
                    disabled={!timed}
                    type="number"/>
                <label>(s)</label>
                <br/>
                <button disabled={!timed}>Go to Timer control</button>
                <br/>
                <label>Show timer on table</label>
                <input type="checkbox"/>
            </div>
            <div style={compGridStyle(2)}>
                <button>Take snapshot</button>
                <button>Reset to snapshot</button>
            </div>
        </>
    )
};

export default Play;
