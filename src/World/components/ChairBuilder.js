import {GLTFLoader} from '../../../lib/three/examples/jsm/loaders/GLTFLoader.js';
import{AnimationMixer, Object3D} from 'three';

class ChairBuilder{
    constructor(){
        this.chair = new Object3D();
    }

    async loadChairWithTowel(x, y, z, rotationY){
        const loader = new GLTFLoader();
        const data = await loader.loadAsync('/assets/models/chair-2.gltf');
        
        this.chair = this.setUpModel(data);

        this.chair.position.x = x;
        this.chair.position.y = y;
        this.chair.position.z = z;
        this.chair.rotation.y = rotationY;

        return this.chair;
    }

    setUpModel(data){
        const model = data.scene;
        model.scale.set(20,20,20);
        return model;
    }
}

export {ChairBuilder};