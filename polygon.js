export default class Polygon {
    constructor(...vertices) {
        // vertices is array of 2 number
        this.vertices = vertices
    }
    //https://www.tutorialspoint.com/webgl/webgl_modes_of_drawing.htm , enum from the link
    getPrimitiveType() {
        return 6
    }
    getCount() {
        return this.vertices.length
    }
    // TODO: SET OBJECT COLOR FROM CONSTRUCTOR AND CREATE SET FUNCTION TO CHANGE OBJECT COLOR
    getColor(r,g,b) {
        return [r,g,b, r,g,b, r,g,b, r,g,b, r,g,b, r,g,b, r,g,b, r,g,b, r,g,b, r,g,b, r,g,b, r,g,b]
    }

    getPosition() {
        return this.vertices
    }
}
