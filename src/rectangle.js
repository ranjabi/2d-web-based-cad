import {
    euclideanDistance,
    hextoRGB,
    RGBtoHex,
} from "./utility.js";
export default class Rectangle {
    constructor(x, y, width, height, color, isSquare = false) {
        // top left
        this.x1 = x;
        this.y1 = y;

        // bottom right
        this.x2 = x + width;
        this.y2 = y + height;

        this.width = width;
        this.height = height;
        this.color = this.setColor(color);
        this.isSquare = isSquare;
        this.type = "rectangle";
    }

    getSliderAttr(canvas) {
        let attr = [
            {
                sliderID: "x-position",
                name: "x position",
                slideFunction: this.updatePositionX(),
                min: 0,
                max: canvas.clientWidth - this.width,
                value: this.getX(),
            },
            {
                sliderID: "y-position",
                name: "y position",
                slideFunction: this.updatePositionY(),
                min: 0,
                max: canvas.clientHeight - this.height,
                value: this.getY(),
            },
            {
                sliderID: "panjang",
                name: "panjang",
                slideFunction: this.updateWidth(),
                min: 0,
                max: canvas.clientWidth - this.x1,
                value: this.getWidth(),
            }
        ]

        if (!this.isSquare) {
            attr.push({
                sliderID: "lebar",
                name: "lebar",
                slideFunction: this.updateHeight(),
                min: 0,
                max: canvas.clientHeight - this.y1,
                value: this.getHeight(),
            })
        }
        return attr;
    }

    getCount() {
        //count banyak yang akan di render
        return 6;
    }

    getPrimitiveType() {
        // GL.TRIANGLE
        return 4;
    }

    getX() {
        return this.x1;
    }

    getY() {
        return this.y1;
    }

    getWidth() {
        return this.width;
    }

    getHeight() {
        return this.height;
    }

    setColor({ r, g, b }) {
        return [r,g,b, r,g,b, r,g,b, r,g,b, r,g,b, r,g,b]
    }

    getColor() {
        return this.color;
    }

    getPosition() {
        return [
            [this.x1, this.y1],
            [this.x2, this.y1],
            [this.x1, this.y2],
            [this.x1, this.y2],
            [this.x2, this.y1],
            [this.x2, this.y2],
        ];
    }

    updatePositionX() {
        let self = this;
        return function (event, newCoor) {
            self.x1 = newCoor.value;
            self.x2 = newCoor.value + self.width;
        };
    }

    updatePositionY() {
        let self = this;
        return function (event, newCoor) {
            self.y1 = newCoor.value;
            self.y2 = newCoor.value + self.height;
        };
    }

    updateWidth() {
        let self = this;
        return function (event, newWidth) {
            self.width = newWidth.value
            self.x2 = self.x1 + newWidth.value

            if (self.isSquare) {
                self.height = newWidth.value
                self.y2 = self.x1 + newWidth.value
            }
        }
    }

    updateHeight() {
        let self = this;
        return function (event, newHeight) {
            self.height = newHeight.value
            self.y2 = self.x1 + newHeight.value
        }
    }

    updateCoor({ newX, newY }) {
        // choose which vertex to update
        let topLeft = { x: this.x1, y: this.y1 }
        let topRight = { x: this.x2, y: this.y1 }
        let bottomLeft = { x: this.x1, y: this.y2 }
        let bottomRight = { x: this.x2, y: this.y2 }

        let offset = 20

        if (
            euclideanDistance(
                { x: newX, y: newY },
                topLeft
            ) < offset
        ) {
            this.updateTopLeft({ newX, newY });
        } else if (
            euclideanDistance(
                { x: newX, y: newY },
                topRight
            ) < offset
        ) {
            this.updateTopRight({ newX, newY });
        }  
        else if (
            euclideanDistance(
                { x: newX, y: newY },
                bottomLeft
            ) < offset
        ) {
            this.updateBottomLeft({ newX, newY });
        }  else if (
            euclideanDistance(
                { x: newX, y: newY },
                bottomRight
            ) < offset
        ) {
            this.updateBottomRight({ newX, newY });
        }
    }

    updateTopLeft({ newX, newY }) {
        // if square, height = width (only reference the width changes)
        if (this.isSquare) {
            this.width = Math.abs(newX - this.x2);
            this.height = this.width;
            this.x1 = newX;
            this.y1 = this.y2 - this.width;
        } else {
            this.width = Math.abs(newX - this.x2)
            this.height = Math.abs(newY - this.y2)
            this.x1 = newX;
            this.y1 = newY;
        }
        
    }

    updateTopRight({ newX, newY }) {
        if (this.isSquare) {
            this.width = Math.abs(newX - this.x1);
            this.height = this.width;
            this.x2 = newX;
            this.y1 = this.y2 - this.width;
        } else {
            this.width = Math.abs(newX - this.x1)
            this.height = Math.abs(newY - this.y2)
            this.x2 = newX;
            this.y1 = newY;
        }
        
    }

    updateBottomLeft({ newX, newY }) {
        if (this.isSquare) {
            this.width = Math.abs(newX - this.x2);
            this.height = this.width;
            this.x1 = newX;
            this.y2 = this.y1 + this.width;
        } else {
            this.width = Math.abs(newX - this.x2);
            this.height = Math.abs(newY - this.y1);
            this.x1 = newX;
            this.y2 = newY;
        }
        
    }

    updateBottomRight({ newX, newY }) {
        if (this.isSquare) {
            this.width = Math.abs(newX - this.x1);
            this.height = this.width;
            this.x2 = newX;
            this.y2 = this.y1 + this.width;
        } else {
            this.width = Math.abs(newX - this.x1);
            this.height = Math.abs(newY - this.y1);
            this.x2 = newX;
            this.y2 = newY;
        }
        
    }

    getColorAttr(){
        let slider = [{
            id: "all_color",
            name: "All Vertex Color",
            slideFunction: this.updateColorAll(),
            value: RGBtoHex(this.color[ 0], this.color[ 1], this.color[ 2])
        }];
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
    updateColorAll(){
        let self = this
        return function (event, newColor) {
            let rgb = hextoRGB(newColor.value)
            console.log(rgb)
            for (let i = 0; i < self.getCount(); i++){
                self.color[i * 3 + 0] = rgb[0]
                self.color[i * 3 + 1] = rgb[1]
                self.color[i * 3 + 2] = rgb[2]
            }
        }
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
