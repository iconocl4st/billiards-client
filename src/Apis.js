
/*
import axios from "axios";
import _ from 'lodash';



// export const getApiUrl = (apiName, config) => {
//     if (!config) {
//         return 'none';
//     }
//     for (const api of _.get(config, 'data.config.urls', [])) {
//         if (api['api-name'] === apiName) {
//             return api.url;
//         }
//     }
//     return 'none';
// };


const DEFAULT_HOST = 'localhost';
// const BASE_URL = '10.0.0.160';


const getDefaultUrl = port => 'http://' + DEFAULT_HOST + ':' + port + '/';


const createDefaultApi = (name, port) => ({
    'api-name': name,
    url: getDefaultUrl(port),
});

const CurrentState = {
    success: false,
    urls: [
        createDefaultApi('Projector', 18080),
        createDefaultApi('Shots', 18081),
        createDefaultApi('Graphics', 18082),
        createDefaultApi('Layouts', 18083),
        createDefaultApi('Images', 18084),
        createDefaultApi('Attempts', 18085),
    ],
    configApi: {
        'api-name': 'Configuration',
        url: getDefaultUrl(18086),
    },
};


const ERROR_API = {url: 'n/a', label: 'Not found'};

export const getApi = name => {
    // if (!CurrentState.success) {
    //     return ERROR_API;
    // }
    if (name === CurrentState.configApi['api-name']) {
        return CurrentState.configApi;
    }
    for (const api of CurrentState.urls) {
        if (api['api-name'] === name) {
            return {...api, label: name }
        }
    }
    return ERROR_API;
};

export const getApis = () => CurrentState.urls;

export const getUrl = name => getApi(name).url;

export const setConfigUrl = configUrl => {
    CurrentState.configApi.url = configUrl;
};

export const getConfigUrl = () => CurrentState.configApi.url;

export const updateApiUrls = async () => {
    const {data: {success, message, config}, status } = await axios.get(CurrentState.configApi.url);
    CurrentState.success = success && status === 200;
    if (CurrentState.success) {
        CurrentState.urls = config.urls;
        console.log('successfully retrieved urls', config.urls);
    } else {
        console.log("Unable to retrieve config", message);
    }
};

*/