import React from 'react';

import './draw.css';


export default class Draw extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            useInterpolation: false
        }
        this.draw = false;
        this.points = [];
        this.index = 0;
        this.canvas = null;
    }

    componentDidMount() {
        this.canvas = this.refs.canvas;

    }

    savePoints = (e) => {
        this.index++;
        if (this.index <= 500 && this.draw) {
            this.points.push(this.getMousePos(this.canvas, e));
            this.canvasUpdate(this.points, this.state.useInterpolation);
        } else {
            this.index = 0;
            this.points = [];
        }
    }

    getMousePos = (canvas, evt) => {
        var rect = canvas.getBoundingClientRect();
        return {
            x: (evt.clientX - rect.left) / (rect.right - rect.left) * canvas.width,
            y: (evt.clientY - rect.top) / (rect.bottom - rect.top) * canvas.height
        };
    }

    canvasClear = () => {
        const context = this.canvas.getContext('2d');
        context.clearRect(0, 0, this.canvas.width, this.canvas.height);       
    }

    canvasUpdate = (points, interpolation) => {
        const context = this.canvas.getContext('2d');
        let samples = [];

        if (interpolation) {
            samples = this.linearInterpolation(points, 5);
        } else {
            samples = points;
        }
        samples.forEach((coordinates) => {
            context.beginPath();
            //context.lineWidth = "1";
            context.strokeStyle = "black";
            context.rect(coordinates.x, coordinates.y, 1, 1);
            context.stroke();
        });

    }

    linearInterpolation = (points, magnitude) => {
        let pointsArr = points;
        for (let i = 0; i < magnitude; i++) {
            pointsArr = this.calculatemissingSamples(pointsArr);
        }
        return pointsArr;
    }

    calculatemissingSamples = (pointsArr) => {
        let arr = [];
        pointsArr.forEach((point, index) => {
            arr.push(point);
            if (index < pointsArr.length - 1) {
                // arithmetic mean
                // arr.push({ x: (point.x + pointsArr[index + 1].x) / 2, y: (point.y + pointsArr[index + 1].y) / 2 });
                // geometric mean
                arr.push({x: Math.sqrt(point.x * pointsArr[index + 1].x), y: Math.sqrt(point.y * pointsArr[index + 1].y)});
            }
        })
        return arr;
    }

    enableInterpolation = () => {
        this.setState({
            useInterpolation: !this.state.useInterpolation
        }, () => {
            this.canvasUpdate(this.points, this.state.useInterpolation);
        });
    }

    analizeData = () => {
        this.draw = false; 
        this.index = 0; 
        console.log(this.points)
    }

    render() {
        console.log("render")
        return (
            <div className="draw-body">
                <canvas
                    onMouseDown={() => { this.draw = true }}
                    onMouseUp={() => this.analizeData()}
                    onMouseMove={e => this.savePoints(e)}
                    onTouchStart={() => { this.draw = true }}
                    onTouchCancel={() => { this.draw = true }}
                    onTouchEnd={() => { this.draw = false; this.index = 0; }}
                    onTouchMove={e => this.savePoints(e)}
                    ref="canvas"
                    width={320}
                    height={420}
                    style={{ border: '2px dashed black' }} />
                <div className="menu">
                    <label htmlFor="enable_button">Interpolation</label>
                    <button id="enable_button" onClick={this.enableInterpolation}>{this.state.useInterpolation ? "Enabled" : "Disabled"}</button>
                    <hr />
                    <button onClick={this.canvasClear}>Clear</button>
                </div>
            </div>
        )
    }
}