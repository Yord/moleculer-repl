const { subcommand, stringPos, flag } = require("shargs-opts");
const { wrapper } = require('../../usage/help')
const kleur 			= require("kleur");

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
function handler(broker, cmd, args, errs) {
    if (broker.cacher) {
        broker.cacher.clean(args.pattern).then(() => {
            console.log(kleur.yellow().bold(args.pattern ? "Cacher cleared entries by pattern." : "Cacher cleared all entries."));
            done();
        });
        return;
    }

    console.log(kleur.red().bold("No cacher."));
}

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
