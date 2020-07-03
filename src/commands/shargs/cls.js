const { subcommand, stringPos } = require("shargs-opts");

const subCommandOpt = subcommand([]);

function call(broker, cmd, args, errs) {
	process.stdout.write("\x1Bc");
}

module.exports = function (commands, broker) {
	const cmd = subCommandOpt(
		"cls", // Name
		["cls"], // Alias
		{
			desc: "Clear console.", // Description
		}
	);

	const action = (args, errs) => call(broker, cmd, args, errs) // Handler

	return { ...cmd, action }
};
