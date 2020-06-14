const {
	subcommand,
	command,
	string,
	stringPos,
	variadic,
} = require("shargs-opts");
const {
	desc,
	optsDef,
	optsLists,
	space,
	synopsis,
	usage,
} = require("shargs-usage");

const caseCmd = subcommand([
	stringPos("text", {
		desc: "This text is transformed into upper or lower case.",
	}),
	string("mode", ["--mode"], {
		only: ["upper", "lower"],
		desc: "How to transform the text.",
	}),
]);

async function caseF(broker, { text = "", mode }) {
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
	// return
}

module.exports = function (commands, broker) {
	return caseCmd("case", ["case"], {
		action: (args) => caseF(broker, args),
		desc:
			"Transforms its argument into upper or lower case depending on the --mode.",
	});
};
