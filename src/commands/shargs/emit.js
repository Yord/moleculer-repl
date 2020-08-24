const kleur 			= require("kleur");
const { convertArgs } 	= require("../../utils");
const { flag, subcommand, stringPos, string, variadicPos } = require("shargs-opts");
const { wrapper } = require("../../usage/help")
const _ = require('lodash')

/**
 * @typedef {import('moleculer').ServiceBroker} ServiceBroker Moleculer's Service Broker
 * @typedef {import('shargs-opts').Opt} Opt Sharg's sub command
 */

const subCommandOpt = broker => subcommand([
		stringPos('eventName', {
			desc: "Event name",
			required: true,
			only: _.uniq(_.compact(broker.registry.getEventList({}).map(item => item && item.event ? item.event.name: null)))
		}),
        variadicPos('customOptions', { bestGuess: true }),
        flag("help", ["--help"], { desc: "Output usage information" }),
]);

/**
 * Command logic
 * @param {ServiceBroker} broker Moleculer's Service Broker
 * @param {Object} args Parsed arguments
 */
function handler(broker, args) {
    let payload = {};
    let meta = {
        $repl: true
    };

    const opts = convertArgs(args.options);

    Object.keys(opts).map(key => {
        if (key.startsWith("#"))
            meta[key.slice(1)] = opts[key];
        else {
            if (key.startsWith("@"))
                payload[key.slice(1)] = opts[key];
            else
                payload[key] = opts[key];
        }
    });

    console.log(kleur.yellow().bold(`>> Emit '${args.eventName}' with payload:`), payload);
    broker.emit(args.eventName, payload, { meta });
}

/**
 * @param {Opt} commands Sharg's command opt
 * @param {ServiceBroker} broker Moleculer's Service Broker
 */
module.exports = function (commands, broker) {
	const cmd = subCommandOpt(broker)(
		"emit", // Name
		["emit"], // Alias
		{
			desc: "Emit an event.", // Description
		}
	);

	const action = (args, errs) => wrapper(broker, cmd, args, errs, handler) // Handler

	return { ...cmd, action }
};
