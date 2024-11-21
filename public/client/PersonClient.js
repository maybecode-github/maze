"use strict";

import {gameClient} from "./GameClient.js";

export class PersonClient {

    constructor(baseURL) {
        if (!baseURL) throw new Error("Base URl is required for the PersonClient.")
        this.baseUrl = baseURL;
    }

    /**
     * Fetches the current state of the person from the API.
     * The server returns information such as the person’s current position,
     * items they possess, and other relevant attributes.
     * @returns A Promise that resolves to a JSON object containing the person's data.
     * Throws an error if the HTTP request fails.
     */
    async getPerson() {
        const response = await fetch(this.baseUrl + '/person', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        });

        if (response.ok) {
            return response.json();
        }

        throw new Error("HTTP-Error: " + response.status);
    }

    /**
     * Sends a request to move the person in the specified direction.
     * The server validates the move and returns the updated position of the person.
     * @param direction (string): A cardinal direction indicating where the person should move.
     * Must be one of the following:
     * "n" (north)
     * "s" (south)
     * "w" (west)
     * "e" (east)
     * @returns A Promise that resolves to a JSON object containing the updated position of the person.
     * Throws:
     * An Error if the direction is invalid (not one of "n", "s", "w", "e").
     * An Error if the server rejects the move (e.g., invalid position or another error).
     */
    async movePerson(direction) {
        if (!["n", "s", "w", "e"].includes(direction)) {
            throw new Error("Invalid direction " + direction + ". Use n, s, w, or e instead.");
        }

        const response = await fetch(this.baseUrl + '/person?go=' + direction, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include' // for cookies if needed for auth
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error("Error moving person: " + errorData);
        }

        await gameClient.update();
        return await response.json();
    }

    /**
     * Attempts to pick up an item located at the person’s current position.
     * The server validates the request and, if successful, returns information about the item taken.
     * @param thingName (string): The name of the item the person wishes to take.
     * This must correspond to an item available at the person’s current position.
     * @returns A Promise that resolves to a JSON object containing details about the item successfully taken.
     * Throws:
     * An Error if thingName is not provided.
     * An Error if the server rejects the request (e.g., the item is not present or cannot be picked up).
     */
    async takeThing(thingName) {
        if (!thingName) {
            throw new Error("Thing name is required.");
        }

        const response = await fetch(`${this.baseUrl}/person/thing`, {
            "method": 'POST',
            "headers": {
                'Content-Type': 'application/json'
            },
            "credentials": 'include',
            "body": JSON.stringify({"name": thingName})
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error("Error taking thing: " + errorData);
        }

        await gameClient.update();
        return await response.json();
    }

}

export default PersonClient