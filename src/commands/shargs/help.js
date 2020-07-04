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

function handler(commands, broker, command) {
	const subDocs = usage([synopsis, space, optsDef, space, desc]);

	const style = {
		line: [{ width: 120 }],
		cols: [{ width: 25, padEnd: 2 }, { width: 53 }],
	};

	let help = ''

	if (Array.isArray(command) && command.length === 0) {
		help = optsLists(commands)(style);
	} else {
		const command2 = Array.isArray(command) ? command : [command];
		const subcommands = commands.opts.filter(({ key }) =>
			command2.includes(key)
		);
		const helps = subcommands.map((cmd) => subDocs(cmd)(style));
		help = helps.join("\n");
	}

	console.log(help)
}

module.exports = function (commands, broker) {
	return variadic("help", ["help"], {
		action: (args) => handler(commands, broker, args),
		desc: "Print usage documentation.",
	});
};
