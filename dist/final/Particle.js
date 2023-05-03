import { Vec4 } from "../lib/TSM.js";
export class Particle {
    constructor(x, y, z, mass, isAnchor, damping) {
        this.position = new Vec4([x, y, z, 1.0]);
        this.prevPosition = new Vec4([x, y, z, 1.0]);
        this.mass = mass;
        this.isAnchor = isAnchor;
        this.damping = damping;
        this.resetForce();
    }
    update(dt) {
        if (!this.isAnchor) {
            let acceleration = new Vec4();
            this.netForce.scale(1.0 / this.mass, acceleration);
            acceleration.scale(dt * dt);
            let temp = this.position.copy();
            let velocity = Vec4.difference(this.position, this.prevPosition).scale(1.0 - this.damping);
            this.position.add(velocity);
            this.position.add(acceleration);
            this.prevPosition = temp;
        }
    }
    resetForce() {
        this.netForce = new Vec4();
    }
    addForce(force) {
        this.netForce.add(force);
    }
    getPosition() {
        return this.position;
    }
    setPosition(position) {
        if (!this.isAnchor) {
            this.prevPosition = this.position;
            this.position = position;
        }
    }
    getPrevPosition() {
        return this.prevPosition;
    }
    getMass() {
        return this.mass;
    }
}
//# sourceMappingURL=Particle.js.map