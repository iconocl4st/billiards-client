import {CONTROLLER_STYLE, CONTROLLER_STYLE_2, LABEL_STYLE} from "../styles";
import _ from "lodash";
import React from "react";
import SaveDelay from "../SaveDelay";
import axios from "axios";
import {NumberSetting, OptionSetting, PointSetting} from "../Common";
import {update, remove, add} from '../ArrayModifiers';

const Ball = ({ball, removeBall, updateBall}) => {
    const existing = _.cloneDeep(ball);
    const type = _.get(ball, 'ball.type', 'object');
    const setType = newType => {
        let newBall = _.set(existing, 'ball.type', newType);
        if (newType === 'number') {
            newBall = _.set(newBall, 'ball.number', 0);
        }
        updateBall(newBall);
    }
    const number = _.get(ball, 'ball.number', 0);
    const setNumber = type !== 'number' ? (() => {}) : (
        newNumber => updateBall(_.set(existing, 'ball.number', newNumber)));
    const location = _.get(ball, 'location', {x: 0, y: 0});
    const setLocation = newLocation => updateBall(_.set(existing, 'location', newLocation));
    // TODO: maximum point values...
    return (
        <div style={{border: '1px solid white'}}>
            <br/>
            <OptionSetting label="Ball type" value={type} setValue={setType}>
                <option value="object">Any object ball</option>
                <option value="cue">Any cue ball</option>
                <option value="number">Specific number</option>
            </OptionSetting>
            <br/>
            {type === 'number' && (<>
                <NumberSetting label="Number" value={number} setValue={setNumber}/>
                <br/></>)}
            <PointSetting step="1" min="0" label="Location" value={location} setValue={setLocation}/>
            <br/>
            <div style={CONTROLLER_STYLE_2}>
                <button onClick={removeBall}>Remove</button>
            </div>
            <br/>
            <br/>
        </div>
    )
};

const Balls = ({layout, layoutsApi, back, network}) => {
    const uuid = _.get(layout, 'info.uuid', 'no uuid found');
    const currentBalls = _.get(layout, 'entry.locations.balls', []);
    const existing = _.cloneDeep(_.get(layout, 'entry', {}));
    const saveBalls = async newBalls => {
        const resp = await axios.put(layoutsApi + 'layout/' + uuid, {
            updates: _.set(existing, 'locations.balls', newBalls)
        });
        console.log("Update response", resp);
    };
    const {value: height, setValue: setHeight} = SaveDelay(
        46,
        _.get(layout, 'entry.locations.table-dimensions.height', 46),
        v => saveBalls(_.set(existing, 'locations.table-dimensions.height', v)),
        network
    );

    const saveBallsAndRefresh = async newBalls => {
        await saveBalls(newBalls);
        await network.refetch();
    }
    const initial = {ball: {type: "object"}, location: {x: 0, y: 0}};
    const removeBall = remove(saveBallsAndRefresh, currentBalls);
    const addBall = add(saveBallsAndRefresh, currentBalls, initial);
    const updateBall = update(saveBallsAndRefresh, currentBalls);

    return (<>
        <div style={LABEL_STYLE}>Located Balls</div>
        <div style={CONTROLLER_STYLE}><button onClick={addBall}>Add</button></div>
        <div style={CONTROLLER_STYLE_2}><button onClick={back}>Done</button></div>
        <br/>
        <br/>
        {
            currentBalls.map((ball, index) => (
                <Ball
                    key={`ball-${index}`}
                    ball={ball}
                    updateBall={updateBall(index)}
                    removeBall={removeBall(index)}/>
            ))
        }
        <br/>
        <br/>
    </>);
};

export default Balls;

