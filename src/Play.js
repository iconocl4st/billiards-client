import React, {useState} from 'react';
import GridControl from "./GridControl";
import {Colors, BorderedStyle} from "./styles";

const SnapshotsControl = () => {
    return (
        <div style={{
            ...BorderedStyle,
            display: 'grid',
            gridTemplateColumns: '25% 25%',
        }}>
            <button>Take snapshot</button>
            <button>Reset to snapshot</button>
        </div>
    );
};

const TimerControl = () => {
    const [timed, setTimed] = useState(false);
    const [duration, setDuration] = useState(30);

    return (
        <div style={{
            ...BorderedStyle,
            display: 'grid',
            gridGap: '2px',
            gridTemplateColumns: '25% auto',
        }}>
            <label>Enable timer:</label>
            <div >
                <input
                    checked={timed}
                    onChange={({target: {checked}}) => setTimed(checked)}
                    type="checkbox"/>
            </div>
            <label>Timer duration (s):</label>
            <div>
                <input
                    min={1}
                    value={duration}
                    onChange={({target: {value}}) => setDuration(Number(value))}
                    disabled={!timed}
                    type="number"/>
            </div>
            <label>Show timer on table:</label>
            <div>
                <input disabled={!timed} type="checkbox"/>
            </div>
            <div style={{
                gridColumnStart: 1,
                gridColumnEnd: 3,
                display: 'grid',
                gridTemplateColumns: '33% 33% 33%',
            }}>
                <button disabled={!timed}>Start</button>
                <button disabled={!timed}>Pause</button>
                <button disabled={!timed}>Reset</button>
            </div>
        </div>
    );
}

const PLAY_STYLE = {
    display: 'grid',
};

const playItem = gridArea => ({
    gridArea,
    background: Colors.navItems
})


const Play = () => {
    return (
        <div style={{
            // background: Colors.contentItems,
            display: 'grid',
            gridRowGap: 10
        }}>
            <GridControl style={{gridArea: ' 0 0 1 1'}}/>
            <TimerControl style={{gridArea: '1 0 2 1'}}/>
            <SnapshotsControl style={{gridArea: '2 0 3 1'}}/>
        </div>
    )
};

export default Play;
