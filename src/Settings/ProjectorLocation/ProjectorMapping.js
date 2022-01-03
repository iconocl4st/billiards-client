import React, {useState} from "react";
import _ from 'lodash';
import axios from 'axios';
import useAxios from "axios-hooks";
import UpdateGraphicsControl from "./UpdateGraphicsControl";
import ScreenSizeControl from "./ScreenSizeControl";
import GeometryControl from "./GeometryControl";
import getShowBoundary from "./showBoundary";


const ProjectorMapping = props => {
    const [message, setMessage] = useState('Ready');
    const projectorUrl = _.get(props, 'configState.apiUrls.projectorUrl', '');
    const [resp, refresh] = useAxios(projectorUrl + 'mapping/');
    const screenSize = _.get(resp, 'data.mapping.screen-size', {width: 1920, height: 1080});
    const map = _.get(resp, 'data.mapping', {});
    const showBoundary = getShowBoundary(projectorUrl, map, setMessage);

    console.log('data mapping', map);
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
            <UpdateGraphicsControl message={message} showBoundary={showBoundary}/>
            <ScreenSizeControl map={map} setMap={setMap} refresh={refresh} screenSize={screenSize}/>
            <GeometryControl map={map} setMap={setMap} refresh={refresh} screenSize={screenSize}/>
        </>
    );
};


export default ProjectorMapping;
