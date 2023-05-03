import { Vec3, Vec4 } from "../lib/TSM.js";

export class Sphere {
    private center: Vec4;
    private radius: number;
    private positionsF32: Float32Array;
    private indicesU32: Uint32Array;
    private normalsF32: Float32Array;

    constructor(center: Vec4, radius: number) {
        this.center = center;
        this.radius = radius;
        this.drawSphere(radius, 20)
    }

    private drawSphere(r: number, sphereDiv: number) {
        let latStep = Math.PI / sphereDiv;
        let longStep = 2 * Math.PI / sphereDiv;
        let lengthInv = 1.0 / r;
        let vertices: Vec4[] = [];
        let normals: Vec4[] = [];
        let indices: Vec3[] = [];
        for(let i = 0; i <= sphereDiv; i++) {
            let lat = Math.PI * -0.5 - i * latStep;
            let xy =  r * Math.cos(lat);
            let z  = r * Math.sin(lat);
            for(let j = 0; j <= sphereDiv; j++) {
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
                    if(i != 0) {
                        indices.push(new Vec3([k1, k2, k1 + 1]));
                    }
                    if(i != sphereDiv - 1) {
                        indices.push(new Vec3([k1 + 1, k2, k2 + 1]));
                    }
                }
            }
        }
        this.positionsF32 = new Float32Array(vertices.length * 4);
        vertices.forEach((v: Vec4, i: number) => {
            this.positionsF32.set(v.xyzw, i * 4);
        });
        this.normalsF32 = new Float32Array(normals.length * 4);
        normals.forEach((v: Vec4, i: number) => {
            this.normalsF32.set(v.xyzw, i * 4);
        });
        this.indicesU32 = new Uint32Array(indices.length * 3);
        indices.forEach((v: Vec3, i: number) => {
            this.indicesU32.set(v.xyz, i * 3);
        });
    }

    public getRadius(): number {
        return this.radius;
    }

    public getCenter(): Vec4 {
        return this.center;
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
}