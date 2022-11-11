import {GLTFLoader} from '../../../lib/three/examples/jsm/loaders/GLTFLoader.js';
import{AnimationMixer, Object3D, Vector3} from 'three';

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
        this.chair.sitOnChair = this.sitOnChair;
        this.chair.setInteractionText = this.setText;

        return this.chair;
    }

    setUpModel(data){
        const model = data.scene;
        model.scale.set(20,20,20);
        return model;
    }

    /**
     * @param {function} setFunction Call these function that give it a Vector3 position and a Quaternion rotation
     */
    sitOnChair(setFunction){
        const pos = this.position.clone();
        pos.y += 30;
        pos.x -= 25;
        setFunction(pos, this.quaternion.clone().invert());
    }

    /**
     * Set the text of the interaction text
     */
    setText(){
        const div = document.getElementById("info");
        div.innerHTML = "E zum sitzen";
    }

}

export {ChairBuilder};