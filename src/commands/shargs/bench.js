const { flag, subcommand, string, stringPos, variadicPos } = require("shargs-opts");
const { wrapper } = require("../../usage/help")

const kleur 			= require("kleur");
const humanize 			= require("tiny-human-time").short;
const ora 				= require("ora");
const _ 				= require("lodash");
const { formatNumber } 	= require("../../utils");

/**
 * @typedef {import('moleculer').ServiceBroker} ServiceBroker Moleculer's Service Broker
 * @typedef {import('shargs-opts').Opt} Opt Sharg's sub command
 */


function createSpinner(text) {
	return ora({
		text,
		spinner: {
			interval: 500,
			frames: [
				".  ",
				".. ",
				"...",
				" ..",
				"  .",
				"   "
			]
		}
	});
}

const subCommandOpt = broker => subcommand([
        stringPos('action', {
            desc: "Action name (e.g., greeter.hello)",
            required: true,
            only: _.uniq(_.compact(broker.registry.getActionList({}).map(item => item && item.action ? item.action.name: null)))
        }),
        variadicPos('customOptions', { bestGuess: true }),
		stringPos('jsonParams', { desc: `JSON Parameters (e.g. '{"a": 5}' )`, descArg: 'jsonParams'} ),
		stringPos('meta', { desc: "Metadata to pass to the service action. Must start with '#' (e.g., --#auth 123)", descArg: 'meta'} ),
	    flag("help", ["--help"], { desc: "Output usage information" }),
		string("num", ["--num"], { desc: "Number of iterates.", descArg: 'number' }),
		string("time", ["--time"], { desc: "Time (in seconds) for the bench.", descArg: 'time' }),
		string("nodeID", ["--save"], { desc: "NodeID (direct call).", descArg: 'nodeID' }),
]);

/**
 * Command logic
 * @param {ServiceBroker} broker Moleculer's Service Broker
 * @param {Object} args Parsed arguments
 */
function handler(broker, args) {
    let payload;
    const iterate = args.options.num != null ? Number(args.options.num) : null;
    let time = args.options.time != null ? Number(args.options.time) : null;
    if (!iterate && !time)
        time = 5;

    const spinner = createSpinner("Running benchmark...");

    //console.log(args);
    if (typeof(args.jsonParams) == "string") {
        try {
            payload = JSON.parse(args.jsonParams);
        } catch(err) {
            console.error(kleur.red().bold(">> ERROR:", err.message, args.jsonParams));
            console.error(kleur.red().bold(err.stack));
            // done();
            return;
        }
    }

    let meta;
    if (typeof(args.meta) === "string") {
        try {
            meta = JSON.parse(args.meta);
        } catch(err) {
            console.error(kleur.red().bold("Can't parse [meta]"), args.meta);
        }
    }

    const callingOpts = { meta };

    if (args.options.nodeID)
        callingOpts.nodeID = args.options.nodeID;

    let count = 0;
    let resCount = 0;
    let errorCount = 0;
    let sumTime = 0;
    let minTime;
    let maxTime;

    let timeout = false;

    setTimeout(() => timeout = true, (time ? time : 60) * 1000);
    let startTotalTime = process.hrtime();

    const printResult = function(duration) {
        const errStr = errorCount > 0 ? kleur.red().bold(`${formatNumber(errorCount)} error(s) ${formatNumber(errorCount / resCount * 100)}%`) : kleur.grey("0 error");

        console.log(kleur.green().bold("\nBenchmark result:\n"));
        console.log(kleur.bold(`  ${formatNumber(resCount)} requests in ${humanize(duration)}, ${errStr}`));
        console.log("\n  Requests/sec:", kleur.bold(formatNumber(resCount / duration * 1000)));
        console.log("\n  Latency:");
        console.log("    Avg:", kleur.bold(_.padStart(humanize(sumTime / resCount), 10)));
        console.log("    Min:", kleur.bold(_.padStart(humanize(minTime), 10)));
        console.log("    Max:", kleur.bold(_.padStart(humanize(maxTime), 10)));
        console.log();
    };

    const handleResponse = function(startTime, err) {
        resCount++;

        if (err) {
            errorCount++;
        }

        const diff = process.hrtime(startTime);
        const duration = (diff[0] + diff[1] / 1e9) * 1000;
        sumTime += duration;
        if (minTime == null || duration < minTime)
            minTime = duration;
        if (maxTime == null || duration > maxTime)
            maxTime = duration;

        if (timeout || (iterate && resCount >= iterate)) {
            spinner.stop();

            const diff = process.hrtime(startTotalTime);
            const duration = (diff[0] + diff[1] / 1e9) * 1000;
            printResult(duration);

            // return done();
            return
        }

        if (count % 10 * 1000) {
            // Fast cycle
            doRequest();
        } else {
            // Slow cycle
            setImmediate(() => doRequest());
        }

    };

    function doRequest() {
        count++;
        const startTime = process.hrtime();

        return broker.call(args.action, payload, callingOpts).then(res => {
            handleResponse(startTime);
            return res;
        }).catch(err => {
            handleResponse(startTime, err);
            //console.error(kleur.red().bold(">> ERROR:", err.message));
            //console.error(kleur.red().bold(err.stack));
            //console.error("Data: ", util.inspect(err.data, { showHidden: false, depth: 4, colors: true }));
        });
    }

    console.log(kleur.yellow().bold(`>> Call '${args.action}'${args.options.nodeID ? " on '" + args.options.nodeID + "'" : ""} with params:`), payload);
    spinner.start(iterate ? `Running x ${iterate} times...` : `Running ${time} second(s)...`);

    doRequest();
}

/**
 * @param {Opt} commands Sharg's command opt
 * @param {ServiceBroker} broker Moleculer's Service Broker
 */
module.exports = function (commands, broker) {
	const cmd = subCommandOpt(broker)(
		"bench", // Name
		["bench"], // Alias
		{
			desc: "Benchmark a service.", // Description
		}
	);

	const action = (args, errs) => wrapper(broker, cmd, args, errs, handler) // Handler

	return { ...cmd, action }
};
