
import React from 'react';

import ComponentTree from './ComponentTree';

import Play from './Play';
import RandomShots from "./RandomShots";
import Design from './layouts/Design';
import Drills from './Drills';
import Layouts from "./Layouts";
import CheckerBoard from "./Settings/CheckerBoard";
import Camera from "./Settings/CameraLocation";
import TableDimensions from "./Settings/PoolConfiguration/TableDimensions";
import ApiStatus from "./Settings/ApiStatuses";
import ProjectorMapping from "./Settings/ProjectorLocation/ProjectorMapping";
import Pockets from "./Settings/PoolConfiguration/Pockets";
import Balls from "./Settings/PoolConfiguration/Balls";
import RandomLocations from "./RandomLocations";
import RandomShots2 from "./RandomShots/RandomShots2";


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
            type: 'branch',
            label: 'Random',
            children: [{
                type: 'leaf',
                label: 'Random shots',
                component: RandomShots
            }, {
                type: 'leaf',
                label: 'Random shots 2',
                component: RandomShots2
            }, {
                type: 'leaf',
                label: 'Random Locations',
                component: RandomLocations
            }]
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
            label: 'Api Statuses',
            component: ApiStatus
        }, {
            type: 'branch',
            label: 'Pool Settings',
            children: [{
                type: 'leaf',
                label: 'Balls',
                component: Balls
            }, {
                type: 'leaf',
                label: 'Pockets',
                component: Pockets
            }, {
                type: 'leaf',
                label: 'Table dimensions',
                component: TableDimensions
            }]
        }, {
            type: 'leaf',
            label: 'Projector settings',
            component: ProjectorMapping
        }, {
            type: 'leaf',
            label: 'Camera location',
            component: Camera
        }, {
            type: 'leaf',
            label: 'Checkerboard',
            component: CheckerBoard
        },]
    }]
};


const Landing = props => <ComponentTree tree={tree} {...props}/>;

export default Landing;
