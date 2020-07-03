const { subcommand } = require("shargs-opts");
const util 	= require("util");

const subCommandOpt = subcommand([]);

function call(broker, cmd, args, errs) {
	console.log(util.inspect(process.env, { showHidden: false, depth: 4, colors: true }));
}

module.exports = function (commands, broker) {
	const cmd = subCommandOpt(
		"env", // Name
		["env"], // Alias
		{
			desc: "List of environment variables.", // Description
		}
	);

	const action = (args, errs) => call(broker, cmd, args, errs) // Handler

	return { ...cmd, action }
};
