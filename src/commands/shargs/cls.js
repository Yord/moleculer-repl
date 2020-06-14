const { subcommand, stringPos } = require("shargs-opts");

const subCommandOpt = subcommand([
	stringPos("text", { desc: "This text is echoed.", descArg: "TEXT" }),
]);

function call(broker, args) {
	process.stdout.write("\x1Bc");
}

module.exports = function (commands, broker) {
	return subCommandOpt(
		"cls", // Name
		["cls"], // Alias
		{
			action: (args) => call(broker, args), // Handler
			desc: "Clear console.", // Description
		}
	);
};
