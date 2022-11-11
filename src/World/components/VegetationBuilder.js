import {GLTFLoader} from '../../../lib/three/examples/jsm/loaders/GLTFLoader.js';
import{AnimationMixer, Object3D, LoopOnce} from 'three';

class VegetationBuilder{

    #mixer;
    #action;

    constructor(){
        this.bush = new Object3D();
        this.acaiPalm = new Object3D();
        this.datePalm = new Object3D();
        this.palm = new Object3D();
        this.seaPlant = new Object3D();
    }

    async loadTree(x, y, z, rotationY){
        const loader = new GLTFLoader();
        const data = await loader.loadAsync('/assets/models/smol-tree.gltf');        
        this.bush = data.scene;
        this.bush.position.x = x;
        this.bush.position.y = y;
        this.bush.position.z = z;
        this.bush.rotation.y = rotationY;
        return this.bush;
    }

    /**
     * 
     * @param {x coordinate of object} x 
     * @param {y coordinate of object} y 
     * @param {z coordinate of object} z 
     * @param {rotationY of object} rotationY 
     * @returns acaiPalm
     */
    async loadAcaiPalm(x, y, z, rotationY){
        const loader = new GLTFLoader();
        const data = await loader.loadAsync('/assets/models/acai_palm/scene.gltf');
        const model = data.scene;
        model.scale.set(4,4,4);
        this.acaiPalm = model;
        this.acaiPalm.position.x = x;
        this.acaiPalm.position.y = y;
        this.acaiPalm.position.z = z;
        this.acaiPalm.rotation.y = rotationY;
        return this.acaiPalm;
    }

    async loadDatePalm(x, y, z, rotationY){
        const loader = new GLTFLoader();
        const data = await loader.loadAsync('/assets/models/date_palm/scene.gltf');
        const model = data.scene;
        for(let i = 0; i < model.children.length; i++){
            model.children[i].castShadow = true;
        }
        model.scale.set(4,4,4);
        this.acaiPalm = model;
        this.acaiPalm.position.x = x;
        this.acaiPalm.position.y = y;
        this.acaiPalm.position.z = z;
        this.acaiPalm.rotation.y = rotationY;
        return this.acaiPalm;
    }

    async loadPalmWithCoconut(x, y, z, rotationY){
        const loader = new GLTFLoader();
        const data = await loader.loadAsync('/assets/models/palm-tree.gltf');
        this.palm = this.setUpModel(data);
        this.palm.tick = (delta) => this.#mixer.update(delta);
        this.palm.startAnimation = () => this.startAnimation();
        this.palm.stopAnimation = () => this.#action.stop();
        this.palm.setInteractionText = this.setText;
        this.palm.position.x = x;
        this.palm.position.y = y;
        this.palm.position.z = z;
        this.palm.rotation.y = rotationY;
        return this.palm;
    }

    async loadSeaPlant(x, y, z, rotationY){
        const loader = new GLTFLoader();
        const data = await loader.loadAsync('/assets/models/sea-plant.gltf');
        const model = data.scene;
        model.scale.set(2,2,2);
        this.seaPlant = model;
        this.seaPlant.position.x = x;
        this.seaPlant.position.y = y;
        this.seaPlant.position.z = z;
        this.seaPlant.rotation.y = rotationY;
        return this.seaPlant;
    }


    setText(){
        let div = document.getElementById("info");
        div.innerHTML = "E zum Pflücken";
    }

    async startAnimation(){
        this.#action.play();
    }

    setUpModel(data){
        const model = data.scene;
        const clip = data.animations[0];
        this.#mixer = new AnimationMixer(model);
        this.#action = this.#mixer.clipAction(clip);
        this.#action.clampWhenFinished = true;
        this.#action.setLoop(LoopOnce);
        return model;
    }

}

export {VegetationBuilder};