import {GLTFLoader} from '../../../lib/three/examples/jsm/loaders/GLTFLoader.js';
import{AnimationMixer, Object3D} from 'three';

class BeachHouseBuilder{
    constructor(){
        this.beachHouse = new Object3D();
    }

    async load(x, y, z, rotationY){
        const loader = new GLTFLoader();
        const data = await loader.loadAsync('/assets/models/bamboo-hut.gltf');
        
        this.beachHouse = this.setUpModel(data);

        this.beachHouse.position.x = x;
        this.beachHouse.position.y = y;
        this.beachHouse.position.z = z;
        this.beachHouse.rotation.y = rotationY;

        return this.beachHouse;
    }

    setUpModel(data){
        const model = data.scene;
        model.scale.set(1,1,1);
        return model;
    }
}

export {BeachHouseBuilder};