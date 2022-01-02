import React from 'react';
import {BorderedStyle} from "../styles";

const Camera = () => {
    return (
        <div style={{
            ...BorderedStyle
        }}>
            <label>Table detection mechanism</label>
            <select>
                <option value="static">Set rectangle</option>
                <option value="features">Use image features</option>
            </select>
        </div>
    );
};

export default Camera;
