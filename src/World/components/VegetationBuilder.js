import {GLTFLoader} from '../../../lib/three/examples/jsm/loaders/GLTFLoader.js';
import{AnimationMixer, Object3D} from 'three';

class VegetationBuilder{
    constructor(){
        this.bush = new Object3D();
    }

    async loadTree(x, y, z, rotationY){
        const loader = new GLTFLoader();
        const data = await loader.loadAsync('/assets/models/smol-tree.gltf');
        
        this.bush = this.setUpModel(data);

        this.bush.position.x = x;
        this.bush.position.y = y;
        this.bush.position.z = z;
        this.bush.rotation.y = rotationY;

        return this.bush;
    }

    setUpModel(data){
        const model = data.scene;
        return model;
    }
}

export {VegetationBuilder};