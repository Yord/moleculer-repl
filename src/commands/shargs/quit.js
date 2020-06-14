const { subcommand, stringPos } = require("shargs-opts");

const echoCmd = subcommand([
	stringPos("text", { desc: "This text is echoed.", descArg: "TEXT" }),
]);

async function call(broker, args) {
	await broker.stop()
    process.exit(0);
}

module.exports = function (commands, broker) {
	return echoCmd(
		"quit", // Name
		["quit", "q", "exit"], // Alias
		{
			action: (args) => call(broker, args), // Handler
			desc: "Exit application.", // Description
		}
	);
};
