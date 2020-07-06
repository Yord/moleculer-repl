const { subcommand, stringPos, flag } = require("shargs-opts");
const { wrapper } = require('../../usage/help')
const kleur = require("kleur");
const fs = require("fs");
const path = require("path");

/**
 * @typedef {import('moleculer').ServiceBroker} ServiceBroker Moleculer's Service Broker
 * @typedef {import('shargs-opts').Opt} Opt Sharg's sub command
 */

const loadCommandOpt = subcommand([
	stringPos("servicePath", { desc: "Path to the service file.", descArg: "servicePath", required: true}),
	flag("help", ["--help"], { desc: "Output usage information" }),
]);

const loadFolderCommandOpt = subcommand([
	stringPos("serviceFolder", { desc: "Path to the folder.", descArg: "serviceFolder", required: true }),
	stringPos("fileMask", { desc: "Path to the service.", descArg: "fileMask", }),
	flag("help", ["--help"], { desc: "Output usage information" }),
]);

/**
 * Command logic
 * @param {ServiceBroker} broker Moleculer's Service Broker
 * @param {Opt} cmd Sharg's sub command
 * @param {Object} args Parsed arguments
 * @param {Array} errs Array of errors
 */
function loadHandler(broker, cmd, args, errs) {
	console.log(args)
	let filePath = path.resolve(args.servicePath);
	if (fs.existsSync(filePath)) {
		console.log(kleur.yellow(`>> Load '${filePath}'...`));
		let service = broker.loadService(filePath);
		if (service) console.log(kleur.green(">> Loaded successfully!"));
	} else {
		console.warn(kleur.red("The service file is not exists!", filePath));
	}
}

/**
 * Command logic
 * @param {ServiceBroker} broker Moleculer's Service Broker
 * @param {Opt} cmd Sharg's sub command
 * @param {Object} args Parsed arguments
 * @param {Array} errs Array of errors
 */
function loadFolderHandler (broker, cmd, args, errs) {
	let filePath = path.resolve(args.serviceFolder);
	if (fs.existsSync(filePath)) {
		console.log(kleur.yellow(`>> Load services from '${filePath}'...`));
		const count = broker.loadServices(filePath, args.fileMask);
		console.log(kleur.green(`>> Loaded ${count} services!`));
	} else {
		console.warn(kleur.red("The folder is not exists!", filePath));
	}
}

/**
 * @param {Opt} commands Sharg's command opt
 * @param {ServiceBroker} broker Moleculer's Service Broker
 */
module.exports = function (commands, broker) {
	const loadCMD = loadCommandOpt(
		"load", // Name
		["load"], // Alias
		{
			desc: "Load a service from file.", // Description
		}
	)
	// Register the handler
	const loadAction = (args, errs) => wrapper(broker, loadCMD, args, errs, loadHandler)
	
	const loadFolderCMD = loadFolderCommandOpt(
		"loadFolder", // Name
		["loadFolder"], // Alias
		{
			desc: "Load all services from folder.", // Description
		}
	)
	// Register the handler
	const loadFolderAction = (args, errs) => wrapper(broker, loadFolderCMD, args, errs, loadFolderHandler)

	return [
		{ ...loadCMD, action: loadAction },
		{ ...loadFolderCMD, action: loadFolderAction }
	]
};
