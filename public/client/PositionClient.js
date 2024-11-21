"use strict";

import {gameClient} from "./GameClient.js";

export class PositionClient {
    constructor(baseURL) {
        if (!baseURL) throw new Error("Base URL is required for the PositionClient.");
        this.baseURL = baseURL;
    }


    /**
     * Fetch the current position of the user.
     * @returns {Promise<object>} - The user's current position.
     * @throws {Error} - If the request fails.
     */
    async getPosition() {
        try {
            const response = await fetch(this.baseURL + '/position', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            });

            if (response.ok) {
                return await response.json();
            }
        } catch (error) {
            throw new Error("Failed to fetch position: " + error.message);
        }
    }

    /**
     * Drop a thing at the user's current position.
     * @param {string} thingName - The name of the thing to drop.
     * @returns {Promise<object>} - The dropped thing's details.
     * @throws {Error} - If the thing's name is missing or the request fails.
     */
    async dropThing(thingName) {
        if (!thingName) {
            throw new Error("Thing name is required to drop a thing.");
        }

        try {
            const response = await fetch(this.baseURL + '/position/thing', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({name: thingName})
            });

            if (response.ok) {
                await gameClient.update();
                return await response.json();
            }
        } catch (error) {
            throw new Error("Failed to drop thing: " + error.message);
        }
    }
}

export default PositionClient