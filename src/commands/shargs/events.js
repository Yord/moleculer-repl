const kleur 							= require("kleur");
const _ 								= require("lodash");
const { table, getBorderCharacters } 	= require("table");

const { match } = require("../../utils");

const { flag, subcommand, string } = require("shargs-opts");
const { wrapper } = require("../../usage/help")

/**
 * @typedef {import('moleculer').ServiceBroker} ServiceBroker Moleculer's Service Broker
 * @typedef {import('shargs-opts').Opt} Opt Sharg's sub command
 */

const subCommandOpt = subcommand([
	    flag("help", ["--help"], { desc: "Output usage information" }),
        flag("all", ["-a", "--all"], { desc: "List all (offline) event listeners." }),
        flag("details", ["-d", "--details"], { desc: "Print endpoints." }),
		string("filter", ["-f", "--filter"], { desc: "Filter event listeners (e.g.: 'user.*').", descArg: 'match' }),
        flag("skipinternal", ["-i", "--skipinternal"], { desc: "Skip internal event listeners." }),
        flag("local", ["-l", "--local"], { desc: "Only local event listeners." }),
]);

/**
 * Command logic
 * @param {ServiceBroker} broker Moleculer's Service Broker
 * @param {Object} args Parsed arguments
 */
function handler(broker, args) {
    const events = broker.registry.getEventList({ onlyLocal: args.options.local, onlyAvailable: !args.options.all, skipInternal: args.options.skipinternal, withEndpoints: args.options.details });
    const data = [
        [
            kleur.bold("Event"),
            kleur.bold("Group"),
            kleur.bold("State"),
            kleur.bold("Nodes")
        ]
    ];

    events.sort((a, b) => a.name.localeCompare(b.name));

    let hLines = [];

    events.forEach(item => {
        const event = item.event;

        if (args.options.filter && !match(item.name, args.options.filter))
            return;

        if (event) {
            data.push([
                event.name,
                item.group,
                item.available ? kleur.bgGreen().white( "   OK   ") : kleur.bgRed().white().bold(" FAILED "),
                (item.hasLocal ? "(*) " : "") + item.count
            ]);
        } else {
            data.push([
                item.name,
                item.group,
                item.available ? kleur.bgGreen().white( "   OK   ") : kleur.bgRed().white().bold(" FAILED "),
                item.count
            ]);
        }

        if (args.options.details && item.endpoints) {
            item.endpoints.forEach(endpoint => {
                data.push([
                    "",
                    "",
                    endpoint.available ? kleur.bgGreen().white( "   OK   ") : kleur.bgRed().white().bold(" FAILED "),
                    endpoint.nodeID == broker.nodeID ? kleur.gray("<local>") : endpoint.nodeID,
                ]);
            });
            hLines.push(data.length);
        }
    });

    const tableConf = {
        border: _.mapValues(getBorderCharacters("honeywell"), char => kleur.gray(char)),
        columns: {
            1: { alignment: "right" }
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
		"events", // Name
		["events"], // Alias
		{
			desc: "List of event listeners.", // Description
		}
	);

	const action = (args, errs) => wrapper(broker, cmd, args, errs, handler) // Handler

	return { ...cmd, action }
};
