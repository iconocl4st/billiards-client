import {CONTROLLER_STYLE, CONTROLLER_STYLE_2, LABEL_STYLE} from "../styles";
import _ from "lodash";
import axios from "axios";
import React from "react";
import {update, remove, add, insert} from '../ArrayModifiers';

const StepTypeParam = {
    cue: {
        label: 'Cue ball',
        key: 'cue-ball',
        bounds: numBalls => ({
            min: 0,
            max: numBalls
        }),
        initial: {type: 'cue', 'cue-ball': 0}
    },
    strike: {
        label: 'Object ball',
        key: 'object-ball',
        bounds: numBalls => ({
            min: 0,
            max: numBalls
        }),
        initial: {type: 'strike', 'object-ball': 1}
    },
    rail:  {
        label: 'Rail',
        key: 'rail',
        bounds: numBalls => ({min: 0, max: 4}),
        initial: {type: 'rail', 'rail': 2}
    },
    kiss: {
        label: 'Glanced',
        key: 'kissed-ball', // kiss-type: ['stun', 'rolling']
        bounds: numBalls => ({
            min: 0,
            max: numBalls
        }),
        initial: {
            type: 'kiss',
            'kissed-ball': 1,
            'kiss-type': 'rolling'
        }
    },
    pocket:  {
        label: 'Pocket',
        key: 'pocket',
        bounds: numBalls => ({
            min: 0,
            max: 6
        }),
        initial: {type: 'pocket', pocket: 5}
    },
}


const getTemplateColumns = type => type === 'kiss' ?
    '5% auto 15% auto 15% 15% 5% 5%' :
    '5% auto 20% auto 20% 5% 5%';

const ShotStep = ({
    step,
    stepIndex,
    updateStep,
    insertStep,
    removeStep,
    canAdd,
    canModify,
    numBalls,
}) => {
    const type = step.type;
    const stepParam = StepTypeParam[type];
    const setNumber = num => updateStep({...step, [stepParam.key]: num});
    const number = step[stepParam.key];
    const setType = newType => updateStep(StepTypeParam[newType].initial);
    const nothing = () => {};
    return (
        <div style={{
            border: '1px solid white',
            display: 'grid',
            gridTemplateColumns: getTemplateColumns(type),
        }}>
            <label style={{textAlign: 'center'}}>{stepIndex}</label>
            <label style={{textAlign: 'center'}}>Type:</label>
            <select
                value={step.type}
                onChange={({target: {value}}) => setType(value)}
                disabled={!canModify}
            >
                <option value="cue">Cue</option>
                <option value="strike">Strike</option>
                <option value="rail">Rail</option>
                <option value="kiss">Glance</option>
                <option value="pocket">Pocket</option>
            </select>
            <label style={{textAlign: 'center'}}>{stepParam.label}:</label>
            <input
                type="number"
                value={number}
                onChange={({target: {value}}) => setNumber(Number(value))}
                {...stepParam.bounds(numBalls)}
            />
            {
                type === 'kiss' && (
                    <select
                        value={step['kiss-type']}
                        onChange={({target: {value}}) => updateStep({...step, 'kiss-type': value})}
                    >
                        <option value="stun">Stun</option>
                        <option value="rolling">Rolling</option>
                    </select>
                )
            }
            <button disabled={!canModify} onClick={canModify ? removeStep : nothing}>-</button>
            <button disabled={!canAdd} onClick={canAdd ? insertStep : nothing}>+</button>
        </div>
    )
}



const Shot = ({shot, updateShot, removeShot, shotIndex, numBalls}) => {
    const currentSteps = _.get(shot, 'steps', []);
    const saveSteps = steps => updateShot({steps});
    const removeStep = remove(saveSteps, currentSteps);
    const updateStep = update(saveSteps, currentSteps);
    const insertStep = insert(saveSteps, currentSteps, StepTypeParam.strike.initial);
    return (
        <>
            <div>Shot {shotIndex + 1}:</div>
            <button onClick={removeShot}>Remove</button>
            <br/>
            <div style={{
                border: '1px solid yellow',
                display: 'grid',
                // gridGap: '10px',
                gridTemplateColumns: '49% 49%',
            }}>
                {
                    currentSteps.map((step, index) => (
                        <ShotStep
                            key={`step-${index}`}
                            step={step}
                            stepIndex={index}
                            updateStep={updateStep(index)}
                            insertStep={insertStep(index)}
                            removeStep={removeStep(index)}
                            canAdd={index !== currentSteps.length - 1}
                            canModify={index !== 0 && index !== currentSteps.length - 1}
                            numBalls={numBalls}
                        />
                    ))
                }
            </div>
        </>
    );
}

const Shots = ({layout, layoutsApi, back, network}) => {
    const uuid = _.get(layout, 'info.uuid', 'no uuid found');
    const currentShots = _.get(layout, 'entry.shots', []);
    const existing = _.cloneDeep(_.get(layout, 'entry', {}));
    const saveShots = async newShots => {
        const resp = await axios.put(layoutsApi + 'layout/' + uuid, {
            updates: _.set(existing, 'shots', newShots)
        });
        console.log("Update response", resp);
        await network.refetch();
    };
    const numBalls = _.get(layout, 'entry.locations.balls', [0]).length;
    const initial = {steps: [{type: "cue", "cue-ball": 0}, {type: "pocket", pocket: 0}]};
    const addShot = add(saveShots, currentShots, initial);
    const updateShot = update(saveShots, currentShots);
    const removeShot = remove(saveShots, currentShots);

    return (<>
        <div style={LABEL_STYLE}>Shots</div>
        <div style={CONTROLLER_STYLE}><button onClick={addShot}>Add shot</button></div>
        <div style={CONTROLLER_STYLE_2}><button onClick={back}>Done</button></div>
        <br/>
        {
            currentShots.map((shot, index) => (
                <Shot
                    key={`ball-${index}`}
                    shotIndex={index}
                    shot={shot}
                    updateShot={updateShot(index)}
                    removeShot={removeShot(index)}
                    numBalls={numBalls}
                />
            ))
        }
        <br/>
    </>);
};

export default Shots;
