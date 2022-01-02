import {BorderedStyle, CompStyle, CONTROLLER_STYLE, CONTROLLER_STYLE_2} from "../styles";
import React, {useState} from "react";
import GraphicsView from "../GraphicsView";
import _ from 'lodash';
import GraduatedPointMover from "./GraduatedPointMover";
import axios from 'axios';
import useAxios from "axios-hooks";
import {NumberSetting} from "../Common";
import SaveDelay from "../SaveDelay";


const showBoundary = async ({projectorUrl, graphicsUrl}, location, listener) => {
    const {data: {message: gmessage, graphics, success: gsuccess}, status: gstatus} = await axios.post(
        graphicsUrl + 'table-location/', {
            params: {location},
        });
    if (!gsuccess || gstatus !== 200) {
        console.log('Unable to retrieve graphics');
        return;
    }
    listener(gmessage);

    const {data: {message: pmessage, success: psuccess}, status: pstatus} = await axios.put(
        projectorUrl + 'graphics/', {graphics}
    );
    if (!psuccess || pstatus !== 200) {
        console.log('Unable to post graphics');
        return;
    }
    listener(pmessage);
};



const IndexControl = ({curIndex, setCurIndex, max}) => {
    const left = () => setCurIndex(Math.max(0, curIndex - 1));
    const canGoLeft = curIndex > 0;
    const right = () => setCurIndex(Math.min(max, curIndex + 1));
    const canGoRight = curIndex < max;

    return <div style={{
        ...CompStyle,
        display: 'grid',
        gridTemplateColumns: '33% 33% 33%',
    }}>
        <button disabled={!canGoLeft} onClick={left}>Previous</button>
        <label style={{textAlign: 'center'}}>Current: {curIndex}</label>
        <button disabled={!canGoRight} onClick={right}>Next</button>
    </div>
};

const SelectionView = ({curIndex, points, screenSize: table}) => {
    const indexColor = index => index === curIndex ? {r: 128, g: 128, b: 0, a: 255} : {r: 255, g: 255, b: 255, a: 255};
    const createCircle = ([x, y], index) => ({
        type: 'circle',
        r: 10,
        fill: true,
        center: {x, y},
        color: indexColor(index),
    });
    // Dimensions are TODO
    return <GraphicsView graphics={points.map(createCircle)} dims={{table}}/>
}

const ScreenSizeControl = ({map, setMap, screenSize: {width, height}, refresh}) => {
    const setWidth = async width => {
        const newMapInfo = _.cloneDeep(map);
        _.set(newMapInfo, 'screen-size.width', width);
        await setMap(newMapInfo);
    };
    const setHeight = async height => {
        const newMapInfo = _.cloneDeep(map);
        _.set(newMapInfo, 'screen-size.height', height);
        await setMap(newMapInfo);
    };
    const {value: w, setValue: setW} = SaveDelay(width, setWidth, refresh);
    const {value: h, setValue: setH} = SaveDelay(height, setHeight, refresh);
    return (
        <div style={{
            ...BorderedStyle,
            display: 'grid',
            gridTemplateColumns: 'auto auto',
        }}>
            <NumberSetting label="Projector resolution X" value={w} setValue={setW}/>
            <NumberSetting label="Projector resolution Y" value={h} setValue={setH}/>
        </div>
    )
};

const UpdateGraphicsControl = ({message, setMessage}) => {
    return <div style={{
        ...BorderedStyle,
        display: 'grid',
        gridTemplateColumns: 'auto auto',
    }}>
        <div style={{horizontalAlign: 'center'}}>
            <button
                onClick={() => {
                    setMessage("Re-implement me");
                    // showBoundary(apiUrls, location, setMessage)
                }}
            >
                Show Boundary
            </button>
        </div>
        <label>{message}</label>
    </div>;
};

const GeometryControl = ({map, setMap, refresh, screenSize}) => {
    const [curIndex, setCurIndex] = useState(0);
    const newMapInfo = _.cloneDeep(map);
    const points = _.get(map, 'screen.points', []);
    const point = {
        x: _.get(map, `screen.points[${curIndex}][0]`, 0),
        y: _.get(map, `screen.points[${curIndex}][1]`, 0),
    };
    const setPoint = async ({x, y}) => {
        _.set(newMapInfo, `screen.points[${curIndex}][0]`, x);
        _.set(newMapInfo, `screen.points[${curIndex}][1]`, y);
        await setMap(newMapInfo);
    };
    return <div style={{
        ...BorderedStyle,
        display: 'grid',
        gridTemplateColumns: '100%',
    }}>
        <IndexControl curIndex={curIndex} setCurIndex={setCurIndex} max={points.length}/>
        <div style={{
            ...CompStyle,
            display: 'grid',
            gridTemplateColumns: 'auto auto',
        }}>
            <GraduatedPointMover point={point} setPoint={setPoint} refresh={refresh}/>
            <SelectionView curIndex={curIndex} points={points} screenSize={screenSize}/>
        </div>
    </div>;
}

const ProjectorMapping = props => {
    const [message, setMessage] = useState('Ready');
    const projectorUrl = _.get(props, 'configState.apiUrls.projectorUrl', '');
    const [resp, refresh] = useAxios(projectorUrl + 'mapping/');
    const screenSize = _.get(resp, 'data.mapping.screen-size', {width: 1920, height: 1080});
    const map = _.get(resp, 'data.mapping', {});
    const setMap = async mapping => {
        try {
            const result = await axios.put(projectorUrl + 'mapping/', {mapping});
            if (result.status !== 200) {
                setMessage('Error sending update request.');
                return;
            }
            if (!result.data.success) {
                setMessage('Error updating the mapping: ' + result.data.message);
                return;
            }
            setMessage('Updated the mapping');
        } catch (e) {
            console.error(e);
        }
    };
    return (
        <>
            <UpdateGraphicsControl message={message} setMessage={setMessage}/>
            <ScreenSizeControl map={map} setMap={setMap} refresh={refresh} screenSize={screenSize}/>
            <GeometryControl map={map} setMap={setMap} refresh={refresh} screenSize={screenSize}/>
        </>
    );
};


export default ProjectorMapping;
