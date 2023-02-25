import Vertice from "./vertice.js";
import {
    euclideanDistance,
    hextoRGB,
    RGBtoHex,
} from "./utility.js";

export default class Line {

    constructor(x, y, length, color) {
        this.x1 = x;
        this.y1 = y;
        this.x2 = x + length;
        this.y2 = y + length;
        this.length = length;
        this.color = this.setColor(color);
        this.type = "line";
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
            },
            {
                sliderID: "panjang",
                name: "panjang",
                slideFunction: this.updateLength(),
                min: 0,
                max: canvas.clientWidth - this.x1,
                value: this.getLength(),
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

    getLength() {
        return this.length;
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
            if (self.x1 < self.x2) {
                self.x1 = newCoor.value;
                self.x2 = newCoor.value + self.length;
            } else {
                self.x2 = newCoor.value;
                self.x1 = newCoor.value + self.length;
            }
            
        };
    }

    updatePositionY() {
        let self = this;
        return function (event, newCoor) {
            if (self.y1 < self.y2) {
                self.y1 = newCoor.value;
                self.y2 = newCoor.value + self.length;
            } else {
                self.y2 = newCoor.value;
                self.y1 = newCoor.value + self.length;
            }
            
        };
    }

    updateLength() {
        let self = this;
        return function (event, newLength) {
            self.length = newLength.value
            if (self.x1 < self.x2 && self.y1 < self.y2) {
                self.x2 = self.x1 + newLength.value
                self.y2 = self.y1 + newLength.value
            } else {
                self.x1 = self.x2 + newLength.value
                self.y1 = self.y2 + newLength.value
            }
            
        }
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
        this.x1 = newX;
        this.y1 = newY; 
        this.length = euclideanDistance(
            {x: this.x1, y: this.y1},
            {x: this.x2, y: this.y2}
        )
    }

    updateRight({ newX, newY }) {
        this.x2 = newX;
        this.y2 = newY;
        this.length = euclideanDistance(
            {x: this.x1, y: this.y1},
            {x: this.x2, y: this.y2}
        )
    }
    getColorAttr(){
        let slider = [];
        for (let i = 0; i < this.getCount(); i++) {
                slider.push({
                    id: "point_" + i,
                    name: "color point " + i,
                    slideFunction: this.updateColor(i),
                    value: RGBtoHex(this.color[i*3 + 0], this.color[i*3 + 1], this.color[i*3 + 2])
                });
            }

        return slider;
    }
    updateColor(pointIndex) {
        let self = this;
        return function (event, newColor) {
            let rgb = hextoRGB(newColor.value)
            self.color[pointIndex*3 + 0] = rgb[0]
            self.color[pointIndex*3 + 1] = rgb[1]
            self.color[pointIndex*3 + 2] = rgb[2]
        };
    }

    
}