const { subcommand, stringPos } = require("shargs-opts");
const util 	= require("util");

const subCommandOpt = subcommand([]);

function call(broker, args) {
	console.log(util.inspect(process.env, { showHidden: false, depth: 4, colors: true }));
}

module.exports = function (commands, broker) {
	return subCommandOpt(
		"env", // Name
		["env"], // Alias
		{
			action: (args) => call(broker, args), // Handler
			desc: "List of environment variables.", // Description
		}
	);
};
