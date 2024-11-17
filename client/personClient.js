"use strict";

class PersonClient {
    constructor(baseUrl) {
        if (!baseUrl) throw new Error("Base URl is required for the PersonClient.")
        this.baseUrl = baseUrl;
    }

    async getPerson() {
        const response = await fetch(this.baseUrl + '/');
        if (response.ok) {
            return response.json();
        }
        throw new Error("HTTP-Error: " + response.status);
    }

    async movePerson(direction) {
        if (!["n", "s", "w", "e"].includes(direction)) {
            throw new Error("Invalid direction " + direction + ". Use n, s, w, or e instead.");
        }

        const response = await fetch(this.baseUrl + '/?go=' + direction, {
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

        return await response.json();
    }

    async takeThing(thingName) {
        if (!thingName) {
            throw new Error("Thing name is required.");
        }

        const response = await fetch('${this.baseUrl}/thing', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({name: thingName})
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error("Error taking thing: " + errorData);
        }

        return await response.json();
    }

}

module.exports = PersonClient;