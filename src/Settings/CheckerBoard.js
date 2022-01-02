import React, { useState, useRef, useEffect } from 'react';
import _ from 'lodash';
import {BorderedStyle} from "../styles";
import {NumberSetting} from "../Common";

// export const fitAspect = (aspect, graphicsDims) => {
//     const aspectW = _.get(aspect, 'width', 16);
//     const aspectH = _.get(aspect, 'height', 9);
//     const maxWidth = _.get(graphicsDims, 'width', 1920);
//     const maxHeight = _.get(graphicsDims, 'height', 1080);
//
//     let width = 0;
//     let height = 0;
//     if (maxHeight * aspectW < aspectH * maxWidth) {
//         width = aspectW * maxHeight / aspectH;
//         height = maxHeight;
//     } else {
//         width = maxWidth;
//         height = aspectH * maxWidth / aspectW;
//     }
//     return {
//         // ...graphicsDims,
//         left: (window.innerWidth - width) / 2,
//         width,
//         height
//     }
// };


const drawCheckerBoard = (ctx, rows, cols, radius) => {
    ctx.fillStyle = 'rgb(0, 0, 0)';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    ctx.fillStyle = 'rgb(255, 255, 255)';
    for (let row=0; /*row * r <= h*/ row < rows; row++) {
        for (let col=0; /*col * r <= w*/ col < cols; col++) {
            if ((row + col) % 2 === 0) {
                continue;
            }
            ctx.beginPath();
            ctx.moveTo(radius * col, radius * row);
            ctx.lineTo(radius * (col + 1), radius * row);
            ctx.lineTo(radius * (col + 1), radius * (row + 1));
            ctx.lineTo(radius * col, radius * (row + 1));
            ctx.lineTo(radius * col, radius * row);
            ctx.closePath();
            ctx.fill();
        }
    }
};

const CheckerBoard = () => {
    const [rows, setRows] = useState(7);
    const [cols, setCols] = useState(10);
    const [radius, setRadius] = useState(10);

    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) {
            return;
        }
        const context = canvas.getContext('2d');
        drawCheckerBoard(context, rows, cols, radius);
    }, [rows, cols, radius]);

    return (
        <>
            <div style={{
                ...BorderedStyle,
                display: 'grid',
                gridTemplateColumns: 'auto auto auto auto auto auto',
            }}>
                <NumberSetting label="Rows" value={rows} setValue={setRows} />
                <NumberSetting label="Cols" value={cols} setValue={setCols} />
                <NumberSetting label="Radius" value={radius} setValue={setRadius} />
            </div>

            <canvas
                ref={canvasRef}
                width={radius * cols}
                height={radius * rows}
            />
        </>
    );
};

export default CheckerBoard;
