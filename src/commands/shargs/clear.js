const { subcommand, stringPos, flag } = require("shargs-opts");
const { wrapper } = require('../../usage/help')
const kleur 			= require("kleur");
const util = require("util")

/**
 * @typedef {import('moleculer').ServiceBroker} ServiceBroker Moleculer's Service Broker
 * @typedef {import('shargs-opts').Opt} Opt Sharg's sub command
 */

const subCommandOpt = subcommand([
    stringPos("pattern", { desc: "Clear cache entries.", descArg: "pattern"}),
	flag("help", ["--help"], { desc: "Output usage information" }),
]);

/**
 * Command logic
 * @param {ServiceBroker} broker Moleculer's Service Broker
 * @param {Opt} cmd Sharg's sub command
 * @param {Object} args Parsed arguments
 * @param {Array} errs Array of errors
 */
async function handler(broker, cmd, args, errs) {
    if (broker.cacher) {
		try {
			await broker.cacher.clean(args.pattern)
			console.log(kleur.yellow().bold(args.pattern ? "Cacher cleared entries by pattern." : "Cacher cleared all entries."));	
		} catch (err) {
			console.error(kleur.red().bold(">> ERROR:", err.message));
			console.error(kleur.red().bold(err.stack));
			console.error("Data: ", util.inspect(err.data, { showHidden: false, depth: 4, colors: true }));
		}
        return;
    }

    console.log(kleur.red().bold("No cacher."));
}

/**
 * @param {Opt} commands Sharg's command opt
 * @param {ServiceBroker} broker Moleculer's Service Broker
 */
module.exports = function (commands, broker) {
	const cmd = subCommandOpt(
		"clear", // Name
		["clear"], // Alias
		{
			desc: "Clear cache entries.", // Description
		}
	);
	
	// Register the handler
	const action = (args, errs) => wrapper(broker, cmd, args, errs, handler)
	
	return { ...cmd, action }
};
