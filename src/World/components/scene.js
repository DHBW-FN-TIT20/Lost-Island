import { Color, Scene } from 'three';

function createScene() {
    const scene = new Scene();

    scene.background = new Color('darkblue');

    return scene;
}

export { createScene };