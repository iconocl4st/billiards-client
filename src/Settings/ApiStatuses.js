import React, { useState } from 'react';
import axios from 'axios';
import useAxios from 'axios-hooks';
import _ from 'lodash';


const getConnectionStatus = ({data, loading, error}) => {
    if (error) {
        return {
            label: 'Not Available',
            background: 'red',
            uptime: 'n/a'
        }
    } else if (loading) {
        return {
            label: 'Loading',
            background: 'yellow',
            uptime: 'n/a'
        }
    } else if (!data || !('success' in data)) {
        return {
            label: 'No data',
            background: 'red',
            uptime: 'n/a'
        }
    } else {
        return {
            label: 'Connected',
            background: 'green',
            uptime: _.get(data, 'up-time', 0).toString() + ' (s)'
        }
    }
};

const getStatusStyle = ({background}, index) => {
    return {
        background,
        position: 'absolute',
        height: 50,
        top: index * 50,
        width: '100%',
        border: '1px solid black',
    }
};

const ApiStatus = ({label, url, index}) => {
    const [response, refetch] = useAxios(url + 'status/');
    const status = getConnectionStatus(response);
    const refresh = async () => {
        try {
            await refetch();
        } catch (e) {
            console.log(e);
        }
    };
    const kill = async () => {
        try {
            await axios.put(url + 'status/', {shutdown: true});
        } catch (e) {
            console.log(e);
        }
        await refresh();
    };
    return (
        <div style={getStatusStyle(status, index)}>
            <label style={{position: 'absolute', left: '0%', width: '18%'}}>{label}</label>
            <input
                value={url}
                onChange={({target: {value}}) => console.log('set to ', value)}
                style={{position: 'absolute', left: '18%', width: '20%'}} />
            <label style={{position: 'absolute', left: '40%', width: '20%'}}>{status.label}</label>
            <label style={{position: 'absolute', left: '60%', width: '20%'}}>{status.uptime}</label>
            <div style={{position: 'absolute', left: '80%', width: '20%'}}>
                <button onClick={refresh}>Refresh</button>
                <button onClick={kill}>Kill</button>
            </div>
        </div>
    );
};

const APIS = [{
    label: 'Shots',
    url: 'http://localhost:18081/'
}, {
    label: 'Configuration',
    url: 'http://localhost:18086/'
}, {
    label: 'Image Processing',
    url: 'http://localhost:18084/'
}, {
    label: 'Layouts',
    url: 'http://localhost:18083/'
}, {
    label: 'Graphics',
    url: 'http://localhost:18082/'
}, {
    label: 'Projector',
    url: 'http://localhost:18080/'
}, {
    label: 'Attempts',
    url: 'http://localhost:18085/'
}];


const ApiStatuses = () => {
    return (
            <div>
	    {
		APIS.map((props, index) => (
			<ApiStatus key={`api-${index}`} index={index} {...props}/>
		))
	    }
        </div>
    )
};

export default ApiStatuses;