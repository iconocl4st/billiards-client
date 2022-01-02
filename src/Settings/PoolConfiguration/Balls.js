import {ColorSelector} from "../../Common";
import React from "react";
import {BorderedStyle, CONTROLLER_STYLE, LABEL_STYLE, SINGLE_COMP_STYLE} from "../../styles";
import useAxios from "axios-hooks";
import _ from "lodash";
import axios from "axios";
import { createPutData, BALL_HEIGHT } from './TableCommon';


export const Ball = ({ball, setBall, style}) => {
    console.log('ball', ball);
    return (
        <>
            {/*<div style={LABEL_STYLE}>Number: {ball.number}</div>*/}
            {/*<div >Number: {ball.number}</div>*/}
            {/*<ColorSelector*/}
            {/*    style={CONTROLLER_STYLE}*/}
            {/*    // style={{position: 'absolute', left: '20%', width: '35%', height: BALL_HEIGHT}}*/}
            {/*    color={ball.color}*/}
            {/*    set={color => setBall({color})}*/}
            {/*/>*/}

            {/*<br/>*/}
            <label>{ball.number}</label>
            <ColorSelector color={ball.color} setColor={color => setBall({color})}/>
            <input
                type="number"
                min="0"
                onChange={({target: {value}}) => setBall({radius: Number(value)})}
                step="0.01"
                value={ball.radius}/>
        </>
    );
};

const Balls = ({configState: {config, configUrl, apiUrls, refreshConfig}}) => {
    // TODO: shouldn't need to copy it...
    console.log('config', config);
    const putData = createPutData(config);
    const sendPutData = async () => {
        await axios.put(configUrl, {config: putData});
        await refreshConfig();
    }
    return (
        <div style={{
            ...BorderedStyle,
            display: 'grid',
            gridGap: '5px',
            gridTemplateColumns: '10% auto auto',
            // placeItems: 'center'
        }}
        >
            <label>Number</label>
            <label>Color</label>
            <label>Radius</label>
            {(putData['pool-config'].balls || []).map((ball, index) => (
                <Ball
                    key={`ball-${index}`}
                    ball={ball}
                    setBall={async b => {
                        putData.table.balls[index] = {...putData.table.balls[index], ...b};
                        await sendPutData();
                    }}
                />
            ))}
        </div>
    );
};

export default Balls;