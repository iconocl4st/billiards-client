
// {position: 'absolute', left: '0%', width: '100%'}
// style={{position: 'absolute', top: SINGLE_COMP_STYLE.top, height: 'auto', width: '100%'}}
import useAxios from "axios-hooks";
import {getApiUrl} from "../../Apis";
import _ from "lodash";
import axios from "axios";
import React from "react";
import {Point} from "../../Common";
import {CONTROLLER_STYLE, CONTROLLER_STYLE_2, LABEL_STYLE, SINGLE_COMP_STYLE} from "../../styles";
import { createPutData, BALL_HEIGHT } from './TableCommon';
import {PointSetting} from "../../Common";

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

const Pockets = ({configUrl}) => {
    const [{data, loading, error}, refetch] = useAxios(configUrl);
    const putData = createPutData(_.get(data, 'config', {}));
    const sendPutData = async () => {
        await axios.put(configUrl, {config: putData});
        await refetch();
    }
    return (
        <>
            <div style={{
                height: BALL_HEIGHT, display: 'grid', placeItems: 'center', left: 0, width: '100%'}}>
                Pockets
            </div>
            <div style={CONTROLLER_STYLE}>
                <button>Show pockets</button>
            </div>
            <div style={CONTROLLER_STYLE_2}>
                <label>Ready</label>
            </div>
            <br/>
            <br/>
            {(putData.table.pockets || []).map((pocket, index) => (
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
        </>
    );
};


export default Pockets;
