import React, { useState } from 'react';
import useAxios from 'axios-hooks';


const getColor = status => {
    if (status === 'connected') {
	return 'green';
    }
    return 'red';
};

const ApiStatus = ({label, url}) => {
    const [{data, loading, err}, refresh] = useAxios(url);
    return (
	    <tr>
	    <td>{label}</td>
	    <td>Connected</td>
	    <td>Amount of time</td>
	    <td><button onClick={() => refresh()}>Refresh</button></td>
	 </tr>
    );
};

const APIS = [{
    label: 'Shots API',
}, {
    label: 'Configuration',
}, {
    label: 'Image Processing',
}, {
    label: 'Layouts',
}, {
    label: 'Graphics',
}, {
    label: 'Projector',
}, {
    label: 'Attempts',
}];


const ApiStatus = () => {
    return (
            <div>
	    {
		APIS.map((props, index) => (
			<ApiStatus key={`api-${index}`} {...props}/>
		))
	    }
        </div>
    )
};

export default ApiStatus;
