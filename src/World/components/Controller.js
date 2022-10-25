import {
    Vector3,
    Euler
} from 'three';


const _euler = new Euler(0, 0, 0, 'YXZ');
const _PI_2 = Math.PI / 2;

class Controller {
    #camera;

    constructor(camera, height = 5, weight = 2, moveSpeed = 5, sensitivity = 0.005) {
        this.#camera = camera;
        this.height = height;
        this.weight = weight;
        this.moveSpeed = moveSpeed;
        this.sensitivity = sensitivity;

        this.acceleration = new Vector3(0, 0, 0);
        this.velocity = new Vector3(0, 0, 0);
        this.location = new Vector3(this.#camera.position.x, this.#camera.position.y, this.#camera.position.z);

        document.addEventListener("keydown", (ev) => {
            this.#checkMove(ev)
        });

        document.addEventListener('mousemove', (ev) => {
            if (ev.buttons != 1) {
                return;
            }

            // Range is 0 to Math.PI radians
            this.minPolarAngle = 0; // radians
            this.maxPolarAngle = Math.PI; // radians

            this.pointerSpeed = 1.0;

            const scope = this;


            const movementX = ev.movementX;
            const movementY = ev.movementY;

            _euler.setFromQuaternion(this.#camera.quaternion);

            _euler.y -= movementX * this.sensitivity;
            _euler.x -= movementY * this.sensitivity;

            _euler.x = Math.max(_PI_2 - scope.maxPolarAngle, Math.min(_PI_2 - scope.minPolarAngle, _euler.x));

            this.#camera.quaternion.setFromEuler(_euler);

        });
    }


    /**
     * Add a force to the movement with weight of the object
     * @param {Vector3} force Some Forces
     */
    applyForce(force) {
        force.divideScalar(this.weight);
        this.acceleration.add(force);
    }

    /**
     * Add a force to the movement without weight of the object
     * @param {Vector3} force Some Forces
     */
    applyDirectForce(force) {
        this.location.x += force.x;
        this.location.y += force.y;
        this.location.z += force.z;
    }

    applyGround(minHeight) {
        if (this.location.y - this.height < minHeight) {
            this.location.y = minHeight + this.height;
            this.velocity.y = 0;
        }
    }

    update() {
        this.velocity.add(this.acceleration);
        this.location.add(this.velocity);

        this.#camera.position.x = this.location.x;
        this.#camera.position.y = this.location.y;
        this.#camera.position.z = this.location.z;
    }

    /**
     *
     * @param {KeyboardEvent} event 
     */
    #checkMove(event) {
        let x = 0;
        let z = 0;

        if (event.key.toUpperCase() == "D") {
            x = Math.cos(this.#camera.rotation.y) * this.moveSpeed;
            z = -Math.sin(this.#camera.rotation.y) * this.moveSpeed;
        }
        else if (event.key.toUpperCase() == "A") {
            x = -Math.cos(this.#camera.rotation.y) * this.moveSpeed;
            z = Math.sin(this.#camera.rotation.y) * this.moveSpeed;
        }
        else if (event.key.toUpperCase() == "S") {
            x = -Math.cos(this.#camera.rotation.y + Math.PI / 2) * this.moveSpeed;
            z = Math.sin(this.#camera.rotation.y + Math.PI / 2) * this.moveSpeed;
        }
        else if (event.key.toUpperCase() == "W") {
            x = -Math.cos(this.#camera.rotation.y - Math.PI / 2) * this.moveSpeed;
            z = Math.sin(this.#camera.rotation.y - Math.PI / 2) * this.moveSpeed;
        }

        this.applyDirectForce(new Vector3(x, 0, z));
    }
}

export { Controller };