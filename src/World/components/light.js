import { SpotLight } from 'three';

/**
 * Create the SpotLight
 * @param {THREE.Vector3} position 
 * @returns THREE.SpotLight
 */
function createSpotLight(position) {
    const light = new SpotLight(0x404040, 4);
    light.position.set(0, 120, -100);
    light.shadow.mapSize.width = 2048; 
    light.shadow.mapSize.height  = 2048;
    light.target.position.set(0, 0, 0);
    light.castShadow = true;
    return light;
}

/**
 * Create the AmbientLight
 * @returns THREE.SpotLight
 */
function createAmbientLight() {
    const light = new SpotLight(0x404040, 6);
    light.position.set(0, 400, 0);
    return light;
}

export { createSpotLight, createAmbientLight };