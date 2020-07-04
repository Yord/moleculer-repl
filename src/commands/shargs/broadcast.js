"use strict";

const kleur 			= require("kleur");
const { convertArgs } 	= require("../../utils");

const { flag, subcommand, stringPos, variadicPos } = require("shargs-opts");
const { wrapper } = require('../../usage/help')

/**
 * @typedef {import('moleculer').ServiceBroker} ServiceBroker Moleculer's Service Broker
 * @typedef {import('shargs-opts').Opt} Opt Sharg's sub command
 */

const subCommandOpt = subcommand([
    stringPos('eventName', {
        desc: "Event name",
        required: true
    }),
    variadicPos('customOptions', { bestGuess: true }),
    flag("help", ["--help"], { desc: "Output usage information." }),
]);

/**
 * Command logic
 * @param {ServiceBroker} broker Moleculer's Service Broker
 * @param {Opt} cmd Sharg's sub command
 * @param {Object} args Parsed arguments
 * @param {Array} errs Array of errors
 */
function broadcastHandler(broker, cmd, args, errs) {
    let payload = {};
    let meta = {
        $repl: true
    };

    const opts = convertArgs(args.options);

    Object.keys(opts).map(key => {
        if (key.startsWith("#"))
            meta[key.slice(1)] = opts[key];
        else {
            if (key.startsWith("@"))
                payload[key.slice(1)] = opts[key];
            else
                payload[key] = opts[key];
        }
    });
    console.log(kleur.yellow().bold(`>> Broadcast '${args.eventName}' with payload:`), payload);
    broker.broadcast(args.eventName, payload, { meta });
}

/**
 * Command logic
 * @param {ServiceBroker} broker Moleculer's Service Broker
 * @param {Opt} cmd Sharg's sub command
 * @param {Object} args Parsed arguments
 * @param {Array} errs Array of errors
 */
function broadcastLocalHandler(broker, cmd, args, errs) {
    let payload = {};
    let meta = {
        $repl: true
    };

    const opts = convertArgs(args.options);

    Object.keys(opts).map(key => {
        if (key.startsWith("#"))
            meta[key.slice(1)] = opts[key];
        else {
            if (key.startsWith("@"))
                payload[key.slice(1)] = opts[key];
            else
                payload[key] = opts[key];
        }
    });
    console.log(kleur.yellow().bold(`>> Broadcast '${args.eventName}' locally with payload:`), payload);
    broker.broadcastLocal(args.eventName, payload, { meta });
}

module.exports = function (commands, broker) {
	const broadcastCMD = subCommandOpt(
		"broadcast", // Name
		["broadcast"], // Alias
		{
			desc: "Broadcast an event.", // Description
		}
	);
	// Register the handler
	const broadcastAction = (args, errs) => wrapper(broker, broadcastCMD, args, errs, broadcastHandler)
    
    const broadcastLocalCMD = subCommandOpt(
		"broadcastLocal", // Name
		["broadcastLocal"], // Alias
		{
			desc: "Broadcast an event locally.", // Description
		}
	);
	// Register the handler
	const broadcastLocalAction = (args, errs) => wrapper(broker, broadcastLocalCMD, args, errs, broadcastLocalHandler)
	
	return [
        { ...broadcastCMD, action: broadcastAction  },
        { ...broadcastLocalCMD, action: broadcastLocalAction}
    ]
};