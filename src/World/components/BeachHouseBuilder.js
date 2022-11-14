import { GLTFLoader } from '../../../lib/three/examples/jsm/loaders/GLTFLoader.js';
import { Object3D } from 'three';

/**
 * Helper class to build a beach house.
 */
class BeachHouseBuilder {
    constructor() {
        this.beachHouse = new Object3D();
    }

    /**
     * Creates a beach house.
     * @param {Number} x Position in x axis
     * @param {Number} y Position in y axis
     * @param {Number} z Position in z axis
     * @param {Number} rotationY Rotation in y axis
     * @returns THREE.Object3D
     */
    async load(x, y, z, rotationY) {
        const loader = new GLTFLoader();
        const data = await loader.loadAsync('/assets/models/bamboo-hut.gltf');

        this.beachHouse = this.setUpModel(data);

        this.beachHouse.position.x = x;
        this.beachHouse.position.y = y;
        this.beachHouse.position.z = z;
        this.beachHouse.rotation.y = rotationY;

        return this.beachHouse;
    }

    /**
     * Set the Animations and Scale of the Beach House
     * @param {THREE.Object3D} data 
     * @returns THREE.Object3D
     */
    setUpModel(data) {
        const model = data.scene;
        model.scale.set(1, 1, 1);
        return model;
    }
}

export { BeachHouseBuilder };