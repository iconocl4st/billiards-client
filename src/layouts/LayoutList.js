import React, { useState } from 'react';
import _ from 'lodash';
import {CONTROLLER_STYLE} from "../styles";
import {FormattedDate} from "../Common";


const Cols = [{
    width: '40%',
    label: 'Name',
    comp: props => <td style={_.get(props, 'style', {})}>{_.get(props, 'layout.entry.name', 'No name found')}</td>
}, {
    width: '20%',
    label: 'Created',
    comp: props => <td style={_.get(props, 'style', {})}>
        <FormattedDate unixTime={_.get(props, 'layout.info.creation-time', 0) * 1000} />
    </td>
}, {
    width: '20%',
    label: 'Last modified',
    comp: props => <td style={_.get(props, 'style', {})}>
        <FormattedDate unixTime={_.get(props, 'layout.info.modification-time', 0) * 1000} />
    </td>
}, {
    width: '20%',
    label: 'Actions',
    comp: props => {
        const uuid = _.get(props, 'layout.info.uuid', 'No uuid found');
        return (<td style={_.get(props, 'style', {})}>
            <button onClick={() => _.get(props, 'edit', ()=>{})(uuid)}>Edit</button>
            <button onClick={() => _.get(props, 'copy', ()=>{})(uuid)}>Copy</button>
            <button onClick={() => _.get(props, 'remove', ()=>{})(uuid)}>Remove</button>
        </td>);
    }
}];

const LayoutEntry = props => (
    <tr style={{width: '100%'}}>
    {Cols.map((col, index) =>
        <col.comp
            key={`column-${index}`}
            style={{
                width: col.width,
                border: '1px solid white',
                textAlign: 'center'
            }}
            {...props}/>)}
    </tr>
);


const LayoutList = ({layouts, edit, create, copy, remove}) => (
    <>
        <table>
            <thead>
            <tr style={{width: '100%'}}>
                {
                    Cols.map(({width, label}, index) =>
                        <th style={{width}} key={`header-${index}`}>{label}</th>)
                }
            </tr>
            </thead>
            <tbody>
            {
                (layouts || []).map((layout, index) => (
                    <LayoutEntry
                        key={`scene-${index}`}
                        layout={layout}
                        edit={edit} remove={remove} copy={copy}
                    />
                ))
            }
            </tbody>
        </table>
        <br/>
        <div style={CONTROLLER_STYLE}>
            <button onClick={create}>New</button>
        </div>
        <br/>
        <br/>
    </>
);


export default LayoutList;