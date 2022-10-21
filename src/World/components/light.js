import { SpotLight } from 'three';

function createSpotLight() {
    const light = new SpotLight(0xffffff, 4);
    light.position.set(50, 50, 150);
    return light;
}

export { createSpotLight };