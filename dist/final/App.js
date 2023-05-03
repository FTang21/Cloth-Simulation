import { Debugger } from "../lib/webglutils/Debugging.js";
import { CanvasAnimation } from "../lib/webglutils/CanvasAnimation.js";
import { GUI } from "./Gui.js";
import { blankCubeFSText, blankCubeVSText, massSpringFSText, massSpringVSText, sphereFSText, sphereVSText } from "./Shaders.js";
import { Vec4 } from "../lib/TSM.js";
import { RenderPass } from "../lib/webglutils/RenderPass.js";
import { Cube } from "./Cube.js";
import { MassSpring } from "./MassSpring.js";
import { Particle } from "./Particle.js";
import { Spring } from "./Spring.js";
import { Sphere } from "./Sphere.js";
export class MassSpringAnimation extends CanvasAnimation {
    constructor(canvas) {
        super(canvas);
        this.temp = 2;
        this.canvas2d = document.getElementById("textCanvas");
        this.ctx = Debugger.makeDebugContext(this.ctx);
        let gl = this.ctx;
        this.gui = new GUI(this.canvas2d, this);
        this.playerPosition = this.gui.getCamera().pos();
        this.updateSituations();
        this.resetButton = document.getElementById("resetButton");
        this.resetButton.addEventListener("click", () => this.reset());
        this.updateForces();
        this.updateOthers();
        this.initSystem();
        this.MassSpringRenderPass = new RenderPass(gl, massSpringVSText, massSpringFSText);
        this.initMassSpring();
        this.updateObjects();
        this.lightPosition = new Vec4([-10, 10, -10, 1]);
        this.backgroundColor = new Vec4([0.0, 0.37254903, 0.37254903, 1.0]);
    }
    /**
     * Setup the simulation. This can be called again to reset the program.
     */
    reset() {
        this.gui.reset();
        this.playerPosition = this.gui.getCamera().pos();
        this.updateSituations();
        this.updateForces();
        this.updateOthers();
        this.initSystem();
        this.updateObjects();
        this.initMassSpring();
    }
    updateForces() {
        let checkbox = document.getElementById("gravityCheck");
        let form = document.getElementById("gravityForm");
        this.isGravity = checkbox.checked;
        this.gravity = !this.isGravity || Number.isNaN(Number(form.value)) ? 0 : Number(form.value);
        form.value = String(this.gravity);
        checkbox = document.getElementById("windCheck");
        form = document.getElementById("windForm");
        this.isWind = checkbox.checked;
        this.windSpeed = !this.isWind || Number.isNaN(Number(form.value)) ? 0 : Number(form.value);
        form.value = String(this.windSpeed);
        checkbox = document.getElementById("dampCheck");
        form = document.getElementById("dampForm");
        this.isDamp = checkbox.checked;
        this.damping = !this.isDamp || Number.isNaN(Number(form.value)) ? 0.01 : Number(form.value);
        if (this.damping <= 0.01) {
            this.damping = 0.01;
            form.value = String(0);
        }
        else if (this.damping > 1) {
            this.damping = 1;
            form.value = String(this.damping);
        }
        checkbox = document.getElementById("Shear");
        this.isShear = checkbox.checked;
        checkbox = document.getElementById("Bend");
        this.isBend = checkbox.checked;
        form = document.getElementById("Stiffness");
        this.stiffness = Number.isNaN(Number(form.value)) ? 0 : Number(form.value);
        form.value = String(this.stiffness);
    }
    updateObjects() {
        let gl = this.ctx;
        let checkbox = document.getElementById("sphereCheck");
        this.isSphere = checkbox.checked;
        let form = document.getElementById("sphereX");
        let x = Number.isNaN(Number(form.value)) ? 0 : Number(form.value);
        form.value = String(x);
        form = document.getElementById("sphereY");
        let y = Number.isNaN(Number(form.value)) ? 0 : Number(form.value);
        form.value = String(y);
        form = document.getElementById("sphereZ");
        let z = Number.isNaN(Number(form.value)) ? 0 : Number(form.value);
        form.value = String(z);
        form = document.getElementById("sphereR");
        let r = Number.isNaN(Number(form.value)) ? 0 : Number(form.value);
        if (r < 0) {
            r = 0;
        }
        form.value = String(r);
        if (this.isSphere) {
            this.sphere = new Sphere(new Vec4([x, y, z, 1]), r);
            this.sphereRenderPass = new RenderPass(gl, sphereVSText, sphereFSText);
            this.initSphere();
        }
        checkbox = document.getElementById("cubeCheck");
        this.isCube = checkbox.checked;
        form = document.getElementById("cubeX");
        x = Number.isNaN(Number(form.value)) ? 0 : Number(form.value);
        form.value = String(x);
        form = document.getElementById("cubeY");
        y = Number.isNaN(Number(form.value)) ? 0 : Number(form.value);
        form.value = String(y);
        form = document.getElementById("cubeZ");
        z = Number.isNaN(Number(form.value)) ? 0 : Number(form.value);
        form.value = String(z);
        form = document.getElementById("cubeL");
        let l = Number.isNaN(Number(form.value)) ? 0 : Number(form.value);
        if (l < 0) {
            l = 0;
        }
        form.value = String(l);
        if (this.isCube) {
            this.blankCubeRenderPass = new RenderPass(gl, blankCubeVSText, blankCubeFSText);
            this.cubeCenter = new Vec4([x, y, z, 0.0]);
            this.cubeLength = l;
            this.cubeGeometry = new Cube(l);
            this.initBlankCube();
        }
    }
    updateOthers() {
        let form = document.getElementById("mass");
        this.mass = Number.isNaN(Number(form.value)) ? 0 : Number(form.value);
        if (this.mass < 0) {
            this.mass = 0;
        }
        form.value = String(this.mass);
        form = document.getElementById("numPartX");
        this.numParticlesX = Number.isNaN(Number(form.value)) ? 0 : Number(form.value);
        if (this.numParticlesX < 0) {
            this.numParticlesX = 0;
        }
        form.value = String(this.numParticlesX);
        form = document.getElementById("numPartY");
        this.numParticlesY = Number.isNaN(Number(form.value)) ? 0 : Number(form.value);
        if (this.numParticlesY < 0) {
            this.numParticlesY = 0;
        }
        form.value = String(this.numParticlesY);
        form = document.getElementById("spacing");
        this.spacing = Number.isNaN(Number(form.value)) ? 0 : Number(form.value);
        if (this.spacing < 0) {
            this.spacing = 0;
        }
        form.value = String(this.spacing);
        form = document.getElementById("timeStep");
        this.timeStep = Number.isNaN(Number(form.value)) ? 0 : Number(form.value);
        if (this.timeStep < 0) {
            this.timeStep = 0;
        }
        form.value = String(this.timeStep);
    }
    initSystem() {
        let particles = [];
        let springs = [];
        let startX = -this.numParticlesX * this.spacing * 0.5;
        let startY = -this.numParticlesY * this.spacing * 0.5;
        for (let i = 0; i < this.numParticlesX; i++) {
            particles.push([]);
            for (let j = 0; j < this.numParticlesY; j++) {
                let particle;
                console.log(this.situation);
                if (this.situation == "falling") {
                    particle = new Particle(startX + i * this.spacing, 0, startY + j * this.spacing, this.mass, false, this.damping);
                }
                else if (this.situation == "hammock") {
                    particle = new Particle(startX + i * this.spacing, 0, startY + j * this.spacing, this.mass, (i == 0 || i == this.numParticlesX - 1) && (j == 0 || j == this.numParticlesY - 1), this.damping);
                }
                else if (this.situation == "twoanchor") {
                    particle = new Particle(startX + i * this.spacing, startY + j * this.spacing, 0, this.mass, (i == 0 || i == this.numParticlesX - 1) && j == this.numParticlesY - 1, this.damping);
                }
                else {
                    particle = new Particle(startX + i * this.spacing, startY + j * this.spacing, 0, this.mass, j == this.numParticlesY - 1, this.damping);
                }
                particles[i].push(particle);
                // structural forces
                if (i != 0) {
                    springs.push(new Spring(particles[i][j], particles[i - 1][j], this.stiffness));
                }
                if (j != 0) {
                    springs.push(new Spring(particles[i][j], particles[i][j - 1], this.stiffness));
                }
                // shear forces
                if (this.isShear) {
                    if (i != 0 && j != 0) {
                        springs.push(new Spring(particles[i][j], particles[i - 1][j - 1], this.stiffness));
                    }
                    if (i != 0 && j != this.numParticlesY - 1) {
                        springs.push(new Spring(particles[i - 1][j + 1], particles[i][j], this.stiffness));
                    }
                }
                // bending forces
                if (this.isBend) {
                    if (i >= 2) {
                        springs.push(new Spring(particles[i][j], particles[i - 2][j], this.stiffness));
                    }
                    if (j >= 2) {
                        springs.push(new Spring(particles[i][j], particles[i][j - 2], this.stiffness));
                    }
                    if (i >= 2 && j >= 2) {
                        springs.push(new Spring(particles[i][j], particles[i - 2][j - 2], this.stiffness));
                    }
                    if (i >= 2 && j < this.numParticlesY - 2) {
                        springs.push(new Spring(particles[i - 2][j + 2], particles[i][j], this.stiffness));
                    }
                }
            }
        }
        this.massSpring = new MassSpring(particles, springs, this.gravity, this.windSpeed, this.timeStep);
    }
    updateSituations() {
        let getSelectedValue = document.querySelector('input[name="situation"]:checked');
        console.log(getSelectedValue.value == "clothesline");
        this.situation = getSelectedValue.value;
    }
    initMassSpring() {
        this.MassSpringRenderPass.setIndexBufferData(this.massSpring.indicesFlat());
        this.MassSpringRenderPass.addAttribute("aVertPos", 4, this.ctx.FLOAT, false, 4 * Float32Array.BYTES_PER_ELEMENT, 0, undefined, this.massSpring.positionsFlat());
        this.MassSpringRenderPass.addAttribute("aNorm", 4, this.ctx.FLOAT, false, 4 * Float32Array.BYTES_PER_ELEMENT, 0, undefined, this.massSpring.normalsFlat());
        this.MassSpringRenderPass.addInstancedAttribute("aOffset", 4, this.ctx.FLOAT, false, 4 * Float32Array.BYTES_PER_ELEMENT, 0, undefined, new Float32Array(0));
        this.MassSpringRenderPass.addUniform("uLightPos", (gl, loc) => {
            gl.uniform4fv(loc, this.lightPosition.xyzw);
        });
        this.MassSpringRenderPass.addUniform("uProj", (gl, loc) => {
            gl.uniformMatrix4fv(loc, false, new Float32Array(this.gui.projMatrix().all()));
        });
        this.MassSpringRenderPass.addUniform("uView", (gl, loc) => {
            gl.uniformMatrix4fv(loc, false, new Float32Array(this.gui.viewMatrix().all()));
        });
        this.MassSpringRenderPass.setDrawData(this.ctx.TRIANGLES, this.massSpring.indicesFlat().length, this.ctx.UNSIGNED_INT, 0);
        this.MassSpringRenderPass.setup();
    }
    initSphere() {
        this.sphereRenderPass.setIndexBufferData(this.sphere.indicesFlat());
        this.sphereRenderPass.addAttribute("aVertPos", 4, this.ctx.FLOAT, false, 4 * Float32Array.BYTES_PER_ELEMENT, 0, undefined, this.sphere.positionsFlat());
        this.sphereRenderPass.addAttribute("aNorm", 4, this.ctx.FLOAT, false, 4 * Float32Array.BYTES_PER_ELEMENT, 0, undefined, this.sphere.normalsFlat());
        this.sphereRenderPass.addInstancedAttribute("aOffset", 4, this.ctx.FLOAT, false, 4 * Float32Array.BYTES_PER_ELEMENT, 0, undefined, new Float32Array(0));
        this.sphereRenderPass.addUniform("uLightPos", (gl, loc) => {
            gl.uniform4fv(loc, this.lightPosition.xyzw);
        });
        this.sphereRenderPass.addUniform("uProj", (gl, loc) => {
            gl.uniformMatrix4fv(loc, false, new Float32Array(this.gui.projMatrix().all()));
        });
        this.sphereRenderPass.addUniform("uView", (gl, loc) => {
            gl.uniformMatrix4fv(loc, false, new Float32Array(this.gui.viewMatrix().all()));
        });
        this.sphereRenderPass.setDrawData(this.ctx.TRIANGLES, this.sphere.indicesFlat().length, this.ctx.UNSIGNED_INT, 0);
        this.sphereRenderPass.setup();
    }
    /**
     * Sets up the blank cube drawing
     */
    initBlankCube() {
        this.blankCubeRenderPass.setIndexBufferData(this.cubeGeometry.indicesFlat());
        this.blankCubeRenderPass.addAttribute("aVertPos", 4, this.ctx.FLOAT, false, 4 * Float32Array.BYTES_PER_ELEMENT, 0, undefined, this.cubeGeometry.positionsFlat());
        this.blankCubeRenderPass.addAttribute("aNorm", 4, this.ctx.FLOAT, false, 4 * Float32Array.BYTES_PER_ELEMENT, 0, undefined, this.cubeGeometry.normalsFlat());
        this.blankCubeRenderPass.addAttribute("aUV", 2, this.ctx.FLOAT, false, 2 * Float32Array.BYTES_PER_ELEMENT, 0, undefined, this.cubeGeometry.uvFlat());
        this.blankCubeRenderPass.addInstancedAttribute("aOffset", 4, this.ctx.FLOAT, false, 4 * Float32Array.BYTES_PER_ELEMENT, 0, undefined, new Float32Array(0));
        this.blankCubeRenderPass.addUniform("uLightPos", (gl, loc) => {
            gl.uniform4fv(loc, this.lightPosition.xyzw);
        });
        this.blankCubeRenderPass.addUniform("uProj", (gl, loc) => {
            gl.uniformMatrix4fv(loc, false, new Float32Array(this.gui.projMatrix().all()));
        });
        this.blankCubeRenderPass.addUniform("uView", (gl, loc) => {
            gl.uniformMatrix4fv(loc, false, new Float32Array(this.gui.viewMatrix().all()));
        });
        this.blankCubeRenderPass.setDrawData(this.ctx.TRIANGLES, this.cubeGeometry.indicesFlat().length, this.ctx.UNSIGNED_INT, 0);
        this.blankCubeRenderPass.setup();
    }
    /**
     * Draws a single frame
     *
     */
    draw() {
        //TODO: Logic for a rudimentary walking simulator. Check for collisions and reject attempts to walk into a cube. Handle gravity, jumping, and loading of new chunks when necessary.
        this.playerPosition.add(this.gui.walkDir());
        this.gui.getCamera().setPos(this.playerPosition);
        // Drawing
        const gl = this.ctx;
        const bg = this.backgroundColor;
        gl.clearColor(bg.r, bg.g, bg.b, bg.a);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.enable(gl.CULL_FACE);
        gl.enable(gl.DEPTH_TEST);
        gl.frontFace(gl.CCW);
        gl.cullFace(gl.BACK);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null); // null is the default frame buffer
        this.drawScene(0, 0, 1280, 960);
    }
    drawScene(x, y, width, height) {
        const gl = this.ctx;
        gl.viewport(x, y, width, height);
        //TODO: Render multiple chunks around the player, using Perlin noise shaders
        this.massSpring.update();
        this.massSpring.updatePosAndNormFlat();
        if (this.isSphere) {
            this.sphereRenderPass.draw();
            this.massSpring.checkCollisionSphere(this.sphere);
        }
        if (this.isCube) {
            this.blankCubeRenderPass.updateAttributeBuffer("aOffset", new Float32Array(this.cubeCenter.xyzw));
            this.blankCubeRenderPass.drawInstanced(1);
            this.massSpring.checkCollisionCube(this.cubeCenter, this.cubeLength * 0.5 * 1.2);
        }
        this.MassSpringRenderPass.updateAttributeBuffer("aVertPos", this.massSpring.positionsFlat());
        this.MassSpringRenderPass.updateAttributeBuffer("aNorm", this.massSpring.normalsFlat());
        this.MassSpringRenderPass.draw();
    }
    getGUI() {
        return this.gui;
    }
}
export function initializeCanvas() {
    const canvas = document.getElementById("glCanvas");
    /* Start drawing */
    const canvasAnimation = new MassSpringAnimation(canvas);
    canvasAnimation.start();
}
//# sourceMappingURL=App.js.map