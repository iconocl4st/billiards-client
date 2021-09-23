
import React from 'react';


import ComponentTree from './ComponentTree';

import Play from './Play';
import RandomShots from "./RandomShots";
import Design from './Design';
import Drills from './Drills';
import Layouts from "./Layouts";
import CheckerBoard from "./Settings/CheckerBoard";
import Camera from "./Settings/CameraLocation";
import Projector from "./Settings/Projector";
import Table from "./Settings/Table";
import ApiStatus from "./Settings/ApiStatus";


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
            label: 'Projector location',
            component: Projector
        }, {
            type: 'leaf',
            label: 'Camera location',
            component: Camera
        }, {
            type: 'leaf',
            label: 'Checkerboard',
            component: CheckerBoard
        }, {
            type: 'leaf',
            label: 'Table Dimensions',
            component: Table
        }, {
            type: 'leaf',
            label: 'Api Statuses',
            component: ApiStatus
        }]
    }]
};

const Landing = () => <ComponentTree tree={tree}/>;

export default Landing;
