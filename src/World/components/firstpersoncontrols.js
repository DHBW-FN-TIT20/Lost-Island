import {FirstPersonControls} from '../../../lib/three/examples/jsm/controls/FirstPersonControls.js';

function createFirstPersonControls(camera, domElement){
    const controls = new FirstPersonControls(camera, domElement);
    controls.lookSpeed = 0.8;
    controls.movementSpeed = 8;
    return controls;
}

export {createFirstPersonControls}