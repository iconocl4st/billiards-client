import React, {useEffect, useState} from 'react';
import _ from 'lodash';
import Layout from "./Layout";
import LayoutList from "./LayoutList";

import useAxios from 'axios-hooks'
import axios from 'axios';

const creator = (layoutsUrl, refresh) => async () => {
	const ret = await axios.post(layoutsUrl + 'layouts/', {});
	console.log('created: ', ret);
	await refresh();
};

const copier = (layoutsUrl, refresh) => async uuid => {
	const {data: {layout: {entry: input}, success}, status} = await axios.get(layoutsUrl + 'layout/' + uuid);
	if (status !== 200 || !success) {
		console.log('Unable to get current layout...');
		return;
	}
	const ret = await axios.post(layoutsUrl + 'layouts/', {input});
	console.log('created: ', ret); // TODO
	await refresh();
};

const remover = (layoutsUrl, refresh) => async uuid => {
	const ret = await axios.delete(layoutsUrl + 'layout/' + uuid);
	console.log('removed: ', ret);
	await refresh();
};

const Design = ({configState}) => {
	const {apiUrls} = configState;
	const {layoutsUrl} = apiUrls;
	const [{data, loading, error}, refresh] = useAxios(layoutsUrl + "layouts/")
	const layouts = _.get(data, 'layouts', []);
    const [editingState, setEditingState] = useState({editing: false});
	const create = creator(layoutsUrl, refresh);
	const copy = copier(layoutsUrl, refresh);
	const edit = uuid=>setEditingState({editing: true, uuid});
	const remove = remover(layoutsUrl, refresh);
    if (editingState.editing) {
		return <Layout
			uuid={editingState.uuid}
			configState={configState}
			back={async () => {
				setEditingState({editing: false});
				refresh();
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

export default Design;
