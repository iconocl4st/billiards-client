
import {useEffect, useState} from "react";
import axios from 'axios';
import _ from 'lodash';

import Landing from "./Landing";

import './index.css';

const DEFAULT_CONFIG_URL = 'http://localhost:18086/';

const fetchConfig = (configUrl, setConfig) => async () => {
  try {
    const configResp = await axios.get(configUrl);
    setConfig({
      config: _.get(configResp, 'data.config', {}),
      haveConfig: configResp.status === 200 && configResp.data.success
    });
  } catch (e) {
    console.error(e);
    setConfig({config: {}, haveConfig: false});
  }
};

const DEFAULT_URLS = [
    // "Attempts", "Graphics", "Images", "Layouts", "Projector", "Shots"
  "attemptsUrl", "graphicsUrl", "imagesUrl", "layoutsUrl", "projectorUrl", "shotsUrl"
].reduce(
    (defaults, c) => ({...defaults, [c]: 'none'}), {})

const App = () => {
  const [configUrl, setConfigUrl] = useState(DEFAULT_CONFIG_URL);
  const [config, setConfig] = useState({haveConfig: false});
  useEffect(fetchConfig(configUrl, setConfig), [configUrl, setConfig]);
  const configState = {
    ...config,
    configUrl,
    setConfigUrl,
    refreshConfig: fetchConfig(configUrl, setConfig),
    apiUrls: _.get(config, 'config.urls', []).reduce(
        (apis, {"api-name": name, url}) => ({...apis, [name.toLowerCase() + "Url"]: url}),
        DEFAULT_URLS)
  };
  console.log("Using configuration", configState);
  return (<Landing configState={configState}/>);
};


export default App;
