const { subcommand, flag } = require("shargs-opts");
const { wrapper } = require('../../usage/help')

/**
 * @typedef {import('moleculer').ServiceBroker} ServiceBroker Moleculer's Service Broker
 * @typedef {import('shargs-opts').Opt} Opt Sharg's sub command
 */

const subCommandOpt = subcommand([
	// flag("help", ["--help"], { desc: "Output usage information" }),
]);

/**
 * Command logic
 * @param {ServiceBroker} broker Moleculer's Service Broker
 * @param {Opt} cmd Sharg's sub command
 * @param {Object} args Parsed arguments
 * @param {Array} errs Array of errors
 */
async function handler(broker, cmd, args, errs) {
	await broker.stop()
    process.exit(0);
}

/**
 * @param {Opt} commands Sharg's command opt
 * @param {ServiceBroker} broker Moleculer's Service Broker
 */
module.exports = function (commands, broker) {
	const cmd = subCommandOpt(
		"quit", // Name
		["quit", "q", "exit"], // Alias
		{
			desc: "Exit the application.", // Description
		}
	);
	
	// Register the handler
	const action = (args, errs) => wrapper(broker, cmd, args, errs, handler)
	
	return { ...cmd, action }
};
