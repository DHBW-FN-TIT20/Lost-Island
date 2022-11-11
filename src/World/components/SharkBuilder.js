import {GLTFLoader} from '../../../lib/three/examples/jsm/loaders/GLTFLoader.js';
import {CSS3DRenderer, CSS3DObject} from '../../../lib/three/examples/jsm/renderers/CSS3DRenderer.js';
import{AnimationMixer, Object3D, LoopOnce, LoopRepeat, Color, BoxGeometry, Mesh, MeshBasicMaterial} from 'three';

class SharkBuilder{
    #mixer;
    #action;

    constructor(){
        this.shark = new Object3D();
    }

    async load(x, y, z, rotationY){
        const loader = new GLTFLoader();
        const data = await loader.loadAsync('/assets/models/shark.gltf');
        
        this.shark = this.setUpModel(data);
        this.shark.tick = (delta) => this.move(delta); 
        this.shark.startAnimation = () => this.startAnimation();
        this.shark.setInteractionText = this.setText;
        this.shark.position.x = x;
        this.shark.position.y = y;
        this.shark.position.z = z;
        this.shark.rotation.y = rotationY;
        this.t = 0;
        return this.shark;
    }

    move(delta){
        this.#mixer.update(delta);
        this.t += 0.005;
        this.shark.position.x = this.shark.position.x + 0.2*Math.cos(this.t);
        this.shark.position.z = this.shark.position.z + 0.2*Math.sin(this.t);
        this.shark.rotation.y = this.shark.rotation.y - 0.005;
    }

    async startAnimation(){		       
        this.#action.play();
    }

    setUpModel(data){
        const model = data.scene;
        model.scale.set(4,4,4);
        this.clip = data.animations[0];
        this.#mixer = new AnimationMixer(model);
        this.#action = this.#mixer.clipAction(this.clip);
        return model;
    }
}

export {SharkBuilder};