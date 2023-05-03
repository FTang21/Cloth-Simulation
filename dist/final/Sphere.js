import { Vec3, Vec4 } from "../lib/TSM.js";
export class Sphere {
    constructor(center, radius) {
        this.center = center;
        this.radius = radius;
        this.drawSphere(radius, 20);
    }
    drawSphere(r, sphereDiv) {
        let latStep = Math.PI / sphereDiv;
        let longStep = 2 * Math.PI / sphereDiv;
        let lengthInv = 1.0 / r;
        let vertices = [];
        let normals = [];
        let indices = [];
        for (let i = 0; i <= sphereDiv; i++) {
            let lat = Math.PI * -0.5 - i * latStep;
            let xy = r * Math.cos(lat);
            let z = r * Math.sin(lat);
            for (let j = 0; j <= sphereDiv; j++) {
                let k1 = i * (sphereDiv + 1) + j;
                let k2 = k1 + sphereDiv + 1;
                let long = j * longStep;
                let x = xy * Math.cos(long);
                let y = xy * Math.sin(long);
                vertices.push(new Vec4([this.center.x + x, this.center.y + y, this.center.z + z, 1.0]));
                let nx = -x * lengthInv;
                let ny = -y * lengthInv;
                let nz = -z * lengthInv;
                normals.push(new Vec4([nx, ny, nz, 0.0]));
                if (i != sphereDiv && j != sphereDiv) {
                    if (i != 0) {
                        indices.push(new Vec3([k1, k2, k1 + 1]));
                    }
                    if (i != sphereDiv - 1) {
                        indices.push(new Vec3([k1 + 1, k2, k2 + 1]));
                    }
                }
            }
        }
        this.positionsF32 = new Float32Array(vertices.length * 4);
        vertices.forEach((v, i) => {
            this.positionsF32.set(v.xyzw, i * 4);
        });
        this.normalsF32 = new Float32Array(normals.length * 4);
        normals.forEach((v, i) => {
            this.normalsF32.set(v.xyzw, i * 4);
        });
        this.indicesU32 = new Uint32Array(indices.length * 3);
        indices.forEach((v, i) => {
            this.indicesU32.set(v.xyz, i * 3);
        });
    }
    getRadius() {
        return this.radius;
    }
    getCenter() {
        return this.center;
    }
    positionsFlat() {
        return this.positionsF32;
    }
    indicesFlat() {
        return this.indicesU32;
    }
    normalsFlat() {
        return this.normalsF32;
    }
}
//# sourceMappingURL=Sphere.js.map