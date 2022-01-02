import React, {useState} from 'react';
import useAxios from 'axios-hooks';
import axios from 'axios';
import _ from 'lodash';
import {NumberSetting} from '../../Common';
import {BorderedStyle} from "../../styles";
import SaveDelay from "../../SaveDelay";


const updateMapping = async (props, dimensions, geometry) => {
    // const dimensions = _.get(props, 'configState.config.pool-config.dimensions', {});
    // const geometry = _.get(props, 'configState.config.pool-config.geometry', {});
    const projectorUrl = _.get(props, 'configState.apiUrls.projectorUrl');
    await axios.put(projectorUrl + 'location/', { dimensions, geometry });
};

const TableDimensions = props => {
    const configUrl = _.get(props, 'configState.configUrl', '');
    const dimensions = _.get(props, 'configState.config.pool-config.dimensions', {});
    const geometry = _.get(props, 'configState.config.pool-config.geometry', {});
    const refresh = _.get(props, 'configState.refreshConfig', async () => {});
    const saveConfig = async config => {
        console.log('updated config', config);
        await axios.put(configUrl, {config});
        await updateMapping(props, dimensions, geometry);
        await refresh();
    };
    const oldConfig = _.get(props, 'configState.config', {});
    const newConfig = _.cloneDeep(oldConfig);
    const updateProp = prop => v => saveConfig(_.set(newConfig, 'pool-config.dimensions.' + prop, v));
    const {value: width, setValue: setWidth} = SaveDelay(dimensions.width, updateProp('width'), refresh);
    const {value: height, setValue: setHeight} = SaveDelay(dimensions.height, updateProp('height'), refresh);
    const {value: pocketWidth, setValue: setPocketWidth} = SaveDelay(dimensions['pocket-width'], updateProp('pocket-width'), refresh);
    return (
        <div style={{
            ...BorderedStyle,
            display: 'grid',
            gridGap: 5,
            gridTemplateColumns: '50% 50%',
        }}>
            <NumberSetting label="Width" value={width} setValue={setWidth}/>
            <NumberSetting label="Height" value={height} setValue={setHeight}/>
            <NumberSetting label="Pocket width" value={pocketWidth} setValue={setPocketWidth}/>
        </div>
    )
};

export default TableDimensions;
