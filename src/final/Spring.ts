import { Vec4 } from "../lib/TSM.js";
import { Particle } from "./Particle";

export class Spring {
    private particle1: Particle;
    private particle2: Particle;
    private stiffness: number;
    private restLength: number;

    constructor(particle1: Particle, particle2: Particle, k: number) {
        this.particle1 = particle1;
        this.particle2 = particle2;
        this.stiffness = k;
        this.restLength = Vec4.difference(particle1.getPosition(), particle2.getPosition()).length();
    }

    public update(): void {
        let displacement = Vec4.difference(this.particle1.getPosition(), this.particle2.getPosition());
        let currLength = displacement.length();
        let diffFactor = (this.restLength - currLength) / currLength;
	    displacement.scale(diffFactor * 0.5);
        this.particle1.setPosition(Vec4.sum(this.particle1.getPosition(), displacement));
        this.particle2.setPosition(Vec4.difference(this.particle2.getPosition(), displacement));
    }

    public getParticle1(): Particle {
        return this.particle1;
    }

    public getParticle2(): Particle {
        return this.particle2;
    }

    public getK(): number {
        return this.stiffness
    }

    public getRestLength(): number {
        return this.restLength;
    }
}