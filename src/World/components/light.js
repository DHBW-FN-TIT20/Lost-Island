import { SpotLight } from 'three';

function createSpotLight() {
    const light = new SpotLight(0xFF0000);
    light.position.set(50, 50, 150);
    return light;
}

export { createSpotLight };