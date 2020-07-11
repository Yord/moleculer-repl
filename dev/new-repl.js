const { ServiceBroker } = require('moleculer')
const GreeterSchema = require('./greeter.service')

const broker = new ServiceBroker({
	nodeID: 'repl',

	replLocation: '../../../index', // Shargs
	// replLocation: '../../../index-vorpal',
    logLevel: 'info',

    tracing: {
		enabled: false,
		// Available built-in exporters: "Console", "Datadog", "Event", "EventLegacy", "Jaeger", "Zipkin"
		exporter: {
			type: "Console", // Console exporter is only for development!
			options: {
				// Custom logger
				logger: null,
				// Using colors
				colors: true,
				// Width of row
				width: 100,
				// Gauge width in the row
				gaugeWidth: 40
			}
		}
	},

	// replDelimiter: 'abcd',
	replCommands: null,

	repl: {
		type: "vorpal", // vorpal
		options: {
			delimiter: 'mol',
			/*customCommands: [
				{
					command: "hello <name>",
					description: "Call the greeter.hello service with name",
					alias: "hi",
					options: [
						{ option: "-u, --uppercase", description: "Uppercase the name" }
					],
					types: {
						string: ["name"],
						boolean: ["u", "uppercase"]
					},
					//parse(command, args) {},
					//validate(args) {},
					//help(args) {},
					allowUnknownOptions: true,
					action(broker, args) {
						const name = args.options.uppercase ? args.name.toUpperCase() : args.name;
						return broker.call("greeter.welcome", { name }).then(console.log);
					}
				}
			]*/
		}
	}
})

broker.createService(GreeterSchema)

broker.start()
    .then(() => broker.repl())