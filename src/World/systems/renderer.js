import { WebGLRenderer } from 'three';

function createRenderer() {
    const renderer = new WebGLRenderer({
        powerPreference: "high-performance",
        antialias : false
    });
    renderer.setPixelRatio( window.devicePixelRatio*0.5);
    return renderer;
}

export { createRenderer };