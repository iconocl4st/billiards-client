import React, { useState } from 'react';

import RandomShots from './RandomShots.js';
import Layouts from './Layouts.js';
import Drills from './Drills.js';


const Practice = () => {
    const [showing, setShowing] = useState('none');
    return {
        'none': (
            <>
                <button onClick={() => setShowing('random')}>Random Shots</button>
                <button onClick={() => setShowing('layouts')}>Layouts</button>
                <button onClick={() => setShowing('drills')}>Drills</button>
            </>
        ),
        'random': (
            <>
                <button onClick={() => setShowing('none')}>Practice</button>
                <RandomShots/>
            </>
        ),
        'layouts': (
            <>
                <button onClick={() => setShowing('none')}>Practice</button>
                <Layouts/>
            </>
        ),
        'drills': (
            <>
                <button onClick={() => setShowing('none')}>Practice</button>
                <Drills/>
            </>
        ),
    }[showing];
};

export default Practice;
