const kleur 			= require("kleur");
const fs 				= require("fs");
const path				= require("path");
const _ 				= require("lodash");
const util 				= require("util");
const { convertArgs } 	= require("../../utils");
const humanize 			= require("tiny-human-time").short;
const isStream			= require("is-stream");
const { flag, subcommand, stringPos, string, variadicPos } = require("shargs-opts");
const { wrapper } = require("../../usage/help")

const subCommandOpt = broker => subcommand([
		stringPos('eventName', {
			desc: "Event name",
			required: true,
			// only: _.uniq(_.compact(broker.registry.getEventList({}).map(item => item && item.event ? item.event.name: null)))
		}),
        variadicPos('customOptions', { bestGuess: true }),
        flag("help", ["--help"], { desc: "Output usage information" }),
]);

function handler(broker, cmd, args, errs) {
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
