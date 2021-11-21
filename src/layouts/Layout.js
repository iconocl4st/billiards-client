import React, { useState } from 'react';
import useAxios from 'axios-hooks'
import axios from 'axios';
import {CONTROLLER_STYLE, CONTROLLER_STYLE_2, LABEL_STYLE} from "../styles";
import {FormattedDate, NumberSetting, PointSetting, StringSetting} from "../Common";
import Balls from "./Balls";
import Shots from "./Shots";
import Graphics from "./Graphics";
import {getApiUrl} from "../Apis";
import _ from 'lodash';
import SaveDelay from "../SaveDelay";
import {getLayoutGraphics} from "./getLayoutGraphics";
import GraphicsView from "../GraphicsView";


const LayoutInfo = ({layout, configUrl, layoutsApi, setView, back, network}) => {
    const uuid = _.get(layout, 'info.uuid', 'no uuid found');
    const creationTime = _.get(layout, 'info.creation-time', 0);
    const modificationTime = _.get(layout, 'info.modification-time', 0);
    const existing = _.cloneDeep(_.get(layout, 'entry', {}));
    const [statusText, logger] = useState('Ready');
    const [previewGraphics, setPreviewGraphics] = useState([]);

    const updatePreview = async () => {
        try {
            const graphics = await getLayoutGraphics({configUrl, logger, uuid});
            setPreviewGraphics(graphics);
        } catch (e) {
            console.error("Unable to preview graphics");
            console.error(e, e.stack);
        }
    }

    const save = async updates => {
        const resp = await axios.put(layoutsApi + 'layout/' + uuid, {updates});
        console.log("Update response", resp);
    };
    const {value: nameValue, setValue: setNameValue} = SaveDelay(
        'No name found',
        _.get(layout, 'entry.name', 'No name found'),
        v => save(_.set(existing, 'name', v)),
        network
    );
    const {value: width, setValue: setWidth} = SaveDelay(
        92,
        _.get(layout, 'entry.locations.table-dimensions.width', 92),
        v => save(_.set(existing, 'locations.table-dimensions.width', v)),
        network
    );
    const {value: height, setValue: setHeight} = SaveDelay(
        46,
        _.get(layout, 'entry.locations.table-dimensions.height', 46),
        v => save(_.set(existing, 'locations.table-dimensions.height', v)),
        network
    );
    return (
        <>
            <div style={LABEL_STYLE}>Id:</div>
            <div style={{...CONTROLLER_STYLE, width: '67%'}}>{uuid}</div>
            <div style={CONTROLLER_STYLE_2}><button onClick={back}>Done Editing</button></div>
            <br/>
            <div style={LABEL_STYLE}>Created</div>
            <div style={CONTROLLER_STYLE}><FormattedDate unixTime={creationTime * 1000}/></div>
            <br/>
            <div style={LABEL_STYLE}>Last modified</div>
            <div style={CONTROLLER_STYLE}><FormattedDate unixTime={modificationTime * 1000}/></div>
            <br/>
            <StringSetting label="Name" value={nameValue} setValue={setNameValue}/>
            <br/>
            <br/>
            <NumberSetting label="Width" min={0} step={1} value={width} setValue={setWidth} />
            <NumberSetting label="Height" min={0} step={1} value={height} setValue={setHeight} />
            {/*<PointSetting label="Dimension" step={1} value={dimension} setValue={setDimension} />*/}
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

            <br/>
            <div style={LABEL_STYLE}><label>Preview:</label></div>
            <div style={CONTROLLER_STYLE}><button onClick={updatePreview}>Draw</button></div>
            <div style={CONTROLLER_STYLE_2}><label>{statusText}</label></div>
            <br/>
            <br/>
            <GraphicsView graphics={previewGraphics} />
            <br/>
            <br/>
        </>
    );
};


const Layout  = ({uuid, configUrl, layoutsApi, back, remove, ...props}) => {
    const [view, setView] = useState('info');
    const [{data, loading, error}, refetch] = useAxios(layoutsApi + "layout/" + uuid);

    const layout = _.get(data, 'layout', {});
    console.log('the layout', layout);

    const subBack = () => setView('info');
    const network = {loading, error, refetch};
    return {
        'info': <LayoutInfo
            layoutsApi={layoutsApi} layout={layout} network={network}
            setView={setView} back={back} configUrl={configUrl}
        />,
        'balls': <Balls
            layoutsApi={layoutsApi} layout={layout} network={network}
            back={subBack}
        />,
        'shots': <Shots
            layoutsApi={layoutsApi} layout={layout} network={network}
            back={subBack}
        />,
        'graphics': <Graphics
            layoutsApi={layoutsApi} layout={layout} network={network}
            back={subBack}
        />,
    }[view];

};

export default Layout;