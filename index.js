import { createShader, createProgram } from "./utility.js";
import Rectangle from "./rectangleClass.js";

function resizeCanvasToDisplaySize(canvas) {
    const displayWidth = canvas.clientWidth;
    const displayHeight = canvas.clientHeight;

    const needResize =
        canvas.width !== displayWidth || canvas.height !== displayHeight;

    if (needResize) {
        canvas.width = displayWidth;
        canvas.height = displayHeight;
    }

    return needResize;
}

let objects = [];

function main() {
    let canvas = document.querySelector("#canvas");

    canvas.addEventListener("mousedown", (event) => {
        console.log("down", event.clientX, event.clientY, canvas.clientWidth, canvas.clientHeight, canvas.offsetLeft, canvas.offsetTop)
        

        // objects.push(new Rectangle(event.clientX, event.clientY, 40, 40))

        // console.log("all vertex", objects.flatMap(obj => obj.getPosition()))

        // TODO: ganti jadi euclidean distance
        let closestPoint = objects.find(obj => obj.getPosition().find(pos => Math.abs(event.clientX-pos[0])<15 || Math.abs(event.clientY-pos[1])<15))


        let objectIdx = objects.findIndex(x => x === closestPoint)
        console.log("objectIdx", objectIdx)
        if (objectIdx !== -1) {
            setupSlider("#prop1", {
                name: "x",
                slideFunction: objects[objectIdx].updatePositionX(),
                max: gl.canvas.width,
                value: objects[objectIdx].getX()
            });
            setupSlider("#prop2", {
                name: "y",
                slideFunction: objects[objectIdx].updatePositionY(),
                max: gl.canvas.height,
                value: objects[objectIdx].getY()
            });
        } else {
            let parent = document.querySelector("#prop1");
            parent.innerHTML = ""
            let parent2 = document.querySelector("#prop2");
            parent2.innerHTML = ""
        }
        

        console.log("titik terdekat\n", closestPoint
            
        )

        drawScene()
    })

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

    let positionAttributeLocation = gl.getAttribLocation(program, "a_position");
    // look up uniform locations
    let resolutionUniformLocation = gl.getUniformLocation(
        program,
        "u_resolution"
    );
    let colorUniformLocation = gl.getUniformLocation(program, "u_color");
    let positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer); // bind resource to bind point

    let translation = [0, 0];

    // set rectangle
    let kotak = new Rectangle(translation[0], translation[1], 40, 40)

    let kotak2 = new Rectangle(translation[0]+100, translation[1]+100, 40, 40)

    objects.push(kotak)
    objects.push(kotak2)

    // console.log("objects", objects.length)


    
    drawScene();

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
        <input type="range" min="${min}" max="${max}" value="${value}" id="${selectorInput}">
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

        // let sliderFunction = updatePosition(0);

        function handleChange(event) {
            console.log("event", event);
            let value = parseInt(event.target.value);
            updateValue(value);
            slideFunction(event, { value: value });
        }

        // slider.addEventListener("change", handleChange);
        slider.addEventListener("input", handleChange);
    }

    let isOne = true

    // let changeObject = document.querySelector("#changeObject")
    // changeObject.addEventListener("click", () => {
    //     let objNum = 0;
    //     if (isOne == true) {
    //         isOne = !isOne
    //     } else {
    //         objNum = 1
    //         isOne = !isOne
    //     }
    //     setupSlider("#prop1", {
    //         name: "x",
    //         slideFunction: objects[objNum].updatePositionX(),
    //         max: gl.canvas.width,
    //         value: objects[objNum].getX()
    //     });
    //     setupSlider("#prop2", {
    //         name: "y",
    //         slideFunction: objects[objNum].updatePositionY(),
    //         max: gl.canvas.height,
    //         value: objects[objNum].getY()
    //     });
    // })

    function drawScene() {
        resizeCanvasToDisplaySize(gl.canvas);

        // convert clip space to pixel
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

        // clear the canvas
        gl.clear(gl.COLOR_BUFFER_BIT);

        // load shader program
        gl.useProgram(program);

        // turn on the attribute
        gl.enableVertexAttribArray(positionAttributeLocation);

        // bind position buffer
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

        let objectsPosition = objects.flatMap(obj => obj.getPosition())
        let positionx = objectsPosition.flatMap(obj => obj)
        // console.log("objectsposition", positionx)

        gl.bufferData(
            gl.ARRAY_BUFFER,
            new Float32Array(positionx),
            gl.STATIC_DRAW
        );
        // setRectangle(gl, translation[0], translation[1], 40, 40);

        // attribute properties
        let size = 2; // 2 components per iteration from a_position
        let type = gl.FLOAT;
        let normalize = false;
        let stride = 0;
        let attrOffset = 0;
        gl.vertexAttribPointer(
            positionAttributeLocation,
            size,
            type,
            normalize,
            stride,
            attrOffset
        );

        // set the resolution
        gl.uniform2f(
            resolutionUniformLocation,
            gl.canvas.width,
            gl.canvas.height
        );

        // NEED TO EVALUATE
        // Set a random color.
        gl.uniform4f(colorUniformLocation, 0.5, 0.5, 0.5, 1);

        // Draw the rectangle.
        var primitiveType = gl.TRIANGLES;
        var offset = 0;
        // FOR TWO OBJECT
        var count = positionx.length/2;
        gl.drawArrays(primitiveType, offset, count);

        // console.log("object position length\n", objectsPosition.length, "objects length\n", objects.length)

        // window.requestAnimationFrame(drawScene);
    }

    


}

main();
