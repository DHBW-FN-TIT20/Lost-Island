import {GLTFLoader} from '../../../lib/three/examples/jsm/loaders/GLTFLoader.js';
import{AnimationMixer, Object3D} from 'three';

class BoatBuilder{
    constructor(){
        this.boat = new Object3D();
    }

    async load(x, y, z, rotationY){
        const loader = new GLTFLoader();
        const data = await loader.loadAsync('/assets/models/boat.gltf');
        
        this.boat = this.setUpModel(data);

        this.boat.position.x = x;
        this.boat.position.y = y;
        this.boat.position.z = z;
        this.boat.rotation.y = rotationY;

        return this.boat;
    }

    setUpModel(data){
        const model = data.scene;
        model.scale.set(30,30,30);
        return model;
    }
}

export {BoatBuilder};