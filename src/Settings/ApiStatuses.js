import React, {useEffect, useState} from 'react';
import axios from 'axios';
import useAxios from 'axios-hooks';
import _ from 'lodash';
import {CONTROLLER_STYLE_2, LABEL_STYLE, SINGLE_COMP_STYLE} from "../styles";
import {getUrl} from "../Apis";
import {StringSetting} from "../Common";
import SaveDelay from "../SaveDelay";

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
        height: 50,
        // top: index * 50,
        width: '100%',
        border: '1px solid black',
    }
};

const ApiStatus = ({"api-name": label, url, saveUrl}) => {
    const [response, refetch] = useAxios(url + 'status/');
    const status = getConnectionStatus(response);
    const refresh = async () => {
        try {
            await refetch();
        } catch (e) {
            console.log(e);
        }
    };
    const kill = async () => {
        try {
            await axios.put(url + 'status/', {shutdown: true});
        } catch (e) {
            console.log(e);
        }
        await refresh();
    };
    useEffect(refresh, [url]);
    const { value, setValue } = SaveDelay(url, url, saveUrl, {refetch: refresh, ...response});
    return (
        <>
            <div style={getStatusStyle(status)}>
                <label style={{position: 'absolute', left: '0%', width: '18%'}}>{label}</label>
                <input
                    value={value}
                    onChange={({target: {value}}) => setValue(value)}
                    style={{position: 'absolute', left: '18%', width: '20%'}}/>
                <label style={{position: 'absolute', left: '40%', width: '20%'}}>{status.label}</label>
                <label style={{position: 'absolute', left: '60%', width: '20%'}}>{status.uptime}</label>
                <div style={{position: 'absolute', left: '80%', width: '20%'}}>
                    <button onClick={refresh}>Refresh</button>
                    <button onClick={kill}>Kill</button>
                </div>
            </div>
            <br/>
        </>
    );
};



const ApiStatuses = ({configUrl, setConfigUrl}) => {
    const [editorUrl, setEditorUrl] = useState(configUrl);
    const [networkData, setNetworkData] = useState({data: {}, success: false});

    useEffect(async () => {
        try {
            setNetworkData({success: false});
            const {data, status} = await axios.get(configUrl);
            setNetworkData({data, success: status === 200});
        } catch (e) {
            console.log('unable to get config');
        }
    }, [configUrl]);

    const urls = _.get(networkData, 'data.config.urls', []);
    const updateUrl = async (replaceIndex, newUrl) => {
        try {
            if (networkData.loading || networkData.error) {
                return;
            }

            await axios.put(configUrl, {
                config: {
                    urls: urls.map((api, index) => ({
                        "api-name": api["api-name"],
                        url: index === replaceIndex ? newUrl : api.url
                    }))
                }
            });

            const {data, status} = await axios.get(configUrl);
            setNetworkData({data, success: status === 200});
        } catch (e) {
            console.log('unable to update url');
        }
    };

    return (
        <>
            <StringSetting
                label="Configuration URL"
                value={editorUrl}
                setValue={newUrl => setEditorUrl(newUrl)}
            />
            <br/>
            <div style={CONTROLLER_STYLE_2}>
                <button onClick={async() => {
                    setConfigUrl(editorUrl);
                    setConfigUrl(editorUrl);
                }}>
                    Refresh Urls
                </button>
            </div>
            <br/>
            <br/>
            {
                urls.map((props, index) => (
                    <ApiStatus
                        key={`api-${index}`}
                        saveUrl={newUrl => updateUrl(index, newUrl)}
                        {...props}
                    />
                ))
            }
        </>
    )
};

export default ApiStatuses;
