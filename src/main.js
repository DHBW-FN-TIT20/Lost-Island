import { World } from './World/World.js';


async function main() {
    const spinner = document.getElementById("spinner");
    const container = document.getElementById("scene-container");
    let world = new World(container);
    await world.init(spinner);
    world.start();
}

main().catch((err) => {
    console.error(err);
});