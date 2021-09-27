import React, { useState } from 'react';
import useAxios from 'axios-hooks'


const SCENES = [{
	name: "some scene",
	created: 1040924,
	last_modified: 320953,
	uuid: "skdjflksdjflj",
        layout: {},
	shots: [],
	graphics: []
}];


const SceneEditor = ({ uuid }) => {
	return (
		<div>
			<div>
				Name
				Uuid
			</div>
			<div>
				Preview
			</div>
			<div>
				Objects
				<div>
					Balls
					Shots
					Graphics
				</div>
			</div>
		</div>
	);
};


const SceneEntry = ({name, created, last_modified, uuid}) => (
	<tr>
		<td>{name}</td>
		<td>{new Date(last_modified).toLocaleDateString()}</td>
		<td>Edit</td>
		<td>Copy</td>
		<td>Remove</td>
	</tr>
);


const ScenesList = ({scenes}) => (
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
		    		scenes.map((scene, index) => <SceneEntry key={`scene-${index}`} {...scene} />)
			}
    		</tbody>
    </table>
);



const Design = () => {
    const [editingState, setEditingState] = useState({editing: false});

    

    if (editingState.editing) {
	// return <SceneEditor uuid={editingState.uuid} />
    } else {
	return <ScenesList scenes={SCENES} edit={uuid=>setEditingState({editing:true, uuid})} />;
    }
};


export default Design;

