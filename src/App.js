
import {useState} from "react";
import Landing from "./Landing";

import './index.css';

const DEFAULT_CONFIG_URL = 'http://localhost:18086/';

const App = () => {
  const [configUrl, setConfigUrl] = useState(DEFAULT_CONFIG_URL);
  return (<Landing configUrl={configUrl} setConfigUrl={setConfigUrl}/>);
};


export default App;
