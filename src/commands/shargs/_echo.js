const { subcommand, stringPos } = require("shargs-opts");

const subCommandOpt = subcommand([
	stringPos("text", { desc: "This text is echoed.", descArg: "TEXT" }),
]);

function call(broker, args) {
	const { text } = args;
	broker.logger.info({ text });
}

module.exports = function (commands, broker) {
	return subCommandOpt(
		"echo", // Name
		["echo"], // Alias
		{
			action: (args) => call(broker, args), // Handler
			desc: "Echos a string.", // Description
		}
	);
};
