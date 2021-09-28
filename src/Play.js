import React, {useState} from 'react';
import GridControl from "./GridControl";
import {CONTENT_STYLE, LABEL_STYLE, CONTROLLER_STYLE, CONTROLLER_STYLE_2} from "./styles";

const SnapshotsControl = ({style}) => {
    return (
        <div style={style}>
            <button>Take snapshot</button>
            <button>Reset to snapshot</button>
        </div>
    );
};

const TimerControl = ({style}) => {
    const [timed, setTimed] = useState(false);
    const [duration, setDuration] = useState(30);

    return (
        <div style={style}>
            <div style={LABEL_STYLE}>
                <label>Enable timer</label>
            </div>
            <div style={CONTROLLER_STYLE}>
                <input
                    checked={timed}
                    onChange={({target: {checked}}) => setTimed(checked)}
                    type="checkbox"/>
            </div>
            <br/>
            <div style={LABEL_STYLE}>
                <label>Timer duration (s):</label>
            </div>
            <div style={CONTROLLER_STYLE}>
                <input
                    min={1}
                    value={duration}
                    onChange={({target: {value}}) => setDuration(Number(value))}
                    disabled={!timed}
                    type="number"/>
            </div>
            <br/>
            <div style={LABEL_STYLE}>
                <label>Show timer on table</label>
            </div>
            <div style={CONTROLLER_STYLE}>
                <input
                    disabled={!timed}
                    type="checkbox"/>
            </div>
            <br/>

            <button disabled={!timed}>Start</button>
            <button disabled={!timed}>Pause</button>
            <button disabled={!timed}>Reset</button>
        </div>
    );
}

const PLAY_STYLE = {
    ...CONTENT_STYLE,
    left: 0,
    position: 'absolute',
    width: '100%',
    border: '1px solid white'
};
const h1 = 75;
const h2 = 105;
const h3 = 50;
const buff = 5;
const Play = () => {
    return (
        <>
            <GridControl style={{...PLAY_STYLE, top: 0, height: h1}}/>
            <TimerControl style={{...PLAY_STYLE, top: h1 + buff, height: h2}}/>
            <SnapshotsControl style={{...PLAY_STYLE, top: (h1 + h2 + 2 * buff), height: h3}}/>
        </>
    )
};

export default Play;
