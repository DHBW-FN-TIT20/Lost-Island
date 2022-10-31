import {GLTFLoader} from '../../../lib/three/examples/jsm/loaders/GLTFLoader.js';
import{AnimationMixer, Object3D} from 'three';

class PierBuilder{
    constructor(){
        this.pier = new Object3D();
    }

    async load(x, y, z, rotationY){
        const loader = new GLTFLoader();
        const data = await loader.loadAsync('/assets/models/pier.gltf');
        
        this.pier = this.setUpModel(data);

        this.pier.position.x = x;
        this.pier.position.y = y;
        this.pier.position.z = z;
        this.pier.rotation.y = rotationY;

        return this.pier;
    }

    setUpModel(data){
        const model = data.scene;
        model.scale.set(15,15,15);
        return model;
    }
}

export {PierBuilder};