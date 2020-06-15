const { subcommand, stringPos, string } = require("shargs-opts");
const kleur 			= require("kleur");
const fs 				= require("fs");
const path 				= require("path");

const subCommandOpt = subcommand([
    stringPos('servicePath', { desc: "Path to the service file.", descArg: 'servicePath'} ),
]);

function call(broker, args) {
    let filePath = path.resolve(args.servicePath);
    if (fs.existsSync(filePath)) {
        console.log(kleur.yellow(`>> Load '${filePath}'...`));
        let service = broker.loadService(filePath);
        if (service)
            console.log(kleur.green(">> Loaded successfully!"));
    } else {
        console.warn(kleur.red("The service file is not exists!", filePath));
    }
}

module.exports = function (commands, broker) {
	return subCommandOpt(
		"load", // Name
		["load"], // Alias
		{
			action: (args) => call(broker, args), // Handler
			desc: "Load a service from file.", // Description
		}
	);
};
