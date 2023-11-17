import { vertex as vertexShaderSource } from './assets/particleShader.vert.js';
import { vertex as fragmentShaderSource } from './assets/particleShader.frag.js';

function main() {

    // Get A WebGL context
    /** @type {HTMLCanvasElement} */
    const canvas = document.querySelector("#c");
    const gl = canvas.getContext("webgl");
    gl.getExtension("OES_standard_derivatives");

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE);

    resizeCanvasToDisplaySize(canvas);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    const vertexShader = compileShader(gl, vertexShaderSource, gl.VERTEX_SHADER);
    const fragmentShader = compileShader(gl, fragmentShaderSource, gl.FRAGMENT_SHADER);
    const program = createProgram(gl, vertexShader, fragmentShader);
    gl.useProgram(program);

    var numberOfParticles = 20;
    var particleSize = 10;
    var positions = [];
    var velocities = [];

    var gravity = 100;
    var boundSize = new Array(gl.canvas.width, gl.canvas.height);
    var collisionDamping = 0.5;
    
    for (let i=0; i<numberOfParticles; i++) {
        let x = (Math.random() - 0.5) * canvas.width;
        let y = (Math.random() - 0.5) * canvas.height;
        positions.push(new Array(x, y));
        velocities.push(new Array(0.0, 0.0));
    }

    var positionLocation = gl.getAttribLocation(program, "a_position");
    var texcoordLocation = gl.getAttribLocation(program, "a_texcoord");
    var resolutionLocation = gl.getUniformLocation(program, "u_resolution");

    var positionBuffer = gl.createBuffer();
    var texcoordBuffer = gl.createBuffer();

    var then = 0;
 
    requestAnimationFrame(drawScene);
        
    // Draw the scene.
    function drawScene(now) {
        now *= 0.001;
        var deltaTime = now - then;
        then = now;

        /* Do the physics */

        for (let i=0; i<numberOfParticles; i++) {
            velocities[i][0] += 0 * deltaTime;
            velocities[i][1] += gravity * deltaTime;
        }

        for (let i=0; i<numberOfParticles; i++) {
            positions[i][0] += velocities[i][0] * deltaTime;
            positions[i][1] += velocities[i][1] * deltaTime;
        }

        for (let i=0; i<numberOfParticles; i++) {
            let halfBoundSizeX = boundSize[0] / 2 - particleSize / 2;

            if (Math.abs(positions[i][0]) > halfBoundSizeX) {
                positions[i][0] = halfBoundSizeX * Math.sign(positions[i][0]);
                velocities[i][0] *= -1 * collisionDamping;
            }

            let halfBoundSizeY = boundSize[1] / 2 - particleSize / 2;

            if (Math.abs(positions[i][1]) > halfBoundSizeY) {
                positions[i][1] = halfBoundSizeY * Math.sign(positions[i][1]);
                velocities[i][1] *= -1 * collisionDamping;
            }
        }

        /* Rendering */
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        /* Passing uniforms */
        gl.uniform2f(resolutionLocation, gl.canvas.width, gl.canvas.height);

        /* Passing buffers */

        positions.forEach((pos) => {
            /* Positions*/
            gl.enableVertexAttribArray(positionLocation);
            gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

            let quadVertices = getRectVertices(pos[0], pos[1], particleSize, particleSize);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(quadVertices), gl.DYNAMIC_DRAW);
            gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

            /* Texcoords */
            gl.enableVertexAttribArray(texcoordLocation);
            gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);

            let quadTexcoords = getRectTexcoord();
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(quadTexcoords), gl.STATIC_DRAW);
            gl.vertexAttribPointer(texcoordLocation, 2, gl.FLOAT, false, 0, 0);

            gl.drawArrays(gl.TRIANGLES, 0, quadVertices.length / 2);
        })    
        
        /* Next frame */
        requestAnimationFrame(drawScene);
    }


}  // end main

main();

