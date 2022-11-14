import { GLTFLoader } from '../../../lib/three/examples/jsm/loaders/GLTFLoader.js';
import { Object3D } from 'three';

/**
 * Helper class to build a boat.
 */
class BoatBuilder {
    constructor() {
        this.boat = new Object3D();
    }

    /**
     * Creates a boat.
     * @param {Number} x Position in x axis
     * @param {Number} y Position in y axis
     * @param {Number} z Position in z axis
     * @param {Number} rotationY Rotation in y axis
     * @returns THREE.Object3D
     */
    async load(x, y, z, rotationY) {
        const loader = new GLTFLoader();
        const data = await loader.loadAsync('/assets/models/boat.gltf');

        this.boat = this.setUpModel(data);

        this.boat.position.x = x;
        this.boat.position.y = y;
        this.boat.position.z = z;
        this.boat.rotation.y = rotationY;

        return this.boat;
    }

    /**
     * Set the Animations and Scale of the Boat
     * @param {THREE.Object3D} data 
     * @returns THREE.Object3D
     */
    setUpModel(data) {
        const model = data.scene;
        model.scale.set(30, 30, 30);
        return model;
    }
}

export { BoatBuilder };