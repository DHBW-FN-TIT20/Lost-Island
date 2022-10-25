import { SpotLight } from 'three';

function createSpotLight() {
    const light = new SpotLight(0xffffff, 3);
    light.position.set(0, 100, 0);
    return light;
}

export { createSpotLight };