const { subcommand, flag } = require("shargs-opts");
const { wrapper } = require('../../usage/help')

const subCommandOpt = subcommand([
	flag("help", ["--help"], { desc: "Output usage information" }),
]);

async function handler(broker, cmd, args, errs) {
	await broker.stop()
    process.exit(0);
}

module.exports = function (commands, broker) {
	const cmd = subCommandOpt(
		"quit", // Name
		["quit", "q", "exit"], // Alias
		{
			desc: "Exit the application.", // Description
		}
	);
	
	// Register the handler
	const action = (args, errs) => wrapper(broker, cmd, args, errs, handler)
	
	return { ...cmd, action }
};
