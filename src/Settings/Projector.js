import React, { useState } from 'react';
import useAxios from 'axios-hooks';
import axios from 'axios';
import _ from 'lodash';
import { Point } from '../Common';


const DEFAULT = {
    width: 1920,
    height: 1080,
    r: 1
};

const getLocation = data => ({
    begin: _.get(data, 'table.offset', {x: DEFAULT.r, y: DEFAULT.r}),
    up: _.get(data, 'table.up', {x: 0, y: DEFAULT.height - 2 * DEFAULT.r}),
    right: _.get(data, 'table.right', {x: DEFAULT.width - 2 * DEFAULT.r, y: 0})
});

const Projector = () => {
    const [{data, loading, error}, refetch] = useAxios(
	'http://localhost:18080/location'
    );
    const {begin, up, right} = getLocation(data);
    const execPut = async d => {
	await axios.put(
	    'http://localhost:18080/location',
	    {
		begin,
		up,
		right,
		...d
	    }
	);
	await refetch();
    };
    
    return (
            <div>
	    <Point label="Lower left" point={begin} set={offset => execPut({offset})}/>
	    <Point label="Up" point={up} set={up => execPut({up})}/>
	    <Point label="Right" point={right} set={right => execPut({right})}/>
        </div>
    )
};

export default Projector;
