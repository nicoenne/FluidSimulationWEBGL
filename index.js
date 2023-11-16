import { vertex as vertexShaderSource } from './assets/particleShader.vert.js';
import { vertex as fragmentShaderSource } from './assets/particleShader.frag.js';

function main() {

    // Get A WebGL context
    /** @type {HTMLCanvasElement} */
    const canvas = document.querySelector("#c");
    const gl = canvas.getContext("webgl");
    if (!gl) {
    return;
    }
    resizeCanvasToDisplaySize(canvas);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    const vertexShader = compileShader(gl, vertexShaderSource, gl.VERTEX_SHADER);
    const fragmentShader = compileShader(gl, fragmentShaderSource, gl.FRAGMENT_SHADER);
    const program = createProgram(gl, vertexShader, fragmentShader);

    var numberOfParticles = 5;
    var positions = [];
    var velocities = [];

    
    for (let i=0; i<numberOfParticles; i++) {
        let x = Math.random() * canvas.width;
        let y = Math.random() * canvas.height;
        positions.push(new Array(x, y));
    }
    
    for (let i=0; i<numberOfParticles; i++) {
        velocities.push(new Array(0.0, 0.0));
    }

    var positionAttributeLocation = gl.getAttribLocation(program, "a_position");
    var resolutionLocation = gl.getUniformLocation(program, "u_resolution");

    var positionBuffer = gl.createBuffer();

    var then = 0;
 
    requestAnimationFrame(drawScene);
        
    // Draw the scene.
    function drawScene(now) {
        now *= 0.001;
        var deltaTime = now - then;
        then = now;

        /* Do the physics */
        for (let i=0; i<numberOfParticles; i++) {
            positions[i][0] += velocities[i][0] * deltaTime;
            positions[i][1] += velocities[i][1] * deltaTime;
        }

        /* Rendering */
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.useProgram(program);

        /* Passing uniforms */
        gl.uniform2f(resolutionLocation, gl.canvas.width, gl.canvas.height);

        /* Passing buffers */

        let quads = []
        for (let pos of positions) {
            quads.push(getRectVertices(pos[0], pos[1], 50, 50));
        }
        quads = quads.flat()

        gl.enableVertexAttribArray(positionAttributeLocation);
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(quads), gl.DYNAMIC_DRAW);
        gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

        /* Drawing */
        gl.drawArrays(gl.TRIANGLES, 0, quads.length / 2);
        
        /* Next frame */
        requestAnimationFrame(drawScene);
    }


}  // end main
main();

