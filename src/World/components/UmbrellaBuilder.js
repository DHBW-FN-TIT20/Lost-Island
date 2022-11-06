import {GLTFLoader} from '../../../lib/three/examples/jsm/loaders/GLTFLoader.js';
import{AnimationMixer, Object3D} from 'three';

class UmbrellaBuilder{
    constructor(){
        this.umbrella = new Object3D();
    }

    async load(x, y, z, rotationY){
        const loader = new GLTFLoader();
        const data = await loader.loadAsync('/assets/models/umbrella.gltf');
        
        this.umbrella = this.setUpModel(data);

        this.umbrella.position.x = x;
        this.umbrella.position.y = y;
        this.umbrella.position.z = z;
        this.umbrella.rotation.y = rotationY;

        return this.umbrella;
    }

    setUpModel(data){
        const model = data.scene;
        model.scale.set(20,20,20);
        return model;
    }
}

export {UmbrellaBuilder};