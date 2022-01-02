import axios from "axios";
import React, {useState} from "react";
import {BorderedStyle, CONTROLLER_STYLE, CONTROLLER_STYLE_2, LABEL_STYLE} from "../../styles";
import { createPutData, BALL_HEIGHT } from './TableCommon';
import {PointSetting} from "../../Common";


const showPockets = (table, {graphicsUrl, projectorUrl}, listener) => async () => {
    const {data: {message, success, graphics}, status} = await axios.post(
        graphicsUrl + "pockets/", {params: {table}});
    if (status !== 200 || !success) {
        listener("Unable to retrieve graphics");
        return;
    }
    listener(message);
    const graphicsResp = await axios.put(projectorUrl + "graphics/", {graphics});
    if (graphicsResp.status !== 200 || !graphicsResp.data.success) {
        listener("Unable to push graphics")
        return;
    }
    listener(graphicsResp.data.message);
};

const PocketNames = [
    "Right lower",
    "Middle lower",
    "Left lower",
    "Left upper",
    "Middle upper",
    "Right upper",
];

const getPocketName = idx => {
    if (idx < 0 || idx > PocketNames.length) {
        return "Unknown pocket";
    }
    return PocketNames[idx];
};

const pointSetter = (setPocket, pocket, key) => p => setPocket({...pocket, [key]: {...pocket[key], ...p}});

const Pocket = ({pocket, setPocket, number}) => (
    <div style={{border: '1px solid black'}}>
        <label style={LABEL_STYLE}>Pocket: {number.toString()}</label>
        <label style={CONTROLLER_STYLE}>({getPocketName(number)})</label>
        <br/>
        <PointSetting
            label="Inner Segment 1"
            value={pocket['inner-segment-1']}
            setValue={pointSetter(setPocket, pocket, 'inner-segment-1')}/>
        <PointSetting
            label="Outer Segment 1"
            value={pocket['outer-segment-1']}
            setValue={pointSetter(setPocket, pocket, 'outer-segment-1')}/>
        <PointSetting
            label="Outer Segment 2"
            value={pocket['outer-segment-2']}
            setValue={pointSetter(setPocket, pocket, 'outer-segment-2')}/>
        <br/>
    </div>
);

const Pockets = ({configState: {config, configUrl, apiUrls, refreshConfig}}) => {
    // TODO: should not need to copy it...
    const putData = createPutData(config || {});
    const [statusMsg, setStatusMsg] = useState('Ready');
    const sendPutData = async () => {
        await axios.put(configUrl, {config: putData});
        await refreshConfig();
    }
    return (
        <div style={{...BorderedStyle}}>
            <div style={{
                height: BALL_HEIGHT, display: 'grid', placeItems: 'center', left: 0, width: '100%'}}>
                Pockets
            </div>
            <div style={CONTROLLER_STYLE}>
                <button onClick={showPockets(config.table, apiUrls, setStatusMsg)}>Show pockets</button>
            </div>
            <div style={CONTROLLER_STYLE_2}>
                <label>{statusMsg}</label>
            </div>
            <br/>
            <br/>
            {(putData['pool-config'].pockets || []).map((pocket, index) => (
                <Pocket
                    key={`pocket-${index}`}
                    number={index}
                    pocket={pocket}
                    setPocket={async p => {
                        putData.table.pockets[index] = {...putData.table.pockets[index], ...p};
                        await sendPutData();
                    }}
                />
            ))}
            <br/>
        </div>
    );
};


export default Pockets;
