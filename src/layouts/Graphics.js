import {LABEL_STYLE} from "../styles";


const Graphics = ({uuid, back}) => {
    return (<>
        <div style={LABEL_STYLE}><button onClick={() => back()}>Back</button></div>
        <br/>
        <br/>
    </>);
};

export default Graphics;

