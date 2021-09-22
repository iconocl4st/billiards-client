
import React from 'react';


import ComponentTree from './ComponentTree';

import Play from './Play';
import RandomShots from "./RandomShots";
import Design from './Design';
import Drills from './Drills';
import Layouts from "./Layouts";


const tree = {
    label: 'Welcome',
    type: 'branch',
    children: [{
        type: 'leaf',
        label: 'Play',
        component: Play
    }, {
        type: 'branch',
        label: 'Practice',
        children: [{
            type: 'leaf',
            label: 'Random shots',
            component: RandomShots
        }, {
            type: 'leaf',
            label: 'Layouts',
            component: Layouts
        }, {
            type: 'leaf',
            label: 'Drills',
            component: Drills
        }]
    }, {
        type: 'leaf',
        label: 'Design',
        component: Design
    }, {
        type: 'branch',
        label: 'Configure',
        children: [{
            type: 'leaf',
            label: 'Projector',
            component: () => <div>Yup</div>
        }]
    }]
};


const Landing = () => {
    return <ComponentTree tree={tree}/>
};

export default Landing;
