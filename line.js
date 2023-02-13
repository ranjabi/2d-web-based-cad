export default class Line {
    constructor(x, length, color, isLine = false) {
        this.x1 = x;
        this.x2 = x + length;
        this.length = length;
        this.color = this.setColor(color);
        this.isLine = isLine;
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

    // getCount() {
    //     //count banyak yang akan di render
    //     return 6;
    // }

    // getPrimitiveType() {
    //     // GL.TRIANGLE
    //     return 4;
    // }

    getX() {
        return this.x1;
    }

    // TODO: SET OBJECT COLOR FROM CONSTRUCTOR AND CREATE SET FUNCTION TO CHANGE OBJECT COLOR
    setColor({ r, g, b }) {
        return [r,g,b, r,g,b, r,g,b, r,g,b, r,g,b, r,g,b, r,g,b, r,g,b, r,g,b, r,g,b, r,g,b, r,g,b]
    }

    getColor() {
        return this.color;
    }

}