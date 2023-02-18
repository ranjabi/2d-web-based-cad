import Vertice from "./vertice.js";
import {
    euclideanDistance,
} from "./utility.js";

export default class Line {
    // let x1 = new Vertice(

    // );

    constructor(x, y, length, color) {
        this.x1 = x;
        this.y1 = y;
        this.x2 = x + length;
        this.y2 = y + length;
        this.length = length;
        this.color = this.setColor(color);
    }

    getSliderAttr(canvas) {
        return [
            {
                sliderID: "x-position",
                name: "x",
                slideFunction: this.updatePositionX(),
                min: 0,
                max: canvas.clientWidth - this.width,
                value: this.getX(),
            },
            {
                sliderID: "y",
                name: "y position",
                slideFunction: this.updatePositionY(),
                min: 0,
                max: canvas.clientHeight - this.height,
                value: this.getY(),
            }
        ];
    }

   

    getCount() {
        //count banyak yang akan di render
        return 2;
    }

    getPrimitiveType() {
        // GL.LINES
        return 1;
    }

    getX() {
        return this.x1;
    }

    getY() {
        return this.y1;
    }

    // TODO: SET OBJECT COLOR FROM CONSTRUCTOR AND CREATE SET FUNCTION TO CHANGE OBJECT COLOR
    setColor({ r, g, b }) {
        return [r,g,b, r,g,b]
    }

    getColor() {
        return this.color;
    }

    getPosition() {
        return [
            [this.x1, this.y1],
            [this.x2, this.y2]
        ];
    }

    updatePositionX() {
        let self = this;
        return function (event, newCoor) {
            self.x1 = newCoor.value;
            self.x2 = newCoor.value + self.length;
        };
    }

    updatePositionY() {
        let self = this;
        return function (event, newCoor) {
            self.y1 = newCoor.value;
            self.y2 = newCoor.value + self.length;
        };
    }

    updateCoor({ newX, newY }) {
        // choose whether update right or left
        if (
            euclideanDistance(
                { x: newX, y: newY },
                { x: this.x1, y: this.y1 }
            ) < 20
        ) {
            this.updateLeft({ newX, newY });
        } else {
            this.updateRight({ newX, newY });
        }
    }

    updateLeft({ newX, newY }) {
        this.length = newX - this.x2;
        // this.height = newY - this.y2
        this.x1 = newX;
        this.y1 = newY; 
    }

    updateRight({ newX, newY }) {
        this.length = newX - this.x1;
        // this.height = newY - this.y1;
        this.x2 = newX;
        this.y2 = newY;
    }
    updateColor(type, pointIndex) {
        let self = this;
        return function (event, newColor) {
            self.color[pointIndex*3 + type] = newColor.value
        };
    }
    getColorAttr(){
        let slider = [];
        for (let i = 0; i < this.getCount(); i++) {
                slider.push({
                    sliderID: "red_" + i,
                    name: "red point " + i,
                    slideFunction: this.updateColor(0,i),
                    min: 0,
                    max: 1,
                    value: this.getColor()[i*3 + 0],
                    step: 0.01
                });

                slider.push({
                    sliderID: "gree_" + i,
                    name: "green point " + i,
                    slideFunction: this.updateColor(1,i),
                    min: 0,
                    max: 1,
                    value: this.getColor()[i*3 + 1],
                    step: 0.01
                });

                slider.push({
                    sliderID: "blue_" + i,
                    name: "blue point " + i,
                    slideFunction: this.updateColor(2,i),
                    min: 0,
                    max: 1,
                    value: this.getColor()[i*3 + 1],
                    step: 0.01
                });
            }

        return slider;
    }
}