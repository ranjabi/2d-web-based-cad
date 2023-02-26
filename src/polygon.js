import {
    multiplyMatrices,
    decreaseMatrices,
    increaseMatrices,
    hextoRGB,
    RGBtoHex,
} from "./utility.js";
export default class Polygon {
    constructor(...vertices) {
        // vertices is array of 2 number
        this.vertices = vertices
        this.renderedVertices = vertices;
        this.angle = 0;
        this.colors = this.setColor(1,0,0);
        this.deletedCount = 0;
        this.type = "polygon";
        this.indexes = this.setIndexes()
    }
    //https://www.tutorialspoint.com/webgl/webgl_modes_of_drawing.htm , enum from the link
    getPrimitiveType() {
        return 5
    }
    getCount() {
        return this.vertices.length
    }
    setIndexes(){
        let arr = []
        for (let i = 0; i < this.getCount() ; i++){
            arr.push(i)
        }
        return arr
    }
    deleteIndexes(idx){
        console.log(this.indexes)

        let trueidx = this.getIndex(idx)
        console.log(trueidx)
        if (trueidx < 0) return;
        for (let i = trueidx; i < this.indexes.length; i++){
            this.indexes[i] = this.indexes[i+1]
        }
        this.indexes.pop()
        console.log(this.indexes)
    }
    getIndex(idx){
        console.log(idx)
        return this.indexes.indexOf(idx)
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
        return this.renderedVertices
    }

    getAngle() {
        return this.angle;
    }

    updateAngleRotation() {
        let self = this;
        return function (event, newAngle) {
            self.angle = newAngle;
            var angleInDegrees = Number(newAngle.value);
            var angleInRadians = angleInDegrees * (Math.PI / 180);
            
            var sinus = Math.sin(angleInRadians);
            var cosinus = Math.cos(angleInRadians);
            console.log(sinus);
            console.log(cosinus);

            var m1 = [[cosinus, -(sinus)],
                        [sinus, cosinus]];
            var m2 = decreaseMatrices(self.vertices, self.vertices[0][0], self.vertices[0][1]);

            var mRes = multiplyMatrices(m2, m1);
            console.log(m1);
            console.log(m2);
            console.log(mRes);
            mRes = increaseMatrices(mRes, self.vertices[0][0], self.vertices[0][1]);
            console.log(mRes);

            self.renderedVertices = mRes;
            console.log(self.getPosition());
        }
    }


    addVertex(vertex) {
        this.vertices.push(vertex)
        this.addColor(1,0,0)
        let max_index = Math.max(...this.indexes)
        max_index = max_index < 0 ? 0 : max_index + 1
        this.indexes.push(max_index)
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
            },
            {
                sliderID: "rotasi",
                name: "rotasi",
                slideFunction: this.updateAngleRotation(),
                min: 0,
                max: 360,
                value: this.getAngle(),
            }
        ];
    }
    getColorAttr(){
        let slider = [{
            id: "all_color",
            name: "All Vertex Color",
            slideFunction: this.updateColorAll(),
            value: RGBtoHex(this.colors[ 0], this.colors[ 1], this.colors[ 2])
        }];
        this.indexes = this.setIndexes()
        console.log(this.indexes)
        for (let i = 0; i < this.getCount(); i++) {
                slider.push({
                    id: "point_" + i,
                    name: "color point " + i,
                    slideFunction: this.updateColor(i),
                    value: RGBtoHex(this.colors[i*3 + 0], this.colors[i*3 + 1], this.colors[i*3 + 2]),
                    deleteFunction : this.deleteVertex(i)
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
                self.colors[i * 3 + 0] = rgb[0]
                self.colors[i * 3 + 1] = rgb[1]
                self.colors[i * 3 + 2] = rgb[2]
            }
            console.log(self.colors)
        }
    }
    updateColor(pointIndex) {
        let self = this;
        return function (event, newColor) {
            let trueidx = self.getIndex(pointIndex)
            let rgb = hextoRGB(newColor.value)
            if (trueidx < 0 ) return;
            self.colors[trueidx*3 + 0] = rgb[0]
            self.colors[trueidx*3 + 1] = rgb[1]
            self.colors[trueidx*3 + 2] = rgb[2]
        };
    }
    deleteVertex(pointIndex){
        let self = this;
        return function(event){
            let trueidx = self.getIndex(pointIndex)
            if (trueidx >= 0 && trueidx < self.vertices.length){
                for (let i = trueidx; i < self.vertices.length - 1; i++){
                    self.vertices[i] = self.vertices[i+1]
                    self.colors[i*3 + 0] = self.colors[(i+1)*3 + 0]
                    self.colors[i*3 + 1] = self.colors[(i+1)*3 + 1]
                    self.colors[i*3 + 2] = self.colors[(i+1)*3 + 2]

                }
                self.vertices.pop()
                self.colors.pop()
                self.colors.pop()
                self.colors.pop()
                self.deleteIndexes(pointIndex)
                self.deletedCount++
            }
        }
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
            let delta = newCoor.value - self.getX();
            for (let i = 0; i < self.vertices.length; i++) {
                self.vertices[i][0] += delta;
            }
        };
    }
    updatePositionY() {
        let self = this;
        return function (event, newCoor) {
            let delta = newCoor.value - self.getY();
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
