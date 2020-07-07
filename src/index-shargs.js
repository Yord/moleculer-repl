/*eslint-disable no-console*/
/*
 * moleculer-repl
 * Copyright (c) 2018 MoleculerJS (https://github.com/moleculerjs/moleculer-repl)
 * MIT Licensed
 */

"use strict";

require("v8"); // Load first. It won't work in `info.js`

const _ 				= require("lodash");
// const vorpal 			= require("@moleculer/vorpal")();
const { table, getBorderCharacters } 	= require("table");
const kleur 			= require("kleur");
const ora 				= require("ora");
const clui 				= require("clui");

// const registerCommands 	= require("./commands");

const { command, variadic } = require('shargs-opts')
const { repl, replSync }          = require('shargs-repl')
const loadCommands      = require('./commands/shargs')
const {lexer, parser} = require('./parser')

/**
 * Start REPL mode
 *
 * @param {ServiceBroker} broker
 * @param {Object|Array} opts
 */
/* istanbul ignore next */
function REPL(broker, opts) {

	// Create commands instance
	const commands = command('mol', [], { desc: undefined })
	// Load the commands
	const subCommands = loadCommands(commands, broker)
	// Set the commands
	commands.opts = subCommands

	const defaultAction = (args, errs) => {
		const didYouMean = errs.find(err => err.code === 'DidYouMean')
		
		const suggestions = didYouMean.info.options.slice(0, 4)

		const alternatives = []
		for (const suggestion of suggestions) {
			const args = suggestion.map(Object.keys)
			for (const arg of args) {
				alternatives.push(arg)
			}
		}

		console.log('Your command was not found! Did you mean:')
		console.log(alternatives.join(', '))
	}

	repl(lexer, parser, commands, {only: true, defaultAction})
}

module.exports = REPL;
