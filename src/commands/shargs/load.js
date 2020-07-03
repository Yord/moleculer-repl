const { subcommand, stringPos, string } = require("shargs-opts");
const kleur = require("kleur");
const fs = require("fs");
const path = require("path");

const loadCommandOpt = subcommand([
	stringPos("servicePath", { desc: "Path to the service file.", descArg: "servicePath", required: true}),
]);

const loadFolderCommandOpt = subcommand([
	stringPos("serviceFolder", { desc: "Path to the folder.", descArg: "serviceFolder", required: true }),
	stringPos("fileMask", { desc: "Path to the service.", descArg: "fileMask", }),
]);

function call(broker, args, errs) {
	// console.log(args)
	// console.log(errs)

	if (errs.length > 0) {
		const errStr = errs.map(err => err.msg).join('\n')
		console.log(`\n  ${errStr}\n`)
		return
	}

	let filePath = path.resolve(args.servicePath);
	if (fs.existsSync(filePath)) {
		console.log(kleur.yellow(`>> Load '${filePath}'...`));
		let service = broker.loadService(filePath);
		if (service) console.log(kleur.green(">> Loaded successfully!"));
	} else {
		console.warn(kleur.red("The service file is not exists!", filePath));
	}
}

module.exports = function (commands, broker) {
	return [
		loadCommandOpt(
			"load", // Name
			["load"], // Alias
			{
				action: (args, err) => call(broker, cmd, args, err), // Handler
				desc: "Load a service from file.", // Description
			}
		),
		loadFolderCommandOpt(
			"loadFolder", // Name
			["loadFolder"], // Alias
			{
				action: (args, err) => call(broker, args, err), // Handler
				desc: "Load all services from folder.", // Description
			}
		),
	];
};
