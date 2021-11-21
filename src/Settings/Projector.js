import React, {useState} from 'react';
import useAxios from 'axios-hooks';
import axios from 'axios';
import _ from 'lodash';
import {PointSetting} from '../Common';
import {CONTROLLER_STYLE, CONTROLLER_STYLE_2} from "../styles";
import {getApiUrl} from "../Apis";
import {createParams} from "../generate_shot";


const showBoundary = async (configData, listener) => {
    const locationResp = await axios.get(getApiUrl("Projector", configData) + 'location/');
    if (locationResp.status !== 200 || !locationResp.data.success) {
        listener('Unable to retrieve current projector location');
    }
    const location = _.get(locationResp, 'data.location');
    console.log('location', location);
    listener(locationResp.data.message);

    const {data: {message: gmessage, graphics, success: gsuccess}, status: gstatus} = await axios.post(
        getApiUrl("Graphics", configData) + 'table-location/', {
            params: {location},
        });
    if (!gsuccess || gstatus !== 200) {
        console.log('Unable to retrieve graphics');
        return;
    }
    console.log('graphics', graphics);
    listener(gmessage);

    const {data: {message: pmessage, success: psuccess}, status: pstatus} = await axios.put(
        getApiUrl("Projector", configData) + 'graphics/', {graphics}
    );
    if (!psuccess || pstatus !== 200) {
        console.log('Unable to post graphics');
        return;
    }
    console.log('projection response', pmessage);
    listener(pmessage);
};

const getLocation = data => ({
    offset: _.get(data, 'location.offset', {x: -1, y: -1}),
    up: _.get(data, 'location.up', {x: -1, y: -1}),
    right: _.get(data, 'location.right', {x: -1, y: -1})
});

const Projector = ({configUrl}) => {
    const [configData] = useAxios(configUrl);
    const [{data, loading, error}, refetch] = useAxios(
        getApiUrl("Projector", configData) + 'location/'
    );
    const [message, setMessage] = useState('Ready');
    const {offset, up, right} = getLocation(data);
    const execPut = async d => {
        await axios.put(
            getApiUrl("Projector", configData) + 'location/',
            { location: { offset, up, right, ...d } }
        );
        await refetch();
    };

    return (
        <>
            <PointSetting label="Offset" step="1" value={offset} setValue={offset=>execPut({offset})}/>
            <PointSetting label="Up" step="1" value={up} setValue={up=>execPut({up})}/>
            <PointSetting label="Right" step="1" value={right} setValue={right=>execPut({right})}/>

            <br/>
            <div style={CONTROLLER_STYLE}>
                <button onClick={() => showBoundary(configData, setMessage)}>Show Boundary</button>
            </div>
            <div style={CONTROLLER_STYLE_2}>
                <label>{message}</label>
            </div>
            <br/>
            <br/>
        </>
    )
};

export default Projector;
