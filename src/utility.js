function getRandomColor() {
    // return random color of black, red, yellow, green, blue, magenta, cyan
    let baseColor = 
    [
        {r: 0.0, g: 0.0, b: 0.0}, 
        {r: 1.0, g: 0.0, b: 0.0}, 
        {r: 1.0, g: 1.0, b: 0.0}, 
        {r: 0.0, g: 1.0, b: 0.0}, 
        {r: 0.0, g: 0.0, b: 1.0}, 
        {r: 1.0, g: 0.0, b: 1.0}, 
        {r: 0.0, g: 1.0, b: 1.0}, 
    ]
    return baseColor[Math.floor(Math.random()*baseColor.length)]
}

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
function setupColorPicker(selector, options) {
    let parent = document.getElementById(selector);
    if (!parent) {
        let attr = document.createElement("div");
        attr.setAttribute("id", selector);
        document.querySelector("#properties").appendChild(attr);

        parent = document.getElementById(selector);
    }
    let name = options.name;
    let value = options.value || "#000000";
    parent.innerHTML = `
        <p>${name}</p>
        <input type="color" value="${value}" id="${selector}-input">
        <p id="${selector}-value">${value}</p>
    `

    let colorPicker = document.getElementById(selector + "-input");
    let colorValue = document.getElementById(selector + "-value");

    function updateValue(value) {
        colorValue.textContent = value;
    }

    function handleChange(event) {
        let value = event.target.value;
        updateValue(value);
        options.slideFunction(event, { value: value });
    }

    colorPicker.addEventListener("input", handleChange);
}
function convertToJson(objects){
    console.log(objects);
    let string = JSON.stringify(objects);
    download(string, 'text/json', (new Date()).getTime() + '_objects.json')
}

function convertFromJson(json){
    let objects = JSON.parse(json);
    return objects;
}
function download(content, mimeType, filename){
    const a = document.createElement('a') // Create "a" element
    const blob = new Blob([content], {type: mimeType}) // Create a blob (file-like object)
    const url = URL.createObjectURL(blob) // Create an object URL from blob
    a.setAttribute('href', url) // Set "a" element link
    a.setAttribute('download', filename) // Set download filename
    a.click() // Start downloading
  }
function hextoRGB(hex) {
    let r = 0, g = 0, b = 0;
    let rr = hex.substring(1, 3);
    let gg = hex.substring(3, 5);
    let bb = hex.substring(5, 7);
    r = parseInt(rr, 16);
    g = parseInt(gg, 16);
    b = parseInt(bb, 16);
    return [r / 255, g / 255, b / 255];
}
function RGBtoHex(r, g, b) {
    let rr = (r * 255).toString(16);
    let gg = (g * 255).toString(16);
    let bb = (b * 255).toString(16);
    if (rr.length == 1) rr = "0" + rr;
    if (gg.length == 1) gg = "0" + gg;
    if (bb.length == 1) bb = "0" + bb;
    return "#" + rr + gg + bb;
}
export {
    createShader,
    createProgram,
    resizeCanvasToDisplaySize,
    pixelToClip,
    euclideanDistance,
    setupSlider,
    getRandomColor,
    convertToJson,
    convertFromJson,
    setupColorPicker,
    hextoRGB,
    RGBtoHex
};
