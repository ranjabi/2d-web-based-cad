import {
    euclideanDistance,
} from "./utility.js";

export default class Rectangle {
    constructor(x, y, width, height, color, isSquare = false) {
        this.x1 = x;
        this.y1 = y;
        this.x2 = x + width;
        this.y2 = y + height;
        this.width = width;
        this.height = height;
        this.color = this.setColor(color);
        this.isSquare = isSquare;
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

    // TODO: SET OBJECT COLOR FROM CONSTRUCTOR AND CREATE SET FUNCTION TO CHANGE OBJECT COLOR
    setColor({ r, g, b }) {
        return [r,g,b, r,g,b, r,g,b, r,g,b, r,g,b, r,g,b, r,g,b, r,g,b, r,g,b, r,g,b, r,g,b, r,g,b]
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

    updateCoor({ newX, newY }) {
        // choose whether update bottom right or top left
        if (
            euclideanDistance(
                { x: newX, y: newY },
                { x: this.x1, y: this.y1 }
            ) < 20
        ) {
            if (this.isSquare) {
                newY = newX
            }
            this.updateTopLeft({ newX, newY });
        } else {
            this.updateBottomRight({ newX, newY });
        }
    }

    updateTopLeft({ newX, newY }) {
        if (this.isSquare) {
            this.width = newX - this.x2;
            this.height = this.width;
            this.x1 = newX;
            this.y1 = this.y2 + this.width;
        } else {
            this.width = newX - this.x2
            this.height = newY - this.y2
            this.x1 = newX;
            this.y1 = newY;
        }
        
    }

    updateBottomRight({ newX, newY }) {
        if (this.isSquare) {
            this.width = newX - this.x1;
            this.height = this.width;
            this.x2 = newX;
            this.y2 = this.y1 + this.width;
        } else {
            this.width = newX - this.x1;
            this.height = newY - this.y1;
            this.x2 = newX;
            this.y2 = newY;
        }
        
    }
}
