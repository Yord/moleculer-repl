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
function handler(broker, cmd, args, errs) {
	process.stdout.write("\x1Bc");
}

module.exports = function (commands, broker) {
	const cmd = subCommandOpt(
		"cls", // Name
		["cls"], // Alias
		{
			desc: "Clear the terminal screen.", // Description
		}
	);

	const action = (args, errs) => wrapper(broker, cmd, args, errs, handler) // Handler

	return { ...cmd, action }
};
