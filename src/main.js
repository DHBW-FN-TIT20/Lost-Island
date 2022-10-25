import { World } from './World/World.js';

async function main() {
    const container = document.getElementById("scene-container");
    const world = new World(container);
    await world.init();
    world.start();
}
main().catch((err) => {
    console.error(err);
});