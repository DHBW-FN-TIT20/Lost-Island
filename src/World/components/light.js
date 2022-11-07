import { SpotLight, AmbientLight } from 'three';

function createSpotLight(position) {
    const light = new SpotLight(0x404040, 3);
    light.position.set(position.x *1000, position.y *1000000, position.z*1000);
    light.castShadow = true;
    return light;
}

function createAmbientLight() {
    const light = new SpotLight(0x404040, 6);
    light.position.set(0, 400, 0);
    return light;
}

export { createSpotLight, createAmbientLight };