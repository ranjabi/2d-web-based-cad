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



// Fill the buffer with the values that define a rectangle.
function setRectangle(gl, x, y, width, height) {
    var x1 = x;
    var x2 = x + width;
    var y1 = y;
    var y2 = y + height;
    gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([x1, y1, x2, y1, x1, y2, x1, y2, x2, y1, x2, y2]),
        gl.STATIC_DRAW
    );
}



export { createShader, createProgram }