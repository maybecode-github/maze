"use strict";

class DoorClient {

    constructor(baseURL) {
        if (!baseURL) throw new Error("Base URL is required for the DoorClient.");
        this.baseURL = baseURL;
    }

    /**
     * Fetch the door information in a specific direction.
     * @param {string} direction - The direction to check for a door (e.g., "n", "s", "w", "e").
     * @returns {Promise<object>} - The door information if found.
     * @throws {Error} - If no door exists or the request fails.
     */
    async getDoor(direction) {
        if (!direction) {
            throw new Error("Direction is required to fetch door information.");
        }

        const response = await fetch(this.baseURL + '/door/' + direction, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        });

        if (!response.ok) {
            throw new Error("HTTP-Error: " + response.status);
        }

        return response.json();
    }

    /**
     * Change the status of a door in a specific direction.
     * @param {string} direction - The direction of the door (e.g., "n", "s", "w", "e").
     * @param {string} action - The action to perform (e.g., "open", "close", "lock", "unlock").
     * @param {string} [key] - The key to use for locking/unlocking (optional).
     * @returns {Promise<object>} - The updated door information.
     * @throws {Error} - If the action is invalid, the user lacks the key, or the request fails.
     */
    async changeDoorStatus(direction, action, key) {
        if (!direction) {
            throw new Error("Direction is required to change the door status.");
        }
        if (!["open", "close", "lock", "unlock"].includes(action)) {
            throw new Error("Invalid action. Allowed: open, close, lock, unlock");
        }

        const body = {action};
        if (action === "lock" || action === "unlock") {
            if (!key) {
                throw new Error("Key is required to lock or unlock the door.");
            }
            body.key = key;
        }

        const response = await fetch(this.baseURL + '/door/' + direction, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            throw new Error("HTTP-Error: " + response.status);
        }

        return await response.json();
    }

}

export default DoorClient