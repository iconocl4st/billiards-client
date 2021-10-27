import React, { useState } from 'react';
import Layout from "./Layout";
import LayoutList from "./LayoutList";

import useAxios from 'axios-hooks'


const LAYOUTS = [{
	name: "some scene",
	created: 1040924,
	last_modified: 320953,
	uuid: "skdjflksdjflj",
	layout: {},
	shots: [],
	graphics: []
}];


const Design = () => {
    const [editingState, setEditingState] = useState({editing: false});
    if (editingState.editing) {
		return <Layout uuid={editingState.uuid} />
    } else {
		return <LayoutList scenes={LAYOUTS} edit={uuid=>setEditingState({editing:true, uuid})} />;
    }
};


export default Design;

