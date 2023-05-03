export class MassSpring {
    constructor(particles) {
        this.particles = particles;
        this.size = particles.length;
    }
    update() {
    }
    getPositions() {
        let positionArray = new Float32Array(this.size * 3);
        for (let i = 0; i < this.size; i++) {
            let particlePos = this.particles[i].getPosition();
            positionArray[i] = particlePos.x;
            positionArray[i + 1] = particlePos.y;
            positionArray[i + 2] = particlePos.z;
        }
        return positionArray;
    }
}
//# sourceMappingURL=MassSpring.js.map