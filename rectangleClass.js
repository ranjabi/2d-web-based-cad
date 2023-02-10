export default class Rectangle {
    constructor(x, y, width, height) {
        this.x1 = x;
        this.x2 = x + width;
        this.y1 = y;
        this.y2 = y + height;
        this.width = width
        this.height = height
    }
    getCount() { //count banyak yang akan di render
        return 6
    }
    getPrimitiveType() {
        return 4
    }

    getX() {
        return this.x1
    }

    getY() {
        return this.y1
    }

    // TODO: SET OBJECT COLOR FROM CONSTRUCTOR AND CREATE SET FUNCTION TO CHANGE OBJECT COLOR
    getColor(r,g,b) {
        return [r,g,b, r,g,b, r,g,b, r,g,b, r,g,b, r,g,b, r,g,b, r,g,b, r,g,b, r,g,b, r,g,b, r,g,b]
    }

    getPosition() {
        return [[this.x1, this.y1], [this.x2, this.y1], [this.x1, this.y2], [this.x1, this.y2], [this.x2, this.y1], [this.x2, this.y2]]
    }
    
    updatePositionX() {
        let self = this
        return function (event, ui) {
            self.x1 = ui.value;
            self.x2 = ui.value + self.width;
        };
    }
    updatePositionY() {
        let self = this
        return function (event, ui) {
            self.y1 = ui.value;
            self.y2 = ui.value + self.height;
        };
    }
}