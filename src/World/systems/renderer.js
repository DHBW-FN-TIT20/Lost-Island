import { WebGLRenderer, PCFSoftShadowMap } from 'three';

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