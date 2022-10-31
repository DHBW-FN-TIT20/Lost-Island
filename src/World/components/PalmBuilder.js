import {GLTFLoader} from '../../../lib/three/examples/jsm/loaders/GLTFLoader.js';
import{AnimationMixer, Object3D} from 'three';

class PalmBuilder{
    #mixer;
    #action;

    constructor(){
        this.palm = new Object3D();
    }

    async load(x, y, z, rotationY){
        const loader = new GLTFLoader();
        const data = await loader.loadAsync('/assets/models/palm-tree-test.gltf');
        
        this.palm = this.setUpModel(data);
        this.palm.tick = (delta) => this.#mixer.update(delta);
        this.palm.startAnimation = () => this.#action.play();
        this.palm.stopAnimation = () => this.#action.stop();
        this.palm.position.x = x;
        this.palm.position.y = y;
        this.palm.position.z = z;
        this.palm.rotation.y = rotationY;
        return this.palm;
    }

    setUpModel(data){
        const model = data.scene;
        const clip = data.animations[0];
        this.#mixer = new AnimationMixer(model);
        this.#action = this.#mixer.clipAction(clip);
        return model;
    }
}

export {PalmBuilder};