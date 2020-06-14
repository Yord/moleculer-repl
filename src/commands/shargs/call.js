const { subcommand, stringPos, string } = require("shargs-opts");
const kleur 			= require("kleur");
const fs 				= require("fs");
const path				= require("path");
const _ 				= require("lodash");
const util 				= require("util");
const { convertArgs } 	= require("../../utils");
const humanize 			= require("tiny-human-time").short;
const isStream			= require("is-stream");

const subCommandOpt = subcommand([
    stringPos('actionName', { desc: "Action name (e.g., greeter.hello)", descArg: 'actionName', required: true} ),
    stringPos('jsonParams', { desc: `JSON Parameters (e.g. '{"a": 5}' )`, descArg: 'jsonParams'} ),
    stringPos('meta', { desc: "Metadata to pass to the service action. Must start with '#' (e.g., --#auth 123)", descArg: 'meta'} ),
    string("load", ["--load"], { desc: "Load params from file.", descArg: 'filename' }),
    string("stream", ["--stream"], { desc: "Save response to file.", descArg: 'filename' }),
    string("save", ["--save"], { desc: "Save response to file.", descArg: 'filename' }),
]);

function call(broker, args) {
    console.log(args)
}

module.exports = function (commands, broker) {
	return subCommandOpt(
		"call", // Name
		["call"], // Alias
		{
			action: (args) => call(broker, args), // Handler
			desc: "Call an action.", // Description
		}
	);
};
