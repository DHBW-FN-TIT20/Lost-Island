import { WebGLRenderer, PCFSoftShadowMap } from 'three';

/**
 * #TODO: Add description - was ist der renderer
 * @returns {WebGLRenderer}
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