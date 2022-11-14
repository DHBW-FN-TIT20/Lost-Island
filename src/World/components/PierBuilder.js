import {GLTFLoader} from '../../../lib/three/examples/jsm/loaders/GLTFLoader.js';
import{AnimationMixer, Object3D} from 'three';

/**
 * Helper class to build a pier.
 */
class PierBuilder{
    constructor(){
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
     * @returns Object3D
     */
    async load(x, y, z, rotationY, scaleX, scaleY, scaleZ){
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
     * @param {Object3D} data 
     * @param {Number} scaleX Scale in x axis
     * @param {Number} scaleY Scale in y axis
     * @param {Number} scaleZ Scale in z axis
     * @returns Object3D
     */
    setUpModel(data, scaleX, scaleY, scaleZ){
        const model = data.scene;
        model.scale.set(scaleX,scaleY,scaleZ);
        return model;
    }
}

export {PierBuilder};