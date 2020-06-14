const { subcommand, string, stringPos } = require("shargs-opts");

const subCommandOpt = subcommand([
	stringPos("text", {
		desc: "This text is transformed into upper or lower case.",
	}),
	string("mode", ["--mode"], {
		only: ["upper", "lower"],
		desc: "How to transform the text.",
	}),
]);

async function call(broker, { text = "", mode }) {
	switch (mode) {
		case "upper": {
			text = text.toUpperCase();
			break;
		}
		case "lower": {
			text = text.toLowerCase();
			break;
		}
	}
	broker.logger.info(text);
}

module.exports = function (commands, broker) {
	return subCommandOpt("case", ["case"], {
		action: (args) => call(broker, args),
		desc:
			"Transforms its argument into upper or lower case depending on the --mode.",
	});
};
