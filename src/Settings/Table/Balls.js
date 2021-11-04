import {ColorSelector} from "../../Common";
import React from "react";
import {CONTROLLER_STYLE, LABEL_STYLE, SINGLE_COMP_STYLE} from "../../styles";
import useAxios from "axios-hooks";
import _ from "lodash";
import axios from "axios";
import { createPutData, BALL_HEIGHT } from './TableCommon';


export const Ball = ({ball, setBall, style}) => {
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
        <div style={style}>
            <label style={{position: 'absolute', left: '1%', width: '15%'}}>
                Number:
            </label>
            <label style={{position: 'absolute', left: '15%', width: '5%'}}>
                {ball.number}
            </label>
            <ColorSelector
                style={{position: 'absolute', left: '20%', width: '35%', height: BALL_HEIGHT}}
                color={ball.color}
                set={color => setBall({color})}
            />
            <label style={{position: 'absolute', left: '60%', width: '10%'}}>
                Radius:
            </label>
            <input
                style={{position: 'absolute', left: '75%', width: '20%'}}
                type="number"
                min="0"
                onChange={({target: {value}}) => setBall({radius: Number(value)})}
                step="0.01"
                value={ball.radius}/>
        </div>
        </>
    );
};

const Balls = ({configUrl}) => {
    const [configData, refetch] = useAxios(configUrl);
    const putData = createPutData(_.get(configData, 'data.config', {}));
    const sendPutData = async () => {
        await axios.put(configUrl, {config: putData});
        await refetch();
    }
    return (
        <>
            <div style={{
                height: BALL_HEIGHT, display: 'grid', placeItems: 'center', left: 0, width: '100%'}}>
                Balls
            </div>
            {(putData.table.balls || []).map((ball, index) => (
                <Ball
                    style={{
                        // position: 'absolute',
                        height: BALL_HEIGHT,
                        // top: (index + 1) * BALL_HEIGHT,
                        left: 0,
                        width: '100%',
                    }}
                    key={`ball-${index}`}
                    ball={ball}
                    setBall={async b => {
                        putData.table.balls[index] = {...putData.table.balls[index], ...b};
                        await sendPutData();
                    }}
                />
            ))}
            <br/>
        </>
    );
};

export default Balls;