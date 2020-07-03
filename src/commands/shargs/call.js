const kleur 			= require("kleur");
const fs 				= require("fs");
const path				= require("path");
const _ 				= require("lodash");
const util 				= require("util");
const { convertArgs } 	= require("../../utils");
const humanize 			= require("tiny-human-time").short;
const isStream			= require("is-stream");
const { flag, subcommand, stringPos, string, variadicPos } = require("shargs-opts");
const { commandUsage } = require("../../usage/help")

const subCommandOpt = broker => subcommand([
		stringPos('actionName', {
			desc: "Action name (e.g., greeter.hello)",
			required: true,
			only: _.uniq(_.compact(broker.registry.getActionList({}).map(item => item && item.action ? item.action.name: null)))
		}),
		variadicPos('customOptions', { bestGuess: true }),
		stringPos('jsonParams', { desc: `JSON Parameters (e.g. '{"a": 5}' )`, descArg: 'jsonParams'} ),
		stringPos('meta', { desc: "Metadata to pass to the service action. Must start with '#' (e.g., --#auth 123)", descArg: 'meta'} ),
	    flag("help", ["--help"], { desc: "output usage information" }),
		string("load", ["--load"], { desc: "Load params from file.", descArg: 'filename' }),
		string("stream", ["--stream"], { desc: "Save response to file.", descArg: 'filename' }),
		string("save", ["--save"], { desc: "Save response to file.", descArg: 'filename' }),
]);

async function call(broker, cmd, args, errs) {
	// Check for errs and show the command usage
	if (errs.length > 0) {
		const errStr = errs.map(err => err.msg).join('\n')
		console.log(`\n  ${errStr}\n\n${commandUsage(cmd)}`)
		return
	}

	// Show command usage details
	if (args.options.help)
		return console.log(`\n${commandUsage(cmd)}`)

	
	// Do normal stuff
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

	const action = (args, errs) => call(broker, cmd, args, errs) // Handler

	return { ...cmd, action }
};
