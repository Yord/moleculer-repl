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
		stringPos('actionName', {
			desc: "Action name (e.g., greeter.hello)",
			required: true,
			only: _.uniq(_.compact(broker.registry.getActionList({}).map(item => item && item.action ? item.action.name: null)))
		}),
		variadicPos('customOptions', { bestGuess: true }),
		stringPos('jsonParams', { desc: `JSON Parameters (e.g. '{"a": 5}' )`, descArg: 'jsonParams'} ),
		stringPos('meta', { desc: "Metadata to pass to the service action. Must start with '#' (e.g., --#auth 123)", descArg: 'meta'} ),
	    flag("help", ["--help"], { desc: "Output usage information" }),
		string("load", ["--load"], { desc: "Load params from file.", descArg: 'filename' }),
		string("stream", ["--stream"], { desc: "Save response to file.", descArg: 'filename' }),
		string("save", ["--save"], { desc: "Save response to file.", descArg: 'filename' }),
]);

async function handler(broker, cmd, args, errs) {
	console.log(args)
}

module.exports = function (commands, broker) {
	const cmd = subCommandOpt(broker)(
		"call", // Name
		["call"], // Alias
		{
			desc: "Call an action.", // Description
		}
	);

	const action = (args, errs) => wrapper(broker, cmd, args, errs, handler) // Handler

	return { ...cmd, action }
};
