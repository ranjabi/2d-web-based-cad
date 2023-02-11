// create a shader, upload the glsl source, compile the shader
function createShader(gl, type, source) {
    let shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    let success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (success) {
        console.log("shader success\n");
        return shader;
    }

    console.log("shader creation fail\n", gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
}

// link vertex shader and fragment shader into a shader program
function createProgram(gl, vertexShader, fragmentShader) {
    let program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    let success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (success) {
        console.log("program success\n");
        return program;
    }

    console.log(
        "program shader creation fail\n",
        gl.getProgramInfoLog(program)
    );
    gl.deleteProgram(program);
}

function resizeCanvasToDisplaySize(canvas) {
    if (canvas) {
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
}

function pixelToClip(point, canvasSize) {
    return (point / canvasSize) * 2 - 1;
}

function euclideanDistance(point1, point2) {
    return Math.sqrt(
        Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2)
    );
}

function setupSlider(selector, options) {
    let parent = document.getElementById(selector);

    if (!parent) {
        let attr = document.createElement("div");
        attr.setAttribute("id", selector);
        document.querySelector("#properties").appendChild(attr);

        parent = document.getElementById(selector);
    }

    let name = options.name;
    let min = options.min || 0;
    let max = options.max || 100;
    let value = options.value || 0;
    let step = options.step || 1;
    let selectorInput = selector + "input";
    let selectorValue = selector + "value";
    let slideFunction = options.slideFunction;

    parent.innerHTML = `
    <p>${name}</p>
    <input type="range" min="${min}" max="${max}" value="${value}" id="${selectorInput}" step="${step}">
    <p id="${selectorValue}">${value}</p>
    `;

    let slider = document.getElementById(selectorInput);
    let sliderValue = document.getElementById(selectorValue);

    function updateValue(value) {
        sliderValue.textContent = value;
    }

    function handleChange(event) {
        let value = parseFloat(event.target.value);
        updateValue(value);
        slideFunction(event, { value: value });
    }

    slider.addEventListener("input", handleChange);
}

export {
    createShader,
    createProgram,
    resizeCanvasToDisplaySize,
    pixelToClip,
    euclideanDistance,
    setupSlider,
};
