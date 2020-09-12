/*eslint-disable no-console*/
/*
 * moleculer-repl
 * Copyright (c) 2018 MoleculerJS (https://github.com/moleculerjs/moleculer-repl)
 * MIT Licensed
 */

"use strict";

/**
 * @typedef {import('shargs-opts').Opt} Opt Sharg's sub command
 */

require("v8"); // Load first. It won't work in `info.js`

const _ 				= require("lodash");
// const vorpal 			= require("@moleculer/vorpal")();
const { table, getBorderCharacters } 	= require("table");
const kleur 			= require("kleur");
const ora 				= require("ora");
const clui 				= require("clui");

// const registerCommands 	= require("./commands");

const { command } = require('shargs-opts')
const { repl, replSync }          = require('shargs-repl')
const loadCommands      = require('./commands/shargs')
const {lexer, parser} = require('./parser');

const { wrapper } = require("./usage/help")

// For registering custom commands
const shargsOpt = require('shargs-opts');
const { ServiceBroker } = require("moleculer");

/**
 * Start REPL mode
 *
 * @param {ServiceBroker} broker
 * @param {Object|Array} opts
 */
/* istanbul ignore next */
function REPL(broker, opts) {
	// Create commands instance
	// Delimiter doesn't like white spaces
	const commands = command(opts.delimiter.split(" ").join(""), [], { desc: undefined })
	
	// Load general commands
	let subCommands = loadCommands(commands, broker)
	
	const removeIfExists = (name) => {
		const index = subCommands.findIndex(cmd => cmd.key === name)

		if (index > -1) subCommands.splice(index, 1)
	}
	
	// Register custom commands
	if (Array.isArray(opts.customCommands)) {
		opts.customCommands.forEach(def => {
			removeIfExists(def.name)

			subCommands.push(createCustomCommand(def, broker))
		})

	}

	// Set the commands
	commands.opts = subCommands

	repl(lexer, parser, commands, {only: true, defaultAction, prompt: opts.delimiter})
}

/**
 * Register custom commands
 * @param {Object} def 
 * @param {ServiceBroker} broker
 * @returns {Opt}
 */
function createCustomCommand(def, broker) {
	// Register flags and options
	const optsArray = def.options.map(opt => {
		return shargsOpt[`${opt.type}`](
			opt.name,
			// Some commands accept alias while other accept the definition as 2nd param
			opt.alias !== undefined ? opt.alias : opt.def,
			opt.def
		)
	})
	
	const cmdOpt = broker => shargsOpt.subcommand(optsArray)

	const cmd = cmdOpt(broker)(
		def.name,
		def.alias,
		{
			desc: def.description
		}
	)
	
	// Create the handler
	const action = (args, errs) => {
		const helpers = { table, kleur, ora, clui, getBorderCharacters }
		return wrapper(broker, cmd, args, errs, def.action, helpers)
	}

	return {...cmd, action}
}

function defaultAction (args, errs) {
	const didYouMean = errs.find(err => err.code === 'DidYouMean')
	
	if (didYouMean) {
		const suggestions = didYouMean.info.options.slice(0, 4)

		const alternatives = []
		for (const suggestion of suggestions) {
			const args = suggestion.map(Object.keys)
			for (const arg of args) {
				alternatives.push(arg)
			}
		}

		console.log('Your command was not found! Did you mean:')
		console.log(kleur.green(alternatives.join(', ')))
		console.log('For help, type "help"')
	}
}

module.exports = REPL;
