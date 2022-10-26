import {GLTFLoader} from '../../../lib/three/examples/jsm/loaders/GLTFLoader.js';
import{AnimationMixer} from 'three';

async function loadPalm(){
    const loader = new GLTFLoader();
    const data = await loader.loadAsync('/assets/models/palm-tree-test.gltf');
    const palm = setUpModel(data);
    palm.position.x = 10;
    palm.position.y = 5;
    palm.position.z = 0;
    palm.rotation.y = Math.PI/2;
    return palm;
}

function setUpModel(data){
    const model = data.scene;
    const clip = data.animations[0];
    const mixer = new AnimationMixer(model);
    const action = mixer.clipAction(clip);
    action.play();
    model.tick = (delta) => mixer.update(delta);
    return model;
}

export {loadPalm};