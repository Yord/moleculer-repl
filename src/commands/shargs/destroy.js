const { subcommand, stringPos, flag } = require("shargs-opts");
const { wrapper } = require("../../usage/help")
const kleur 			= require("kleur");
const _ 				= require("lodash");

/**
 * @typedef {import('moleculer').ServiceBroker} ServiceBroker Moleculer's Service Broker
 * @typedef {import('shargs-opts').Opt} Opt Sharg's sub command
 */

const subCommandOpt = broker => subcommand([
    stringPos('serviceName', {
        desc: "Name of the service to destroy",
        required: true,
        only: _.uniq(_.compact(broker.registry.getServiceList( {
                onlyLocal: true,
                onlyAvailable: true,
                skipInternal: true,
                withActions: true,
                withEvents: true
        }).map(service => service.fullName)))
    }),
    stringPos('version', { desc: "Name of the service to destroy", descArg: 'version'} ),
    flag("help", ["--help"], { desc: "Output usage information" })
]);

/**
 * Command logic
 * @param {ServiceBroker} broker Moleculer's Service Broker
 * @param {Opt} cmd Sharg's sub command
 * @param {Object} args Parsed arguments
 * @param {Array} errs Array of errors
 */
async function handler(broker, cmd, args, errs) {
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

/**
 * @param {Opt} commands Sharg's command opt
 * @param {ServiceBroker} broker Moleculer's Service Broker
 */
module.exports = function (commands, broker) {
    const cmd = subCommandOpt(broker)(
		"destroy", // Name
		["destroy"], // Alias
		{
			desc: "Destroy a local service.", // Description
		}
	);

	const action = (args, errs) => wrapper(broker, cmd, args, errs, handler) // Handler

	return { ...cmd, action }
};
