import {
    createShader,
    createProgram,
    resizeCanvasToDisplaySize,
} from "./utility.js";
import Rectangle from "./rectangleClass.js";

function main() {
    let objects = [];

    let canvas = document.querySelector("#canvas");

    canvas.addEventListener("mousedown", (event) => {
        // console.log(
        //     "down",
        //     event.clientX,
        //     event.clientY,
        //     canvas.clientWidth,
        //     canvas.clientHeight,
        //     canvas.offsetLeft,
        //     canvas.offsetTop
        // );

        // console.log(
        //     "x, y",
        //     pixelToClip(event.clientX),
        //     pixelToClip(event.clientY)
        // );

        // TODO: ganti jadi euclidean distance
        let closestPoint = objects.find(obj => obj.getPosition().find(pos => Math.abs(event.clientX-pos[0])<15 || Math.abs(event.clientY-pos[1])<15))

        let objectIdx = objects.findIndex((x) => x === closestPoint);

        if (objectIdx !== -1) {
            // if object exist in closest clicked point, display slider
            setupSlider("#prop1", {
                name: "x",
                slideFunction: objects[objectIdx].updatePositionX(),
                min: -1,
                max: 1,
                value: objects[objectIdx].getX(),
            });
            setupSlider("#prop2", {
                name: "y",
                slideFunction: objects[objectIdx].updatePositionY(),
                min: -1,
                max: 1,
                value: objects[objectIdx].getY(),
            });
        } else {
            let parent = document.querySelector("#prop1");
            parent.innerHTML = "";
            let parent2 = document.querySelector("#prop2");
            parent2.innerHTML = "";
        }

        // console.log("titik terdekat\n", closestPoint);

        drawScene();
    });

    // WebGLRenderingContext
    let gl = canvas.getContext("webgl");
    console.log("width", gl.canvas.width);
    console.log("height", gl.canvas.height);
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

    // set rectangle
    let kotak = new Rectangle(0.5, 0.5, 0.3, 0.3);

    let kotak2 = new Rectangle(0.1, 0.1, 0.3, 0.3);

    objects.push(kotak);
    objects.push(kotak2);

    // console.log("objects", objects.length)

    drawScene();

    function drawScene() {
        resizeCanvasToDisplaySize(gl.canvas);

        // convert clip space to pixel
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

        // clear the canvas
        gl.clear(gl.COLOR_BUFFER_BIT);

        // load shader program
        gl.useProgram(program);

        // turn [[x1,y1],[x2,y2]] into [x1,y1,x2,y2]
        let objectsPosition = objects.flatMap((obj) => obj.getPosition());
        let vPosition = objectsPosition.flatMap((obj) => obj);

        // turn [r,g,b][r,g,b] to [r,g,b,r,g,b]
        // set red color
        // TODO: SET OBJECT COLOR RANDOMLY
        let colorPosition = objects.flatMap((obj) => obj.getColor(1, 0, 0));

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
            new Float32Array(vPosition),
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

        // Draw the rectangle.
        var primitiveType = gl.TRIANGLES;
        var offset = 0;

        // FOR TWO OBJECT
        var count = vPosition.length / 2;
        gl.drawArrays(primitiveType, offset, count);

        // console.log("object position length\n", objectsPosition.length, "objects length\n", objects.length)

        window.requestAnimationFrame(drawScene);
    }

    function setupSlider(selector, options) {
        let parent = document.querySelector(selector);
        if (!selector) {
            console.log("selector not found");
            return;
        }

        let name = options.name;
        let min = options.min || 0;
        let max = options.max || 100;
        let value = options.value || 0;
        let selectorInput = selector.slice(1) + "input";
        let selectorValue = selector.slice(1) + "value";
        let slideFunction = options.slideFunction;
        console.log("selector", selectorInput, selectorValue);
        parent.innerHTML = `
        <p>${options.name}</p>
        <input type="range" min="${min}" max="${max}" value="${value}" id="${selectorInput}" step="0.1">
        <p id="${selectorValue}">${value}</p>
        `;

        /*
         * SETUP SLIDER
         */
        let slider = document.querySelector("#" + selectorInput);
        console.log("slider", slider);
        let sliderValue = document.querySelector("#" + selectorValue);

        function updateValue(value) {
            sliderValue.textContent = value;
            drawScene();
        }

        function handleChange(event) {
            let value = parseFloat(event.target.value);
            updateValue(value);
            slideFunction(event, { value: value });
        }

        slider.addEventListener("input", handleChange);
    }
}

main();
