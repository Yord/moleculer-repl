"use strict";

const glob = require("glob");
const path = require("path");

module.exports = function(shargsCommand, broker) {
    const subCommands = []

	const files = glob.sync(path.join(__dirname, "*.js"));
	files.sort();
	files.forEach(file => {
        if (path.basename(file) != "index.js") {
            const command = require(file)(shargsCommand, broker)
            // In case of multiple commands in a single file
            if (Array.isArray(command)) subCommands.push(...command)
            else subCommands.push(command)
        }
    });
    
    return subCommands
};

