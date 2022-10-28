import { SpotLight, AmbientLight } from 'three';

function createSpotLight() {
    const light = new SpotLight(0xffffff, 1);
    light.position.set(100, 100, 0);
    return light;
}

function createAmbientLight() {
    const light = new SpotLight(0x404040, 6);
    light.position.set(0, 400, 0);
    return light;
}

export { createSpotLight, createAmbientLight };