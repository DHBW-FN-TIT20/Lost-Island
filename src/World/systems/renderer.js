import { WebGLRenderer, PCFSoftShadowMap } from 'three';

/**
 * Create a renderer for the scene and set its shadow map. 
 * @returns {THREE.WebGLRenderer}
 */
function createRenderer() {
    const renderer = new WebGLRenderer({
        powerPreference: "high-performance",
        antialias: true
    });
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = PCFSoftShadowMap;
    renderer.domElement.style.backgroundColor = "#555555";
    return renderer;
}

export { createRenderer };