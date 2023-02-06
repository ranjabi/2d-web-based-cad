export default class Rectangle {
    constructor(x, y, width, height) {
        this.x1 = x;
        this.x2 = x + width;
        this.y1 = y;
        this.y2 = y + height;
        this.width = width
        this.height = height
    
    }

    getX() {
        return this.x1
    }

    getY() {
        return this.y1
    }

    getPosition() {
        return [this.x1, this.y1, this.x2, this.y1, this.x1, this.y2, this.x1, this.y2, this.x2, this.y1, this.x2, this.y2]
    }

    updatePositionX() {
        let self = this
        return function (event, ui) {
            console.log("prototype x1", self.x1)
            self.x1 = ui.value;
            self.x2 = ui.value + self.width;
            // this.y1 = ui.value;
            // this.y2 = ui.value + height;
        };
    }
    updatePositionY() {
        let self = this
        return function (event, ui) {
            // this.x1 = ui.value;
            // this.x2 = ui.value + width;
            self.y1 = ui.value;
            self.y2 = ui.value + self.height;
        };
    }
}