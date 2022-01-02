import React, {useState} from 'react';
import {BorderedStyle} from "./styles";
import {DEFAULT_GRID_STATE, GridControlUi} from "./GridControl";
import {BoolSetting, MaybeNumber, NumberSetting, OptionSetting} from "./Common";
import {generateShot} from "./generate_shot";
import GraphicsView from "./GraphicsView";


const RandomShots = ({configState}) => {
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
    const [drawLines, setDrawLines] = useState(true);

    const [graphics, setGraphics] = useState([]);

    const generate = () => generateShot(
        { distribution, minCut, destination, destinationRadius, destinationSpin,
        gridState, useSeed, seed, cueOnRail, objOnRail, shotStepsType, drawLines},
        setStatusMessage,
        setGraphics,
        configState
    );
    return (
        <div style={{
            ...BorderedStyle,
            display: 'grid',
            gridTemplateColumns: '33% 33% 33%',
        }}>
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
            </OptionSetting><div/>
            <OptionSetting
                label="Distribution"
                value={distribution}
                setValue={setDistribution}
            >
                <option value="uniform">Uniform</option>
                <option value="spot">Spot shot</option>
            </OptionSetting><div/>
            <GridControlUi
                width={3}
                disabled={distribution !== 'spot'}
                gridState={gridState}
                setGridState={setGridState}
            />
            <BoolSetting
                label="Allow cue ball on rail"
                value={cueOnRail}
                setValue={setCueOnRail}
                disabled={distribution !== 'spot'}
            /><div/>
            <BoolSetting
                label="Allow object ball on rail"
                value={objOnRail}
                setValue={setObjOnRail}
                disabled={distribution !== 'spot'}
            /><div/>
            <NumberSetting
                label="Cut Threshold"
                value={minCut}
                onChange={setMinCut}
                min={0}
                step={0.01}
                max={1}
            /><div/>
            <BoolSetting
                label="Generate Destination"
                value={destination}
                setValue={setDestination}
            /><div/>
            <NumberSetting
                label="Destination Radius"
                value={destinationRadius}
                setValue={setDestinationRadius}
                min={0}
                set={0.5}
                disabled={!destination}
            /><div/>
            <NumberSetting
                label="Destination Max Spin"
                value={destinationSpin}
                setValue={setDestinationSpin}
                step={0.1}
                disabled={!destination}
            /><div/>
            <NumberSetting
                label="Destination Max Speed"
                value={destinationSpeed}
                setValue={setDestinationSpeed}
                min={0}
                step={0.1}
                disabled={!destination}
            /><div/>
            <BoolSetting
                label="Draw shot lines"
                value={!!drawLines}
                setValue={setDrawLines}
            /><div/>
            <label>Status:</label>
            <label>{statusMessage}</label>
            <div>
                <button onClick={generate}>Generate!</button>
            </div>
            <GraphicsView graphics={graphics}/>
        </div>
    )
};

export default RandomShots;
