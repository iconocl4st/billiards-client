import React, {useState} from 'react';
import {CONTROLLER_STYLE, CONTROLLER_STYLE_2, LABEL_STYLE} from "./styles";
import {DEFAULT_GRID_STATE, GridControlUi} from "./GridControl";
import {BoolSetting, MaybeNumber, NumberSetting, OptionSetting} from "./Common";
import {generateShot} from "./generate_shot";


const RandomShots = () => {
    const [gridState, setGridState] = useState(DEFAULT_GRID_STATE);
    const [distribution, setDistribution] = useState('uniform');
    const [cueOnRail, setCueOnRail] = useState(false);
    const [objOnRail, setObjOnRail] = useState(false);
    const [useSeed, setUseSeed] = useState(false);
    const [seed, setSeed] = useState(1776);
    const [minCut, setMinCut] = useState(0.02);
    const [destination, setDestination] = useState(false);
    const [destinationRadius, setDestinationRadius] = useState(3);
    const [destinationSpin, setDestinationSpin] = useState(0);
    const [destinationSpeed, setDestinationSpeed] = useState(1);
    const [statusMessage, setStatusMessage] = useState('no message');
    const [shotStepsType, setShotStepsType] = useState('strike');
    const generate = () => generateShot(
        { distribution, minCut, destination, destinationRadius, destinationSpin,
        gridState, useSeed, seed, cueOnRail, objOnRail, shotStepsType},
        message => {
            console.log('message', message);
            setStatusMessage(message);
        }
    );
    return (
        <>
            <br/>
            <MaybeNumber
                label="Seed"
                use={useSeed}
                setUse={setUseSeed}
                value={seed}
                setValue={setSeed}
                min={0}
            />
            <OptionSetting
                label="Shot steps"
                value={shotStepsType}
                setValue={setShotStepsType}
            >
                <option value="strike">Strike</option>
                <option value="bank">Bank</option>
                <option value="kick">Kick</option>
                <option value="combo">Combo</option>
                <option value="kiss">Kiss</option>
            </OptionSetting>
            <OptionSetting
                label="Distribution"
                value={distribution}
                setValue={setDistribution}
            >
                <option value="uniform">Uniform</option>
                <option value="spot">Spot shot</option>
            </OptionSetting>
            <GridControlUi
                style={{}}
                disabled={distribution !== 'spot'}
                gridState={gridState}
                setGridState={setGridState}
            />
            <BoolSetting
                label="Allow cue ball on rail"
                value={cueOnRail}
                setValue={setCueOnRail}
                disabled={distribution !== 'spot'}
            />
            <BoolSetting
                label="Allow object ball on rail"
                value={objOnRail}
                setValue={setObjOnRail}
                disabled={distribution !== 'spot'}
            />
            <NumberSetting
                label="Cut Threshold"
                value={minCut}
                onChange={setMinCut}
                min={0}
                step={0.01}
                max={1}
            />
            <BoolSetting
                label="Generate Destination"
                value={destination}
                setValue={setDestination}
            />
            <NumberSetting
                label="Destination Radius"
                value={destinationRadius}
                setValue={setDestinationRadius}
                min={0}
                set={0.5}
                disabled={!destination}
            />
            <NumberSetting
                label="Destination Max Spin"
                value={destinationSpin}
                setValue={setDestinationSpin}
                step={0.1}
                disabled={!destination}
            />
            <NumberSetting
                label="Destination Max Speed"
                value={destinationSpeed}
                setValue={setDestinationSpeed}
                min={0}
                step={0.1}
                disabled={!destination}
            />
            <div style={LABEL_STYLE}>
                <label>Status:</label>
            </div>
            <div style={CONTROLLER_STYLE}>
                <label>{statusMessage}</label>
            </div>
            <div style={CONTROLLER_STYLE_2}>
                <button onClick={generate}>Generate!</button>
            </div>
            <br/>
            <br/>
        </>
    )
};

export default RandomShots;
