"use strict";

const glob = require("glob");
const path = require("path");

/**
 * @typedef {import('moleculer').ServiceBroker} ServiceBroker Moleculer's Service Broker
 * @typedef {import('shargs-opts').Opt} Opt Sharg's sub command
 */

 /**
  * @param {Opt} shargsCommand Shargs command
  * @param {ServiceBroker} broker Moleculer's Service Broker
  * @returns {Array<Opt>}
  */
module.exports = function(shargsCommand, broker) {
    const subCommands = []

	const files = glob.sync(path.join(__dirname, "*.js"));
	files.sort();
	files.forEach(file => {
        if (path.basename(file) != "index.js") {
            /** @type {Opt|Array<Opt>} */
            const command = require(file)(shargsCommand, broker)
            // In case of multiple commands in a single file
            if (Array.isArray(command)) subCommands.push(...command)
            else subCommands.push(command)
        }
    });
    
    return subCommands
};

