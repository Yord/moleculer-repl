const kleur 			= require("kleur");
const fs 				= require("fs");
const path				= require("path");
const _ 				= require("lodash");
const util 				= require("util");
const { convertArgs } 	= require("../../utils");
const humanize 			= require("tiny-human-time").short;
const isStream			= require("is-stream");
const {flag, subcommand, stringPos, string, variadicPos} = require("shargs-opts");
const {help} = require("../../usage/help")

const subCommandOpt = broker => subcommand([
		stringPos('actionName', {
			desc: "Action name (e.g., greeter.hello)",
			required: true,
			only: _.uniq(_.compact(broker.registry.getActionList({}).map(item => item && item.action ? item.action.name: null)))
		}),
		variadicPos('customOptions', {bestGuess: true}),
		stringPos('jsonParams', { desc: `JSON Parameters (e.g. '{"a": 5}' )`, descArg: 'jsonParams'} ),
		stringPos('meta', { desc: "Metadata to pass to the service action. Must start with '#' (e.g., --#auth 123)", descArg: 'meta'} ),
	  flag("help", ["--help"], { desc: "output usage information" }),
		string("load", ["--load"], { desc: "Load params from file.", descArg: 'filename' }),
		string("stream", ["--stream"], { desc: "Save response to file.", descArg: 'filename' }),
		string("save", ["--save"], { desc: "Save response to file.", descArg: 'filename' }),
]);

function call(broker, opt, args, errs) {
	return new Promise(resolve => {
		const style = {
			line: [{ padStart: 2, width: 78 }],
			cols: [{ padStart: 4, width: 20 }, { width: 56 }]
		}
	
		const usage = help(opt)(style)
	
		setTimeout(() => {
			if (args.options.help) {
				console.log(`\n${usage}`)
				resolve(42)
			} else if (errs.length > 0) {
				const errStr = errs.map(err => err.msg).join('\n')
				console.log(`\n  ${errStr}\n\n${usage}`)
				resolve(42)
			} else {
				console.log(args)
				resolve(42)
			}
		}, 1000)
	})
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
