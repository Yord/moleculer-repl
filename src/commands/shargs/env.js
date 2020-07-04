const { subcommand, flag } = require("shargs-opts");
const { wrapper } = require('../../usage/help')
const util 	= require("util");

/**
 * @typedef {import('moleculer').ServiceBroker} ServiceBroker Moleculer's Service Broker
 * @typedef {import('shargs-opts').Opt} Opt Sharg's sub command
 */

const subCommandOpt = subcommand([
	flag("help", ["--help"], { desc: "Output usage information" }),
]);

/**
 * Command logic
 * @param {ServiceBroker} broker Moleculer's Service Broker
 * @param {Opt} cmd Sharg's sub command
 * @param {Object} args Parsed arguments
 * @param {Array} errs Array of errors
 */
function handler(broker, cmd, args, errs) {
	console.log(util.inspect(process.env, { showHidden: false, depth: 4, colors: true }));
}

module.exports = function (commands, broker) {
	const cmd = subCommandOpt(
		"env", // Name
		["env"], // Alias
		{
			desc: "List of environment variables.", // Description
		}
	);
	
	// Register the handler
	const action = (args, errs) => wrapper(broker, cmd, args, errs, handler)
	
	return { ...cmd, action }
};
