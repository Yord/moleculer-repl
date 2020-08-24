const kleur 			= require("kleur");
const _ 				= require("lodash");
const { table, getBorderCharacters } 	= require("table");
const { match } 		= require("../../utils");

const { flag, subcommand, string } = require("shargs-opts");
const { wrapper } = require("../../usage/help")

/**
 * @typedef {import('moleculer').ServiceBroker} ServiceBroker Moleculer's Service Broker
 * @typedef {import('shargs-opts').Opt} Opt Sharg's sub command
 */

const subCommandOpt = subcommand([
	    flag("help", ["--help"], { desc: "Output usage information" }),
        flag("all", ["-a", "--all"], { desc: "list all (offline) services" }),
        flag("details", ["-d", "--details"], { desc: "Print endpoints." }),
		string("filter", ["-f", "--filter"], { desc: "Filter nodes (e.g.: 'node-*').", descArg: 'match' }),
        flag("skipinternal", ["-i", "--skipinternal"], { desc: "Skip internal services." }),
        flag("local", ["-l", "--local"], { desc: "Only local services." }),
]);

/**
 * Command logic
 * @param {ServiceBroker} broker Moleculer's Service Broker
 * @param {Object} args Parsed arguments
 */
function handler(broker, args) {
    const services = broker.registry.getServiceList({ onlyLocal: args.options.local, onlyAvailable: !args.options.all, skipInternal: args.options.skipinternal, withActions: true, withEvents: true });

    const data = [
        [
            kleur.bold("Service"),
            kleur.bold("Version"),
            kleur.bold("State"),
            kleur.bold("Actions"),
            kleur.bold("Events"),
            kleur.bold("Nodes")
        ]
    ];

    let list = [];
    let hLines = [];

    services.forEach(svc => {
        let item = list.find(o => o.name == svc.name && o.version == svc.version);
        if (item) {
            item.nodes.push({ nodeID: svc.nodeID, available: svc.available });
            if (!item.available && svc.available)
                item.available = svc.available;
        } else {
            item = _.pick(svc, ["name", "version"]);
            item.nodes = [{ nodeID: svc.nodeID, available: svc.available }];
            item.actionCount = Object.keys(svc.actions).length;
            item.eventCount = Object.keys(svc.events).length;
            item.available = svc.available;
            list.push(item);
        }
    });

    list.sort((a, b) => a.name.localeCompare(b.name));

    list.forEach(item => {
        const hasLocal = item.nodes.indexOf(broker.nodeID) !== -1;
        const nodeCount = item.nodes.length;
        const fullName = item.fullName != null ? item.fullName : ((typeof(item.version) == "number" ? "v" + item.version : item.version) + "." + item.name);

        if (args.options.filter && !match(fullName, args.options.filter))
            return;

        data.push([
            item.name,
            item.version != null ? item.version : "-",
            item.available ? kleur.bgGreen().white( "   OK   ") : kleur.bgRed().white().bold(" FAILED "),
            item.actionCount,
            item.eventCount,
            (hasLocal ? "(*) " : "") + nodeCount
        ]);

        if (args.options.details && item.nodes) {
            item.nodes.forEach(({ nodeID, available }) => {
                data.push([
                    "",
                    "",
                    available ? kleur.bgGreen().white( "   OK   ") : kleur.bgRed().white().bold(" FAILED "),
                    "",
                    "",
                    nodeID == broker.nodeID ? kleur.gray("<local>") : nodeID,
                ]);
            });
            hLines.push(data.length);
        }

    });

    const tableConf = {
        border: _.mapValues(getBorderCharacters("honeywell"), char => kleur.gray(char)),
        columns: {
            1: { alignment: "right" },
            2: { alignment: "right" },
            3: { alignment: "right" },
            4: { alignment: "right" }
        },
        drawHorizontalLine: (index, count) => index == 0 || index == 1 || index == count || hLines.indexOf(index) !== -1
    };

    console.log(table(data, tableConf));
}

/**
 * @param {Opt} commands Sharg's command opt
 * @param {ServiceBroker} broker Moleculer's Service Broker
 */
module.exports = function (commands, broker) {
	const cmd = subCommandOpt(
		"services", // Name
		["services"], // Alias
		{
			desc: "List of services.", // Description
		}
	);

	const action = (args, errs) => wrapper(broker, cmd, args, errs, handler) // Handler

	return { ...cmd, action }
};
