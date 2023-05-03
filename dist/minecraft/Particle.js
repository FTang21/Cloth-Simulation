import { Vec3 } from "../lib/TSM";
export class Particle {
    constructor(x, y, z, mass) {
        this.position = new Vec3([x, y, z]);
        this.velocity = new Vec3([0, 0, 0]);
        this.prevPosition = new Vec3([x, y, z]);
        this.mass = mass;
    }
    updatePosition(force, timeStep) {
        let acceleration = new Vec3();
        force.scale(1.0 / this.mass, acceleration);
        console.log(force);
        console.log(acceleration);
    }
    getPosition() {
        return this.position;
    }
    getPrevPosition() {
        return this.prevPosition;
    }
    getMass() {
        return this.mass;
    }
}
//# sourceMappingURL=Particle.js.map