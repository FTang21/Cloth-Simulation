import { Vec4 } from "../lib/TSM.js";
export class Spring {
    constructor(particle1, particle2, k) {
        this.particle1 = particle1;
        this.particle2 = particle2;
        this.stiffness = k;
        this.restLength = Vec4.difference(particle1.getPosition(), particle2.getPosition()).length();
    }
    update() {
        let displacement = Vec4.difference(this.particle1.getPosition(), this.particle2.getPosition());
        let currLength = displacement.length();
        let diffFactor = (this.restLength - currLength) / currLength;
        displacement.scale(diffFactor * 0.5);
        this.particle1.setPosition(Vec4.sum(this.particle1.getPosition(), displacement));
        this.particle2.setPosition(Vec4.difference(this.particle2.getPosition(), displacement));
    }
    getParticle1() {
        return this.particle1;
    }
    getParticle2() {
        return this.particle2;
    }
    getK() {
        return this.stiffness;
    }
    getRestLength() {
        return this.restLength;
    }
}
//# sourceMappingURL=Spring.js.map