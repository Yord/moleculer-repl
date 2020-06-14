const { ServiceBroker } = require('moleculer')

const broker = new ServiceBroker({
	// replLocation: '../../../index-shargs',
	replLocation: '../../../index-vorpal',
    logLevel: 'debug'
})

broker.createService({
	name: "greeter",
	actions: {
		hello () { return 'Hello' },

		welcome: {
			rest: "/welcome",
			params: { name: "string" },
			async handler(ctx) {
				return `Welcome, ${ctx.params.name}`;
			}
		}
	},
	events: {},
})

broker.start()
    .then(() => broker.repl())