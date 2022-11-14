import {GLTFLoader} from '../../../lib/three/examples/jsm/loaders/GLTFLoader.js';
import{AnimationMixer, Object3D} from 'three';

/**
 * Helper class to build a crate.
 */
class CrateBuilder{
    constructor(){
        this.crate = new Object3D();
    }

    /**
     * Creates a crate.
     * @param {Number} x Position in x axis
     * @param {Number} y Position in y axis
     * @param {Number} z Position in z axis
     * @param {Number} rotationY Rotation in y axis
     * @returns Object3D
     */
    async load(x, y, z, rotationY){
        const loader = new GLTFLoader();
        const data = await loader.loadAsync('/assets/models/wooden-crate.glb');       
        this.crate = this.setUpModel(data);
        this.crate.position.x = x;
        this.crate.position.y = y;
        this.crate.position.z = z;
        this.crate.rotation.y = rotationY;
        return this.crate;
    }

    /**
     * Set the Animations and Scale of the Crate
     * @param {Object3D} data 
     * @returns Object3D
     */
    setUpModel(data){
        const model = data.scene;
        return model;
    }
}

export {CrateBuilder};