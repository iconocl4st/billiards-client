import {CONTROLLER_STYLE, CONTROLLER_STYLE_2, LABEL_STYLE} from "../styles";
import _ from "lodash";
import React from "react";
import SaveDelay from "../SaveDelay";
import axios from "axios";
import {MaybeNumber, NumberSetting, OptionSetting, PointSetting} from "../Common";

const Ball = ({ball, remove, update}) => {
    const existing = _.cloneDeep(ball);
    const type = _.get(ball, 'ball.type', 'object');
    const setType = newType => {
        let newBall = _.set(existing, 'ball.type', newType);
        if (newType === 'number') {
            newBall = _.set(newBall, 'ball.number', 0);
        }
        update(newBall);
    }
    const number = _.get(ball, 'ball.number', 0);
    const setNumber = type !== 'number' ? (() => {}) : (
        newNumber => update(_.set(existing, 'ball.number', newNumber)));
    const location = _.get(ball, 'location', {x: 0, y: 0});
    const setLocation = newLocation => update(_.set(existing, 'location', newLocation));
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
                <button onClick={remove}>Remove</button>
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

    const removeBall = async index => {
        await saveBalls(currentBalls.filter((_, idx) => idx !== index));
        await network.refetch();
    };
    const addBall = async () => {
        await saveBalls([
            ...currentBalls,
            {ball: {type: "object"}, location: {x: 0, y: 0}}
        ]);
        await network.refetch();
    };
    const setBall = async (ball, index) => {
        await saveBalls(currentBalls.map((b, idx) => (index === idx ? ball : b)));
        await network.refetch();
    };

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
                    update={b => setBall(b, index)}
                    remove={() => removeBall(index)}/>
            ))
        }
        <br/>
        <br/>
    </>);
};

export default Balls;

