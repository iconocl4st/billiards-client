import React, { useState } from 'react';

const LayoutEntry = ({edit, name, created, last_modified, uuid}) => (
    <tr>
        <td>{name}</td>
        <td>{new Date(last_modified).toLocaleDateString()}</td>
        <td><button onClick={() => edit(uuid)}>Edit</button></td>
        <td>Copy</td>
        <td>Remove</td>
    </tr>
);


const LayoutList = ({scenes, edit}) => (
    <table>
        <thead>
        <tr>
            <th>Name</th>
            <th>Modified</th>
            <th>Edit</th>
            <th>Copy</th>
            <th>Remove</th>
        </tr>
        </thead>
        <tbody>
        {
            (scenes || []).map((scene, index) => (
                <LayoutEntry key={`scene-${index}`} edit={edit} {...scene} />
            ))
        }
        </tbody>
    </table>
);


export default LayoutList;