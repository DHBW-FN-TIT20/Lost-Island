import { GLTFLoader } from '../../../lib/three/examples/jsm/loaders/GLTFLoader.js';
import { Object3D } from 'three';

/**
 * Helper class to build a umbrella.
 */
class UmbrellaBuilder {
    constructor() {
        this.umbrella = new Object3D();
    }

    /**
     * Create a umbrella
     * @param {Number} x Position in x axis
     * @param {Number} y Position in y axis
     * @param {Number} z Position in z axis
     * @param {Number} rotationY Rotation in y axis
     * @returns THREE.Object3D
     */
    async load(x, y, z, rotationY) {
        const loader = new GLTFLoader();
        const data = await loader.loadAsync('/assets/models/umbrella.gltf');

        this.umbrella = this.setUpModel(data);

        this.umbrella.position.x = x;
        this.umbrella.position.y = y;
        this.umbrella.position.z = z;
        this.umbrella.rotation.y = rotationY;

        return this.umbrella;
    }

    /**
     * Set the Animations and Scale of the Umbrella
     * @param {THREE.Object3D} data 
     * @returns THREE.Object3D
     */
    setUpModel(data) {
        const model = data.scene;
        //Set castShadow to true for all children
        for(let i = 0; i < model.children.length; i++) {
            model.children[i].castShadow = true;
            model.children[i].receiveShadow = true;
            if(model.children[i].children.length > 0) {
                for(let j = 0; j < model.children[i].children.length; j++) {
                    model.children[i].children[j].castShadow = true;
                    model.children[i].children[j].receiveShadow = true;
                }
            }
        }
        model.scale.set(20, 20, 20);
        return model;
    }
}

export { UmbrellaBuilder };