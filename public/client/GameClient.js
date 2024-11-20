"use strict";

import PersonClient from "./PersonClient.js";
import PositionClient from "./PositionClient.js";
import DoorClient from "./DoorClient.js";

class GameClient {

    position;
    person;

    // Add a constructor that takes a baseURL and an updateInterval as parameters.
    constructor(baseURL, updateInterval = 5000) {
        this.updateInterval = updateInterval;
        this.personClient = new PersonClient(baseURL);
        this.positionClient = new PositionClient(baseURL);
        this.doorClient = new DoorClient(baseURL);

        this.startRegularUpdates();
    }

    /**
     * starts regular updates of the person and position info
     */
    startRegularUpdates() {
        this.update().then(r => console.log("Update successful")).catch(e => console.error("Update failed:", e));

        setInterval(() => {
            this.update().then(r => console.log("Update successful")).catch(e => console.error("Update failed:", e));
        }, this.updateInterval);
    }

    /**
     * Updates the person and position information.
     * @returns {Promise<void>}
     */
    async update() {
        await this.updatePersonInfo()
        await this.updatePositionInfo()
    }

    /**
     * Fetches the current state of the person from the API.
     * @returns {Promise<void>}
     */
    async updatePersonInfo() {
        try {
            const personData = await this.personClient.getPerson();
            this.person = personData;
            console.log("PersonInfo", personData);
        } catch (error) {
            console.error("Error updating person info: ", error);
        }
    }

    /**
     * Fetches the current position of the user.
     * @returns {Promise<void>}
     */
    async updatePositionInfo() {
        try {
            const positionData = await this.positionClient.getPosition();
            this.position = positionData;
            console.log("PositionInfo", positionData);
        } catch (error) {
            console.error("Error updating position info: ", error);
        }
    }

}

// Create a new GameClient instance with the base URL and update interval.
const gameClient = new GameClient('/api', 1000);
export {gameClient}