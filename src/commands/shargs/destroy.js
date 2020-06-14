const { subcommand, stringPos, string } = require("shargs-opts");
const kleur 			= require("kleur");

const subCommandOpt = subcommand([
    stringPos('serviceName', { desc: "Name of the service to destroy", descArg: 'serviceName'} ),
    stringPos('version', { desc: "Name of the service to destroy", descArg: 'version'} )
]);

function call(broker, args) {
    const serviceName = args.serviceName;
    const version = args.version;

    const service = broker.getLocalService(serviceName, version);

    if (!service) {
        console.warn(kleur.red(`Service "${serviceName}" doesn't exists!`));
        return;
    }

    const p = broker.destroyService(service);
    console.log(kleur.yellow(`>> Destroying '${serviceName}'...`));
    p.then(res => {
        console.log(kleur.green(">> Destroyed successfully!"));
    }).catch(err => {
        console.error(kleur.red(">> ERROR:", err.message));
        console.error(kleur.red(err.stack));
    })
}

module.exports = function (commands, broker) {
	return subCommandOpt(
		"destroy", // Name
		["destroy"], // Alias
		{
			action: (args) => call(broker, args), // Handler
			desc: "Destroy a local service.", // Description
		}
	);
};
