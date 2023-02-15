export default class Vertice {
    constructor(id, x, y, color) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.color = this.setColor(color);
    }

    getCount() {
        //count banyak yang akan di render
        return 1;
    }

    getPrimitiveType() {
        // GL.POINTS
        return 0;
    }

    getX() {
        return this.x;
    }

    getY() {
        return this.y;
    }

    // TODO: SET OBJECT COLOR FROM CONSTRUCTOR AND CREATE SET FUNCTION TO CHANGE OBJECT COLOR
    setColor({ r, g, b }) {
        return [r,g,b, r,g,b, r,g,b, r,g,b, r,g,b, r,g,b, r,g,b, r,g,b, r,g,b, r,g,b, r,g,b, r,g,b]
    }

    getColor() {
        return this.color;
    }

    getPosition() {
        return [this.x, this.y];
    }

    // TODO: update position
}