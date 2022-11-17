import { GLTFLoader } from '../../../lib/three/examples/jsm/loaders/GLTFLoader.js';
import { Object3D } from 'three';

/**
 * Helper class to build a pier.
 */
class PierBuilder {
    constructor() {
        this.pier = new Object3D();
    }

    /**
     * Creates a pier.
     * @param {Number} x Position in x axis
     * @param {Number} y Position in y axis
     * @param {Number} z Position in z axis
     * @param {Number} rotationY Rotation in y axis
     * @param {Number} scaleX Scale in x axis
     * @param {Number} scaleY Scale in y axis
     * @param {Number} scaleZ Scale in z axis
     * @returns THREE.Object3D
     */
    async load(x, y, z, rotationY, scaleX, scaleY, scaleZ) {
        const loader = new GLTFLoader();
        const data = await loader.loadAsync('/assets/models/pier.gltf');

        this.pier = this.setUpModel(data, scaleX, scaleY, scaleZ);

        this.pier.position.x = x;
        this.pier.position.y = y;
        this.pier.position.z = z;
        this.pier.rotation.y = rotationY;

        return this.pier;
    }

    /**
     * Set the Animations and Scale of the Pier
     * @param {THREE.Object3D} data 
     * @param {Number} scaleX Scale in x axis
     * @param {Number} scaleY Scale in y axis
     * @param {Number} scaleZ Scale in z axis
     * @returns THREE.Object3D
     */
    setUpModel(data, scaleX, scaleY, scaleZ) {
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
        model.scale.set(scaleX, scaleY, scaleZ);
        return model;
    }
}

export { PierBuilder };