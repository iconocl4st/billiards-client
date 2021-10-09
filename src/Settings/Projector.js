import React, {useState} from 'react';
import useAxios from 'axios-hooks';
import axios from 'axios';
import _ from 'lodash';
import {Point} from '../Common';



const getLocation = data => ({
    offset: _.get(data, 'location.offset', {x: -1, y: -1}),
    up: _.get(data, 'location.up', {x: -1, y: -1}),
    right: _.get(data, 'location.right', {x: -1, y: -1})
});

const Projector = () => {
    const [{data, loading, error}, refetch] = useAxios(
        'http://localhost:18080/location/'
    );
    const {offset, up, right} = getLocation(data);
    const execPut = async d => {
        await axios.put(
            'http://localhost:18080/location/',
            { location: { offset, up, right, ...d } }
        );
        await refetch();
    };

    return (
        <div>
            <Point label="Offset" step="1" point={offset} set={offset => execPut({offset})}/>
            <Point label="Up" step="1" point={up} set={up => execPut({up})}/>
            <Point label="Right" step="1" point={right} set={right => execPut({right})}/>
        </div>
    )
};

export default Projector;
