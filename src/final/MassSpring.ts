import { Vec3, Vec4 } from "../lib/TSM.js";
import { Particle } from "./Particle";
import { Sphere } from "./Sphere.js";
import { Spring } from "./Spring.js";

export class MassSpring {
    private particles: Particle[][];
    private springs: Spring[];
    private gravity: number;
    private windSpeed: number;
    private timeStep: number;
    private positionsF32: Float32Array;
    private indicesU32: Uint32Array;
    private normalsF32: Float32Array;
    private windVal: number;

    constructor(particles: Particle[][], springs: Spring[], gravity: number, windSpeed: number, timeStep: number) {
        this.particles = particles;
        this.springs = springs;
        this.gravity = gravity;
        this.windSpeed = windSpeed;
        this.timeStep = timeStep
        this.windVal = 0;
        let index = 0;
        let indicesRay: Vec3[] = [];
        this.updatePosAndNormFlat();
        for (let i = 0; i < this.particles.length - 1; i++) {
            for (let j = 0; j < this.particles[0].length - 1; j++) {
                indicesRay.push(new Vec3([index + 2, index + 1, index + 0]));
                indicesRay.push(new Vec3([index + 0, index + 3, index + 2]));
                indicesRay.push(new Vec3([index + 4, index + 5, index + 6]));
                indicesRay.push(new Vec3([index + 6, index + 7, index + 4]));
                index += 8;
            }
        }
        this.indicesU32 = new Uint32Array(indicesRay.length * 3);
        indicesRay.forEach((v: Vec3, i: number) => {
            this.indicesU32.set(v.xyz, i * 3);
        });
    }

    public updatePosAndNormFlat(): void {
        let positionsRay: Vec4[] = [];
        let normalsRay: Vec4[] = [];
        for (let i = 0; i < this.particles.length - 1; i++) {
            for (let j = 0; j < this.particles[0].length - 1; j++) {
                // top right
                let index0 = this.particles[i+1][j+1].getPosition();

                // bottom right
                let index1 = this.particles[i+1][j].getPosition();

                // bottom left
                let index2 = this.particles[i][j].getPosition();

                // top left
                let index3 = this.particles[i][j+1].getPosition();
                
                positionsRay.push(index0, index1, index2, index3);
                positionsRay.push(index0, index1, index2, index3);

                let diff1 = Vec4.difference(index1, index2);
                let diff2 = Vec4.difference(index0, index2);
                let N = Vec3.cross(new Vec3(diff1.xyz), new Vec3(diff2.xyz)).normalize();
                let normal = new Vec4([N.x, N.y, N.z, 0.0]);

                for(let k = 0; k < 4; k++) {
                    normalsRay.push(normal);
                }

                diff1 = Vec4.difference(index1, index0);
                diff2 = Vec4.difference(index2, index0);
                N = Vec3.cross(new Vec3(diff1.xyz), new Vec3(diff2.xyz)).normalize();
                normal = new Vec4([N.x, N.y, N.z, 0.0]);

                for(let k = 0; k < 4; k++) {
                    normalsRay.push(normal);
                }
            }
        }
        this.positionsF32 = new Float32Array(positionsRay.length * 4);
        positionsRay.forEach((v: Vec4, i: number) => {
            this.positionsF32.set(v.xyzw, i * 4);
        });
        this.normalsF32 = new Float32Array(normalsRay.length * 4);
        normalsRay.forEach((v: Vec4, i: number) => {
            this.normalsF32.set(v.xyzw, i * 4);
        });
    }

    public update(): void {
        for (let i = 0; i < this.springs.length; i++) {
            let spring = this.springs[i]
            let particle1 = spring.getParticle1();
            let particle2 = spring.getParticle2();
            let difference = Vec4.difference(particle1.getPosition(), particle2.getPosition());
            let currLength = difference.length();
            let displacement = (currLength - spring.getRestLength());
            let direction = difference.normalize();
            let springForce1 = direction.copy().scale(-spring.getK() * displacement)
            let springForce2 = direction.copy().scale(spring.getK() * displacement);
            particle1.addForce(springForce1);
            particle2.addForce(springForce2);
            // this.springs[i].update();
        }
        this.windVal += this.timeStep;
        let windForce = new Vec4([0, 0, this.windSpeed * Math.sin(this.windVal), 0]);
        for(let i = 0; i < this.particles.length; i++) {
            for(let j = 0; j < this.particles[0].length; j++) {
                let particle = this.particles[i][j];
                let gravForce = new Vec4([0, -this.gravity, 0, 0]);
                gravForce.scale(particle.getMass());
                particle.addForce(gravForce);
                particle.addForce(windForce);
                particle.update(this.timeStep);
                particle.resetForce();
            }
        }
    }

    public positionsFlat(): Float32Array {
        return this.positionsF32;
    }

    public indicesFlat(): Uint32Array {
        return this.indicesU32;
    }

    public normalsFlat(): Float32Array {
        return this.normalsF32;
    }

    public checkCollisionSphere(sphere: Sphere): void{
        let center = sphere.getCenter();
        let radius = sphere.getRadius();
        for(let i = 0; i < this.particles.length; i++) {
            for(let j = 0; j < this.particles[0].length; j++) {
                let particle = this.particles[i][j];
                let diff = Vec4.difference(particle.getPosition(), center);
                let length = diff.length();
                if (length < radius) {
                    // inside sphere
                    let direction = diff.normalize();
                    let updatePos = direction.scale(radius - length);
                    particle.setPosition(Vec4.sum(particle.getPosition(), updatePos));
                }
            }
        }
    }

    public checkCollisionCube(center: Vec4, cubeLength: number): void {
        for(let i = 0; i < this.particles.length; i++) {
            for(let j = 0; j < this.particles[0].length; j++) {
                let particle = this.particles[i][j];
                let position = particle.getPosition();
                let velocity = Vec4.difference(particle.getPrevPosition(), particle.getPosition());
                let nextPosition = Vec4.sum(position, velocity.scale(this.timeStep));
                if (position.x > center.x - cubeLength &&
                    position.x < center.x + cubeLength && 
                    position.y > center.y - cubeLength && 
                    position.y < center.y + cubeLength && 
                    position.z > center.z - cubeLength && 
                    position.z < center.z + cubeLength) {
                    let diffNow = Vec4.difference(position, center).length();
                    let diffNext = Vec4.difference(nextPosition, center).length();
                    if (diffNext > diffNow) {
                        particle.setPosition(particle.getPrevPosition());
                    }
                }                
            }
        }
    }
}