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

const registerCommands 	= require("./commands");

const { repl }          = require('shargs-repl')
const {commands}      = require('./commands/commands')
const {lexer, parser} = require('./parser')

/**
 * Start REPL mode
 *
 * @param {ServiceBroker} broker
 * @param {Object|Array} opts
 */
/* istanbul ignore next */
function REPL(broker, opts) {
	repl(lexer, parser, commands, {only: true})
}

module.exports = REPL;
