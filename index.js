import { vertex as vertexShaderSource } from './assets/particleShader.vert.js';
import { vertex as fragmentShaderSource } from './assets/particleShader.frag.js';

var numberOfParticles = 1000;
var particles = [];
var gravity = new Vector(0, 0);

function main() {
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

    var positionLocation = gl.getAttribLocation(program, "a_position");
    var texcoordLocation = gl.getAttribLocation(program, "a_texcoord");
    var resolutionLocation = gl.getUniformLocation(program, "u_resolution");

    var positionBuffer = gl.createBuffer();
    var texcoordBuffer = gl.createBuffer();

    var timeElement = document.querySelector("#time");
    var densityElement = document.querySelector("#density");
    
    var timeNode = document.createTextNode("");
    var densityNode = document.createTextNode("");
    
    // Add those text nodes where they need to go
    timeElement.appendChild(timeNode);
    densityElement.appendChild(densityNode);

    for (let i = 0; i < numberOfParticles; i ++) {
        let x = (Math.random() - 0.5) * canvas.width;
        let y = (Math.random() - 0.5) * canvas.height;
        particles.push(new Particle(x, y));
    }

    var then = 0;
 
    requestAnimationFrame(drawScene);
        
    // Draw the scene.
    function drawScene(now) {
        now *= 0.001;
        var deltaTime = now - then;
        then = now;

        /* Do the physics */
        particles.forEach((particle) => {
            particle.applyForce(gravity);
            particle.update();
        })

        resolveCollision(particles, gl.canvas.width, gl.canvas.height);

        /* Rendering */
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        /* Passing uniforms */
        gl.uniform2f(resolutionLocation, gl.canvas.width, gl.canvas.height);

        /* Passing buffers */

        gl.enableVertexAttribArray(texcoordLocation);
        gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
        let quadTexcoords = getRectTexcoord();
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(quadTexcoords), gl.STATIC_DRAW);
        gl.vertexAttribPointer(texcoordLocation, 2, gl.FLOAT, false, 0, 0);

        gl.enableVertexAttribArray(positionLocation);
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        particles.forEach(particle => {
            let quadVertices = getRectVertices(particle.pos.x, particle.pos.y, particle.size, particle.size);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(quadVertices), gl.DYNAMIC_DRAW);
            gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
            gl.drawArrays(gl.TRIANGLES, 0, quadVertices.length / 2);
        });
        
        timeNode.nodeValue = now.toFixed(2);
        let density = CalculateDensity(particles, new Vector(0, 0));
        densityNode.nodeValue = density.toFixed(5);
        
        /* Next frame */
        requestAnimationFrame(drawScene);
    }
}  // end main

main();

