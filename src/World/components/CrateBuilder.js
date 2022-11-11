import {GLTFLoader} from '../../../lib/three/examples/jsm/loaders/GLTFLoader.js';
import{AnimationMixer, Object3D} from 'three';

class CrateBuilder{
    constructor(){
        this.crate = new Object3D();
    }

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

    setUpModel(data){
        const model = data.scene;
        // model.scale.set(30,30,30);
        return model;
    }
}

export {CrateBuilder};