import {GLTFLoader} from '../../../lib/three/examples/jsm/loaders/GLTFLoader.js';
import{AnimationMixer, Object3D} from 'three';

class PierBuilder{
    constructor(){
        this.pier = new Object3D();
    }

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

    setUpModel(data, scaleX, scaleY, scaleZ){
        const model = data.scene;
        model.scale.set(scaleX,scaleY,scaleZ);
        return model;
    }
}

export {PierBuilder};