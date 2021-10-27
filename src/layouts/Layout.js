import React, { useState } from 'react';
import useAxios from 'axios-hooks'
import {CONTROLLER_STYLE, LABEL_STYLE} from "../styles";
import {StringSetting} from "../Common";
import Balls from "./Balls";
import Shots from "./Shots";
import Graphics from "./Graphics";


const LayoutInfo = ({uuid, setView}) => {
    const [layoutName, setLayoutName] = useState("no name");
    return (
        <>
            <div style={LABEL_STYLE}>Id:</div>
            <div style={CONTROLLER_STYLE}>{uuid}</div>
            <br/>
            <StringSetting label="Name" value={layoutName} setValue={setLayoutName}/>
            <br/>
            <br/>
            <div style={LABEL_STYLE}>Balls</div>
            <div style={CONTROLLER_STYLE}><button onClick={() => setView('balls')}>Edit</button></div>
            <br/>
            <div style={LABEL_STYLE}>Shots</div>
            <div style={CONTROLLER_STYLE}><button onClick={() => setView('shots')}>Edit</button></div>
            <br/>
            <div style={LABEL_STYLE}>Graphics</div>
            <div style={CONTROLLER_STYLE}><button onClick={() => setView('graphics')}>Edit</button></div>
            <br/>

            <div style={LABEL_STYLE}><label>Preview:</label></div>
            <br/>
            <br/>
            <br/>
        </>
    );
};


const Layout  = props => {
    const [view, setView] = useState('info');
    const back = () => setView('info');
    return {
        'info': <LayoutInfo {...props} setView={setView}/>,
        'balls': <Balls {...props} back={back}/>,
        'shots': <Shots {...props} back={back}/>,
        'graphics': <Graphics {...props} back={back}/>,
    }[view];
};

export default Layout;