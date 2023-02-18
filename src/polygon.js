export default class Polygon {
    constructor(...vertices) {
        // vertices is array of 2 number
        this.vertices = vertices
        this.colors = this.setColor(1,0,0);
        this.type = "polygon";
    }
    //https://www.tutorialspoint.com/webgl/webgl_modes_of_drawing.htm , enum from the link
    getPrimitiveType() {
        return 5
    }
    getCount() {
        return this.vertices.length
    }
    // TODO: SET OBJECT COLOR FROM CONSTRUCTOR AND CREATE SET FUNCTION TO CHANGE OBJECT COLOR
    setColor(r,g,b) {
        let color = []
        for(let i = 0; i < this.getCount(); i++){
            color.push(r,g,b)
        }
        return color
    }
    getColor() {
        return this.colors
    }

    getPosition() {
        return this.vertices
    }
    addVertex(vertex) {
        this.vertices.push(vertex)
        this.addColor(1,0,0)
    }
    addColor(r,g,b) {
        this.colors.push(r,g,b)
    }

    getSliderAttr(canvas) {
        return [
            {
                sliderID: "x-position",
                name: "x",
                slideFunction: this.updatePositionX(),
                min: 0,
                max: canvas.clientWidth,
                value: this.getX(),
            },
            {
                sliderID: "y",
                name: "y position",
                slideFunction: this.updatePositionY(),
                min: 0,
                max: canvas.clientHeight ,
                value: this.getY(),
            }
        ];
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
    updateColor(type, pointIndex) {
        let self = this;
        return function (event, newColor) {
            self.colors[pointIndex*3 + type] = newColor.value
        };
    }
    getX() {
        return this.getLeftestPoint()[0];
    }
    getY() {
        return this.getHighestPoint()[1];
    }
    updatePositionX() {
        let self = this;
        return function (event, newCoor) {
            console.log(newCoor.value, self.getX())
            let delta = newCoor.value - self.getX();
            console.log(delta)
            for (let i = 0; i < self.vertices.length; i++) {
                self.vertices[i][0] += delta;
            }
        };
    }
    updatePositionY() {
        let self = this;
        return function (event, newCoor) {
            console.log(newCoor.value, self.getX())
            let delta = newCoor.value - self.getY();
            console.log(delta)
            for (let i = 0; i < self.vertices.length; i++) {

                self.vertices[i][1] += delta;
            }
        };
    }
    getLeftestPoint(){
        let leftest = this.vertices[0]
        for(let i = 1; i < this.vertices.length; i++){
            if(this.vertices[i][0] < leftest[0]){
                leftest = this.vertices[i]
            }
        }
        return leftest
    }
    getRightestPoint(){
        let rightest = this.vertices[0]
        for(let i = 1; i < this.vertices.length; i++){
            if(this.vertices[i][0] > rightest[0]){
                rightest = this.vertices[i]
            }
        }
        return rightest
    }
    getHighestPoint(){
        let highest = this.vertices[0]
        for(let i = 1; i < this.vertices.length; i++){
            if(this.vertices[i][1] < highest[1]){
                highest = this.vertices[i]
            }
        }
        return highest
    }
    getLowestPoint(){
        let lowest = this.vertices[0]
        for(let i = 1; i < this.vertices.length; i++){
            if(this.vertices[i][1] > lowest[1]){
                lowest = this.vertices[i]
            }
        }
        return lowest
    }

    updateCoor({ newX, newY }) {
        // find the closest point 
        let closestPoint = this.vertices[0]
        let distance = 9999
        for (let i = 1; i < this.vertices.length; i++) {
            let Currdistance = Math.sqrt(
                Math.pow(this.vertices[i][0] - newX, 2) + Math.pow(this.vertices[i][1] - newY, 2)
            );
            if (distance > Currdistance) {
                closestPoint = this.vertices[i]
                distance = Currdistance
            }
        }
        if (distance < 20) {
            closestPoint[0] = newX
            closestPoint[1] = newY
        }
    }
}
