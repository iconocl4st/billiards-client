import React, { useState } from 'react';

const Camera = () => {
    return (
        <div>
            <label>Table detection mechanism</label>
            <select>
                <option value="static">Set rectangle</option>
                <option value="features">Use image features</option>
            </select>
        </div>
    );
};

export default Camera;
