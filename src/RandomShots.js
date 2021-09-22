import React, { useState } from 'react';

const RandomShots = () => {
    const [distribution, setDistribution] = useState('uniform');
    const [numRows, setNumRows] = useState(3);
    const [numCols, setNumCols] = useState(7);
    const [showGrid, setShowGrid] = useState(true);
    const [cueOnRail, setCueOnRail] = useState(false);
    const [objOnRail, setObjOnRail] = useState(false);
    const [useSeed, setUseSeed] = useState(false);
    const [seed, setSeed] = useState(1776);
    const [minCut, setMinCut] = useState(0.02);
    const [controlCue, setControlCue] = useState(false);

    const generate = () => {

    };
    return (
        <>
            <div>
                <label>Distribution</label>
                <select value={distribution} onChange={({target: {value}}) => setDistribution(value)}>
                    <option value="uniform">Uniform</option>
                    <option value="spot">Spot shot</option>
                </select>
            </div>
            <br/>
            <div>
                <label>Allow cue ball on rail</label>
                <input
                    disabled={distribution !== 'spot'}
                    type="checkbox"
                    checked={cueOnRail}
                    onChange={({target: {checked}}) => setCueOnRail(checked)}/>
                <br/>
                <label>Allow object ball on rail</label>
                <input
                    disabled={distribution !== 'spot'}
                    type="checkbox"
                    checked={objOnRail}
                    onChange={({target: {checked}}) => setObjOnRail(checked)}/>
            </div>
            <br/>
            <div>
                <label>Number of Rows</label>
                <input
                    disabled={distribution !== 'spot'}
                    value={numRows}
                    onChange={({target: {value}}) => setNumRows(Number(value))}
                    min={1}
                    type="number"/>
                <br/>
                <label>Number of Columns</label>
                <input
                    disabled={distribution !== 'spot'}
                    value={numCols}
                    onChange={({target: {value}}) => setNumCols(Number(value))}
                    min={1}
                    type="number"/>
                <br/>
                <label>Show grid</label>
                <input
                    disabled={distribution !== 'spot'}
                    type="checkbox"
                    checked={showGrid}
                    onChange={({target: {checked}}) => setShowGrid(checked)}/>
            </div>
            <br/>
            <div>
                <label>Seed</label>
                <input
                    type="checkbox"
                    checked={useSeed}
                    onChange={({target: {checked}}) => setUseSeed(checked)}/>
                <input
                    disabled={useSeed === false}
                    value={seed}
                    onChange={({target: {value}}) => setSeed(value)}
                    min={0}
                    type="number"/>
            </div>
            <br/>
            <div>
                <label>Cut Threshold</label>
                <input
                    value={minCut}
                    onChange={({target: {value}}) => setMinCut(Number(value))}
                    min={0}
                    step={0.01}
                    max={1}
                    type="number"/>
            </div>
            <br/>
            <div>
                <label>Generate Destination</label>
                <input
                    type="checkbox"
                    checked={controlCue}
                    onChange={({target: {checked}}) => setControlCue(checked)}/>
            </div>
            <br/>
            <button onClick={generate}>Generate</button>
        </>
    )
};

export default RandomShots;
