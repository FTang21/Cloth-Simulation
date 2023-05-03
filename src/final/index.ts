import { Vec3 } from "../lib/TSM.js";
import { initializeCanvas } from "./App.js";
import { MassSpring } from "./MassSpring.js";
import { Particle } from "./Particle.js";


// const canvas = document.getElementById('glCanvas') as HTMLCanvasElement;
// const gl = canvas.getContext('webgl') as WebGL2RenderingContext;
// let anchorParticle = new Particle(0.5, 0.5, 0, 0.1, true);
// let springParticle = new Particle(0, 0, 0, 0.1, false);
// let massSpring = new MassSpring([anchorParticle, springParticle])
// const vertexBuffer = gl.createBuffer() as WebGLBuffer;
// gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
// gl.bufferData(gl.ARRAY_BUFFER, massSpring.getPositions(), gl.STATIC_DRAW);

// // Create a vertex shader
// const vertexShaderSource = `
//   attribute vec3 position;
//   void main() {
//     gl_Position = vec4(position, 1.0);
//     gl_PointSize = 5.0;
//   }
// `;
// const vertexShader = gl.createShader(gl.VERTEX_SHADER) as WebGLShader;
// gl.shaderSource(vertexShader, vertexShaderSource);
// gl.compileShader(vertexShader);

// // Create a fragment shader
// const fragmentShaderSource = `
//   void main() {
//     gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
//   }
// `;
// const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER) as WebGLShader;
// gl.shaderSource(fragmentShader, fragmentShaderSource);
// gl.compileShader(fragmentShader);

// // Create a program to link the shaders
// const program = gl.createProgram() as WebGLProgram;
// gl.attachShader(program, vertexShader);
// gl.attachShader(program, fragmentShader);
// gl.linkProgram(program);

// // Use the program and buffer to render the points and line
// gl.useProgram(program);
// gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
// const positionAttributeLocation = gl.getAttribLocation(program, 'position');
// gl.enableVertexAttribArray(positionAttributeLocation);
// gl.vertexAttribPointer(positionAttributeLocation, 4, gl.FLOAT, false, 0, 0);

// // Clear the canvas and draw the line
// function simulateMassSpringSystem() {
//     massSpring.update();
//     gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
//     gl.bufferData(gl.ARRAY_BUFFER, massSpring.getPositions(), gl.STATIC_DRAW);
//     gl.clearColor(1, 1, 1, 1);
//     gl.clear(gl.COLOR_BUFFER_BIT);
//     gl.drawArrays(gl.LINE_STRIP, 0, 2)
//     gl.drawArrays(gl.LINES, 0, 2);
//     requestAnimationFrame(simulateMassSpringSystem);
// }
// simulateMassSpringSystem();

initializeCanvas();
