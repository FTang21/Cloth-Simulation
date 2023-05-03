import { Vec4 } from "../lib/TSM.js"

export class Particle {
    private position: Vec4;
    private prevPosition: Vec4;
    private mass: number;
    private isAnchor: boolean;
    private netForce: Vec4;
    private damping: number;

    constructor(x: number, y: number, z: number, mass: number, isAnchor: boolean, damping: number) {
        this.position = new Vec4([x, y, z, 1.0]);
        this.prevPosition = new Vec4([x, y, z, 1.0]);
        this.mass = mass;
        this.isAnchor = isAnchor;
        this.damping = damping;
        this.resetForce();
    }

    public update(dt: number): void {
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

    public resetForce(): void {
        this.netForce = new Vec4();
    }

    public addForce(force: Vec4): void {
        this.netForce.add(force);
    }

    public getPosition(): Vec4 {
        return this.position;
    }

    public setPosition(position: Vec4): void {
        if (!this.isAnchor) {
            this.prevPosition = this.position;
            this.position = position;
        }
    }

    public getPrevPosition(): Vec4 {
        return this.prevPosition;
    }

    public getMass(): number {
        return this.mass;
    }
}