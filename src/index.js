import {
    createShader,
    createProgram,
    euclideanDistance,
    setupSlider,
    resizeCanvasToDisplaySize,
    getRandomColor,
    convertToJson,
    convertFromJson,
    setupColorPicker
} from "./utility.js";
import Rectangle from "./rectangle.js";
import Polygon from "./polygon.js";
import Line from "./line.js";


window.onload = function init() {
    let objects = [];
    let newObjectOffset = 20;
    let onPressMouse = false;
    let closestObject = null;
    let makingPoligon = false;
    let selectedPoligon = null;
    let addingPointtoPolygon = false;
    let canvas = document.querySelector("#canvas");
    let lineBtn = document.getElementById("line-btn");
    let squareBtn = document.getElementById("square-btn");
    let rectangleBtn = document.getElementById("rectangle-btn");
    let polygonBtn = document.getElementById("polygon-btn");
    let stoppolygonBtn = document.getElementById("stop-polygon-btn");
    let loadform = document.getElementById("loadfile");
    let fileinput = document.getElementById("fileinput");
    let savefile = document.getElementById("savefile");
    let addPointbutton = document.getElementById("add-point-polygon-btn");
    let stopAddPointbutton = document.getElementById("stop-add-polygon-btn");

    let file = null;
    fileinput.addEventListener("change", (event) => {
        file = event.target.files[0];
    });
    loadform.addEventListener("submit", (event) => {
        event.preventDefault();
        loadform.reset();
        let fileReader = new FileReader();
        fileReader.onload = (event) => {
            let json = event.target.result;
            let read = convertFromJson(json);
            for (let i = 0; i < read.length; i++){
                console.log(read[i]);
                switch(read[i].type){
                    case 'polygon':
                        let poly = new Polygon();
                        poly.colors = read[i].colors;
                        poly.vertices = read[i].vertices;
                        console.log(poly);
                        objects.push(poly);
                        break;
                    case 'rectangle':
                        let rect = new Rectangle(read[i].x1, read[i].y1, read[i].width, read[i].height, {r: 0, g: 0, b: 0}, read[i].isSquare);
                        rect.color = read[i].color;
                        console.log(rect);
                        objects.push(rect);
                        break;
                    case 'line':
                        let line = new Line(read[i].x1, read[i].y1, read[i].length, {r: 0, g: 0, b: 0});
                        line.color = read[i].color;
                        line.x2 = read[i].x2
                        line.y2 = read[i].y2
                        console.log(line);
                        objects.push(line);
                        break;
                }
            }
        }
        fileReader.readAsText(file);
        drawScene();

        
    });

    savefile.addEventListener("click", (event) => {
        event.preventDefault();
        convertToJson(objects);
    });
        

    let activePolygon = 0;
    
    canvas.addEventListener("mousedown", (event) => {
        onPressMouse = true;
        console.log(objects);
        /**
         * display closest clicked object properties
         */
        if (addingPointtoPolygon) {
            selectedPoligon.addVertex([
                event.clientX - canvas.offsetLeft,
                event.clientY - canvas.offsetTop,
            ])

            return;
        }
        if (makingPoligon) {
            activePolygon.addVertex([
                event.clientX - canvas.offsetLeft,
                event.clientY - canvas.offsetTop,
            ]);
            console.log(activePolygon.getColor());
            return;
        }

        let closestPoint = objects.find((obj) =>
            obj.getPosition().find((pos) => {
                let distance = euclideanDistance(
                    {
                        x: event.clientX - canvas.offsetLeft,
                        y: event.clientY - canvas.offsetTop,
                    },
                    { x: pos[0], y: pos[1] }
                );
                return distance < 20;
            })
        );
        let closestObjectIdx = objects.findIndex((x) => x === closestPoint);

        if (closestObjectIdx !== -1) {
            closestObject = objects[closestObjectIdx];
            let sliderAttr = closestObject.getSliderAttr(canvas);
            let colorAttr = closestObject.getColorAttr();
            let properties = document.querySelector("#properties").innerHTML = "";
            for (let attr of sliderAttr) {
                let { sliderID, ...rest } = attr;
                setupSlider(sliderID, { ...rest });
            }
            if (closestObject.type == 'polygon'){
                addPointbutton.classList.remove("hidden")  
            }
            else {
                addPointbutton.classList.add("hidden")
            }
            for (let attr of colorAttr) {
                console.log(attr);
                let { id, ...rest } = attr;
                setupColorPicker(id, { ...rest });
            }

        } else {
            document.querySelector("#properties").innerHTML = "";
            addPointbutton.classList.add("hidden")
        }

        drawScene();
    });

    canvas.addEventListener("mousemove", (event) => {
        if (makingPoligon) return;
        if (onPressMouse) {
            if (closestObject) {
                closestObject.updateCoor({newX: event.clientX - canvas.offsetLeft, newY:event.clientY - canvas.offsetTop})
            }
        }
    });

    canvas.addEventListener("mouseup", (event) => {
        onPressMouse = false;
        console.log("mouse up");
        console.log("")
    });

    /**
     * setup for object button generator
     */
    lineBtn.addEventListener("click", (event) => {
        let garis = new Line(
            newObjectOffset,
            newObjectOffset,
            50,
            getRandomColor(),
        );
        objects.push(garis);
        newObjectOffset += 30;
    });
    squareBtn.addEventListener("click", (event) => {
        let kotak = new Rectangle(
            newObjectOffset,
            newObjectOffset,
            50,
            50,
            getRandomColor(),
            true
        );
        objects.push(kotak);
        newObjectOffset += 30;
    });
    rectangleBtn.addEventListener("click", (event) => {
        let kotak = new Rectangle(
            newObjectOffset,
            newObjectOffset,
            80,
            50,
            getRandomColor()
        );
        objects.push(kotak);
        newObjectOffset += 30;
    });
    polygonBtn.addEventListener("click", (event) => {
        makingPoligon = true;
        activePolygon = new Polygon();
        objects.push(activePolygon);
        stoppolygonBtn.classList.remove("hidden");
    });
    stoppolygonBtn.addEventListener("click", (event) => {
        makingPoligon = false;
        stoppolygonBtn.classList.add("hidden");
    });


    addPointbutton.addEventListener("click", (event) => {
        addingPointtoPolygon = true
        selectedPoligon = closestObject
        stopAddPointbutton.classList.remove("hidden")
    })

    stopAddPointbutton.addEventListener("click", (event) => {
        addingPointtoPolygon = false
        selectedPoligon = null
        stopAddPointbutton.classList.add("hidden")
    })
    // WebGLRenderingContext
    let gl = canvas.getContext("webgl");
    if (!gl) {
        console.log("webgl is not available");
    }

    let vertexShaderSource = document.querySelector("#vertex-shader-2d").text;
    let fragmentShaderSource = document.querySelector(
        "#fragment-shader-2d"
    ).text;

    let vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    let fragmentShader = createShader(
        gl,
        gl.FRAGMENT_SHADER,
        fragmentShaderSource
    );

    let program = createProgram(gl, vertexShader, fragmentShader);

    // let kotak3 = new Polygon([10, 10], [20, 30], [40, 40], [10, 40]);
    // let kotak4 = new Polygon([-0.4, -0.7], [-0.6, -0.5], [-0.8, -0.9], [-0.5, -0.6],  [-0.1,-0.6]);

    // objects.push(kotak3);
    // objects.push(kotak4);

    drawScene();

    function drawScene() {
        // console.log("canvas", canvas)
        resizeCanvasToDisplaySize(gl.canvas);

        // convert clip space to pixel
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

        // clear the canvas
        gl.clear(gl.COLOR_BUFFER_BIT);

        // load shader program
        gl.useProgram(program);

        let resolutionUniformLocation = gl.getUniformLocation(
            program,
            "u_resolution"
        );
        // set the resolution
        gl.uniform2f(
            resolutionUniformLocation,
            gl.canvas.width,
            gl.canvas.height
        );

        // turn [[x1,y1],[x2,y2]] into [x1,y1,x2,y2]
        let objectsPosition = objects.flatMap((obj) => {
            return obj.getPosition();
        });

        let flattenVertexPosition = objectsPosition.flatMap((obj) => obj);
        // turn [r,g,b][r,g,b] to [r,g,b,r,g,b]
        let colorPosition = objects.flatMap((obj) => obj.getColor());
        // console.log("color", colorPosition); 

        // COLOR BUFFER
        let colorBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
        gl.bufferData(
            gl.ARRAY_BUFFER,
            new Float32Array(colorPosition),
            gl.STATIC_DRAW
        );

        // COLOR POSITION
        let vColor = gl.getAttribLocation(program, "vColor");
        gl.vertexAttribPointer(vColor, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(vColor);

        // VERTEX BUFFER
        let vertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer); // bind resource to bind point
        gl.bufferData(
            gl.ARRAY_BUFFER,
            new Float32Array(flattenVertexPosition),
            gl.STATIC_DRAW
        );

        // VERTEX POSITION
        let positionAttributeLocation = gl.getAttribLocation(
            program,
            "a_position"
        );

        // attribute properties
        gl.vertexAttribPointer(
            positionAttributeLocation,
            2,
            gl.FLOAT,
            false,
            0,
            0
        );
        gl.enableVertexAttribArray(positionAttributeLocation);

        let offset = 0;
        for (let obj of objects) {
            let primitiveType = obj.getPrimitiveType();
            let count = obj.getCount();
            if (count == 0 && !makingPoligon) {
                objects.splice(objects.indexOf(obj), 1)
                continue;
            }
            gl.drawArrays(gl.POINTS, offset, count);
            gl.drawArrays(primitiveType, offset, count);
            offset += count;
        }

        window.requestAnimationFrame(drawScene);
    }
};
