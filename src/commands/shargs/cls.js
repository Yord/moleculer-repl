const { subcommand } = require("shargs-opts");
const { wrapper } = require('../../usage/help')

const subCommandOpt = subcommand([]);

function handler(broker, cmd, args, errs) {
	process.stdout.write("\x1Bc");
}

module.exports = function (commands, broker) {
	const cmd = subCommandOpt(
		"cls", // Name
		["cls"], // Alias
		{
			desc: "Clear the terminal screen.", // Description
		}
	);

	const action = (args, errs) => wrapper(broker, cmd, args, errs, handler) // Handler

	return { ...cmd, action }
};
