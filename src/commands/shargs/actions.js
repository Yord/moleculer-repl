const kleur 							= require("kleur");
const _ 								= require("lodash");
const { table, getBorderCharacters } 	= require("table");
const { match, CIRCUIT_CLOSE, CIRCUIT_HALF_OPEN, CIRCUIT_OPEN } = require("../../utils");

const { flag, subcommand, string } = require("shargs-opts");
const { wrapper } = require("../../usage/help")

/**
 * @typedef {import('moleculer').ServiceBroker} ServiceBroker Moleculer's Service Broker
 * @typedef {import('shargs-opts').Opt} Opt Sharg's sub command
 */

const subCommandOpt = subcommand([
	    flag("help", ["--help"], { desc: "Output usage information" }),
        flag("all", ["-a", "--all"], { desc: "List all (offline) actions", descArg: 'all' }),
        flag("details", ["-d", "--details"], { desc: "Print endpoints.", descArg: 'details' }),
		string("filter", ["-f", "--filter"], { desc: "Filter actions (e.g.: 'users.*').", descArg: 'match' }),
        flag("skipinternal", ["-i", "--skipinternal"], { desc: "Skip internal actions.", descArg: 'skipinternal' }),
        flag("local", ["-l", "--local"], { desc: "Only local actions.", descArg: 'local' }),
]);

/**
 * Command logic
 * @param {ServiceBroker} broker Moleculer's Service Broker
 * @param {Object} args Parsed arguments
 */
function handler(broker, args) {
    const actions = broker.registry.getActionList({ onlyLocal: args.options.local, onlyAvailable: !args.options.all, skipInternal: args.options.skipinternal, withEndpoints: args.options.details });

    const data = [
        [
            kleur.bold("Action"),
            kleur.bold("Nodes"),
            kleur.bold("State"),
            kleur.bold("Cached"),
            kleur.bold("Params")
        ]
    ];

    let hLines = [];

    actions.sort((a, b) => a.name.localeCompare(b.name));

    let lastServiceName;

    actions.forEach(item => {
        const action = item.action;
        const state = item.available;
        const params = action && action.params ? Object.keys(action.params).join(", ") : "";

        if (args.options.filter && !match(item.name, args.options.filter))
            return;

        const serviceName = item.name.split(".")[0];

        // Draw a separator line
        if (lastServiceName && serviceName != lastServiceName)
            hLines.push(data.length);
        lastServiceName = serviceName;

        if (action) {
            data.push([
                action.name,
                (item.hasLocal ? "(*) " : "") + item.count,
                state ? kleur.bgGreen().white("   OK   "):kleur.bgRed().white().bold(" FAILED "),
                action.cache ? kleur.green("Yes"):kleur.gray("No"),
                params
            ]);
        } else {
            data.push([
                item.name,
                item.count,
                kleur.bgRed().white().bold(" FAILED "),
                "",
                ""
            ]);
        }

        let getStateLabel = (state) => {
            switch(state) {
            case true:
            case CIRCUIT_CLOSE:			return kleur.bgGreen().white( "   OK   ");
            case CIRCUIT_HALF_OPEN: 	return kleur.bgYellow().black(" TRYING ");
            case false:
            case CIRCUIT_OPEN: 			return kleur.bgRed().white(	" FAILED ");
            }
        };

        if (args.options.details && item.endpoints) {
            item.endpoints.forEach(endpoint => {
                data.push([
                    "",
                    endpoint.nodeID == broker.nodeID ? kleur.gray("<local>") : endpoint.nodeID,
                    getStateLabel(endpoint.state),
                    "",
                    ""
                ]);
            });
            hLines.push(data.length);
        }
    });

    const tableConf = {
        border: _.mapValues(getBorderCharacters("honeywell"), char => kleur.gray(char)),
        columns: {
            1: { alignment: "right" },
            3: { alignment: "center" },
            5: { width: 20, wrapWord: true }
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
		"actions", // Name
		["actions"], // Alias
		{
			desc: "List of actions.", // Description
		}
	);

	const action = (args, errs) => wrapper(broker, args, errs, cmd, handler) // Handler

	return { ...cmd, action }
};
