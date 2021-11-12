import {CONTROLLER_STYLE, CONTROLLER_STYLE_2, LABEL_STYLE} from "../styles";
import _ from "lodash";
import axios from "axios";
import SaveDelay from "../SaveDelay";
import React from "react";


const Graphics = ({layout, layoutsApi, back, network}) => {
    const uuid = _.get(layout, 'info.uuid', 'no uuid found');
    const existing = _.cloneDeep(_.get(layout, 'entry', {}));
    const save = async updates => {
        const resp = await axios.put(layoutsApi + 'layout/' + uuid, {updates});
        console.log("Update response", resp);
    };
    const {value: height, setValue: setHeight} = SaveDelay(
        46,
        _.get(layout, 'entry.locations.table-dimensions.height', 46),
        v => save(_.set(existing, 'locations.table-dimensions.height', v)),
        network
    );

    return (<>
        <div style={CONTROLLER_STYLE_2}><button onClick={back}>Done</button></div>
        <br/>
        <br/>
    </>);
};

export default Graphics;

