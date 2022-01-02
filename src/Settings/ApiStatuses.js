import React, {useEffect, useState} from 'react';
import axios from 'axios';
import useAxios from 'axios-hooks';
import _ from 'lodash';
import {CONTROLLER_STYLE_2, BorderedStyle} from "../styles";
import {StringSetting} from "../Common";
import SaveDelay from "../SaveDelay";
import {update} from "../ArrayModifiers";

const getConnectionStatus = ({data, loading, error}) => {
    if (error) {
        return {
            label: 'Not Available',
            background: 'red',
            uptime: 'n/a'
        }
    } else if (loading) {
        return {
            label: 'Loading',
            background: 'yellow',
            uptime: 'n/a'
        }
    } else if (!data || !('success' in data)) {
        return {
            label: 'No data',
            background: 'red',
            uptime: 'n/a'
        }
    } else {
        return {
            label: 'Connected',
            background: 'green',
            uptime: _.get(data, 'up-time', 0).toString() + ' (s)'
        }
    }
};

const getStatusStyle = ({background}) => {
    return {
        background,
        // position: 'absolute',
        // height: 50,
        // top: index * 50,
        // width: '100%',
        // border: '1px solid black',
    }
};

const ApiStatus = ({"api-name": label, url, saveUrl}) => {
    const [response, refresh] = useAxios(url + 'status/');
    const status = getConnectionStatus(response);
    const tryRefresh = async () => {
        try {
            await refresh();
        } catch (e) {
            console.log(e);
        }
    };
    const kill = async () => {
        try {
            await axios.put(url + 'status/', {shutdown: true});
            await tryRefresh();
        } catch (e) {
            console.log(e);
        }
    };
    const save = url => saveUrl({"api-name": label, url});
    useEffect(tryRefresh, [url]);
    const { value, setValue } = SaveDelay(url, url, save, {refetch: tryRefresh, ...response});
    return (
        <>
            <label style={{background: status.background}}>{label}</label>
            <input
                value={value}
                onChange={({target: {value}}) => setValue(value)}
            />
            <label>{status.label}</label>
            <label>{status.uptime}</label>
            <button onClick={refresh}>Refresh</button>
            <button onClick={kill}>Kill</button>
        </>
    );
};



const ApiStatuses = ({configState: {configUrl, setConfigUrl, config, refreshConfig}}) => {
    const [editorUrl, setEditorUrl] = useState(configUrl);
    const urls = _.get(config, 'urls', []);
    const saveUrls = async urls => {
        try {
            const updateResp = await axios.put(configUrl, {config: {urls}});
            await refreshConfig();
        } catch (e) {
            console.error(e);
        }
    };
    const saveUrl = update(saveUrls, urls);
    return (
        <>
            <div style={{
                ...BorderedStyle,
                display: 'grid',
                gridGap: 5,
                gridTemplateColumns: 'auto auto auto',
            }}>
                <StringSetting
                    label="Configuration URL"
                    value={editorUrl}
                    setValue={newUrl => setEditorUrl(newUrl)}
                />
                <div>
                    <button onClick={() => {
                        setConfigUrl(editorUrl);
                    }}>
                        Refresh Urls
                    </button>
                </div>
            </div>
            <br/>
            <div style={{
                ...BorderedStyle,
                display: 'grid',
                gridGap: 5,
                gridTemplateColumns: 'auto auto auto auto auto auto',
            }}>
                {urls.map((props, index) => (
                    <ApiStatus
                        key={`api-${index}`}
                        saveUrl={saveUrl(index)}
                        {...props}
                    />
                ))}
            </div>
        </>
    )
};

export default ApiStatuses;
