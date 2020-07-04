const kleur 							= require("kleur");
const _ 								= require("lodash");
const { table, getBorderCharacters } 	= require("table");

const { flag, subcommand, string } = require("shargs-opts");
const { wrapper } = require("../../usage/help")

const subCommandOpt = subcommand([
	    flag("help", ["--help"], { desc: "Output usage information" }),
		string("filter", ["-f", "--filter"], { desc: "Filter metrics (e.g.: 'moleculer.**').", descArg: 'match' }),
]);

/**
 * @typedef {import('moleculer').ServiceBroker} ServiceBroker Moleculer's Service Broker
 * @typedef {import('shargs-opts').Opt} Opt Sharg's sub command
 */

function labelsToStr(labels) {
	const keys = Object.keys(labels);
	if (keys.length == 0)
		return kleur.gray("{}");

	return kleur.gray("{") + keys.map(key => `${kleur.gray(key)}: ${kleur.magenta("" + labels[key])}`).join(", ") + kleur.gray("}");
}

/**
 * Command logic
 * @param {ServiceBroker} broker Moleculer's Service Broker
 * @param {Opt} cmd Sharg's sub command
 * @param {Object} args Parsed arguments
 * @param {Array} errs Array of errors
 */
function handler(broker, cmd, args, errs) {
    if (!broker.isMetricsEnabled()) {
        console.error(kleur.red().bold("Metrics feature is disabled."));
        return
    }

    const snapshot = broker.metrics.list({ includes: args.options.filter });

    const getMetricValue = function(metric, item) {
        if (metric.type == "histogram") {
            // Histogram
            return ["min", "mean", "max"].map(key => `${kleur.gray(key)}: ${kleur.green().bold("" + Number(item[key]).toFixed(2))}`).join(", ");
        }
        if (_.isString(item.value))
            return kleur.yellow().bold(`"${item.value}"`);
        return kleur.green().bold(item.value);
    };

    const data = [
        [
            kleur.bold("Name"),
            kleur.bold("Type"),
            kleur.bold("Labels"),
            kleur.bold("Value")
        ]
    ];

    let hLines = [];

    snapshot.sort((a, b) => a.name.localeCompare(b.name));

    snapshot.forEach(metric => {
        if (metric.values.size == 0) {
            data.push([
                metric.name,
                metric.type,
                "-",
                kleur.gray("<no values>")
            ]);
            return;
        }

        metric.values.forEach(item => {
            const labelStr = labelsToStr(item.labels);
            data.push([
                metric.name,
                metric.type,
                labelStr,
                getMetricValue(metric, item)
            ]);
        });
        hLines.push(data.length);
    });

    const tableConf = {
        border: _.mapValues(getBorderCharacters("honeywell"), char => kleur.gray(char)),
        columns: {
        },
        drawHorizontalLine: (index, count) => index == 0 || index == 1 || index == count || hLines.indexOf(index) !== -1
    };

    console.log(table(data, tableConf));
}

module.exports = function (commands, broker) {
	const cmd = subCommandOpt(
		"metrics", // Name
		["metrics"], // Alias
		{
			desc: "List metrics.", // Description
		}
	);

	const action = (args, errs) => wrapper(broker, cmd, args, errs, handler) // Handler

	return { ...cmd, action }
};
