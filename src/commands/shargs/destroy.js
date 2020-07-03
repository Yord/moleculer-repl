const { subcommand, stringPos, flag } = require("shargs-opts");
const { commandUsage } = require("../../usage/help")
const kleur 			= require("kleur");

const subCommandOpt = subcommand([
    stringPos('serviceName', { desc: "Name of the service to destroy", descArg: 'serviceName', required: true } ),
    stringPos('version', { desc: "Name of the service to destroy", descArg: 'version'} ),
    flag("help", ["--help"], { desc: "Output usage information" })
]);

async function call(broker, cmd, args, errs) {
    // Check for errs and show the command usage
	if (errs.length > 0) {
		const errStr = errs.map(err => err.msg).join('\n')
		console.log(`\n  ${errStr}\n\n${commandUsage(cmd)}`)
		return
	}

    // Show command usage details
	if (args.options.help) {
        return console.log(`\n${commandUsage(cmd)}`)
    }

    const serviceName = args.serviceName;
    const version = args.version;

    const service = broker.getLocalService(serviceName, version);

    if (!service) {
        console.warn(kleur.red(`Service "${serviceName}" doesn't exists!`));
        return;
    }

    const p = broker.destroyService(service);
    console.log(kleur.yellow(`>> Destroying '${serviceName}'...`));

    try {
        await p
        console.log(kleur.green(">> Destroyed successfully!"));
    } catch (error) {
        console.error(kleur.red(">> ERROR:", error.message));
        console.error(kleur.red(error.stack));
    }
}

module.exports = function (commands, broker) {
    const cmd = subCommandOpt(
		"destroy", // Name
		["destroy"], // Alias
		{
			desc: "Destroy a local service.", // Description
		}
	);

	const action = (args, errs) => call(broker, cmd, args, errs) // Handler

	return { ...cmd, action }
};
