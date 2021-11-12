import React, {useEffect, useState} from 'react';
import _ from 'lodash';
import Layout from "./Layout";
import LayoutList from "./LayoutList";

import useAxios from 'axios-hooks'
import axios from 'axios';
import {getApiUrl} from "../Apis";


const LAYOUTS = [{
	name: "some scene",
	created: 1040924,
	last_modified: 320953,
	uuid: "skdjflksdjflj",
	layout: {},
	shots: [],
	graphics: []
}];


const Design = ({layoutsApi}) => {
	const [{data, loading, error}, refetch] = useAxios(layoutsApi + "layouts/")
	const layouts = _.get(data, 'layouts', []);
    const [editingState, setEditingState] = useState({editing: false});
	const create = async () => {
		const ret = await axios.post(layoutsApi + 'layouts/', {});
		console.log('created: ', ret);
		await refetch();
	};
	const copy = async uuid => {
		const {data: {layout: {entry: input}, success}, status} = await axios.get(layoutsApi + 'layout/' + uuid);
		if (status !== 200 || !success) {
			console.log('Unable to get current layout...');
			return;
		}
		const ret = await axios.post(layoutsApi + 'layouts/', {input});
		console.log('created: ', ret); // TODO
		await refetch();
	};
	const remove = async uuid => {
		const ret = await axios.delete(layoutsApi + 'layout/' + uuid);
		console.log('removed: ', ret);
		await refetch();
	};
	const edit = uuid=>setEditingState({editing: true, uuid});

    if (editingState.editing) {
		return <Layout
			uuid={editingState.uuid}
			layoutsApi={layoutsApi}
			back={async () => {
				setEditingState({editing: false});
				refetch();
			}}
			remove={() => remove(editingState.uuid)}
		/>
    } else {
		return <LayoutList
			layouts={layouts}
			edit={edit}
			create={create}
			copy={copy}
			remove={remove} />;
    }
};

export default ({configUrl}) => {
	const [configData] = useAxios(configUrl);
	const layoutsApi = getApiUrl("Layouts", configData);
	if (layoutsApi === 'none') {
		return <div>Loading...</div>;
	}
	return <Design layoutsApi={layoutsApi}/>;
}

