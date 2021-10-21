import React, {useState} from 'react';
import useAxios from 'axios-hooks';
import axios from 'axios';
import _ from 'lodash';
import {PointSetting} from '../Common';
import {CONTROLLER_STYLE, CONTROLLER_STYLE_2} from "../styles";
import {URLS} from "../Apis";
import {createParams} from "../generate_shot";


const showBoundary = async (listener) => {
    const {data: {message: cmessage, config, success: csuccess}, status: cstatus} = await axios.get(
        URLS.config);
    if (!csuccess || cstatus !== 200) {
        listener('Unable to retrieve config');
        return;
    }
    const {table} = config;
    console.log('config', table);
    listener(cmessage);

    const {data: {message: gmessage, graphics, success: gsuccess}, status: gstatus} = await axios.post(
        URLS.graphics + 'table-boundary/', {
            params: {table},
        });
    if (!gsuccess || gstatus !== 200) {
        console.log('Unable to retrieve graphics');
        return;
    }
    console.log('graphics', graphics);
    listener(gmessage);

    const {data: {message: pmessage, success: psuccess}, status: pstatus} = await axios.put(
        URLS.projector + 'graphics/', {graphics}
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

const Projector = () => {
    const [{data, loading, error}, refetch] = useAxios(
        URLS.projector + 'location/'
    );
    const [message, setMessage] = useState('Ready');
    const {offset, up, right} = getLocation(data);
    const execPut = async d => {
        await axios.put(
            URLS.projector + 'location/',
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
                <button onClick={() => showBoundary(setMessage)}>Show Boundary</button>
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
