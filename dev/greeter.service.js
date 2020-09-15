const { ServiceBroker } = require("moleculer");

module.exports = {
	name: "greeter",
	
	// version: 2,
	
	actions: {
		hello () { return 'Hello' },

		welcome: {
			rest: "/welcome",
			params: { name: "string" },
			async handler(ctx) {
				return `Welcome, ${ctx.params.name}`;
			}
		},

		ids : {
			handler () {
				/** @type {ServiceBroker} */
				let broker = this.broker
				return broker.registry.nodes.list({ onlyAvailable: false, withServices : false }).map(node => node.id)
			}
		},

		data(ctx) {
			return {
				params: ctx.params,
				meta: ctx.meta
			}
		}
	},
	events: {
		"hello.event" (ctx){
			console.log('Caught an Event!!')
			console.log(ctx.params)
		},

		"*" (ctx){
			console.log('Caught an Event!!')
			console.log(ctx.params)
		}
	},
}