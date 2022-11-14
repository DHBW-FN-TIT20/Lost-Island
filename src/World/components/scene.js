import { Color, Scene } from 'three';

/**
 * Setup the Scene
 * @returns Scene
 */
function createScene() {
    const scene = new Scene();

    scene.background = new Color('lightgray');

    return scene;
}

export { createScene };