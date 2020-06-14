const { subcommand, stringPos } = require("shargs-opts");

const echoCmd = subcommand([
	stringPos("text", { desc: "This text is echoed.", descArg: "TEXT" }),
]);

function call(broker, args) {
	const { text } = args;
	return broker.logger.info({ text });
}

module.exports = function (commands, broker) {
	return echoCmd(
		"echo", // Name
		["echo"], // Alias
		{
			action: (args) => call(broker, args), // Handler
			desc: "Echos a string.", // Description
		}
	);
};
