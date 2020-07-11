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

	replDelimiter: 'abcd',
	replCommands: [
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
            action(broker, args/*, helpers*/) {
                const name = args.options.uppercase ? args.name.toUpperCase() : args.name;
                return broker.call("greeter.hello", { name }).then(console.log);
            }
        }
	],
	
	/*
	repl: {
		type: "shargs", // vorpal
		options: {
			delimiter: 'mol',
			customCommands: [
				{
					name: 'greeter',
					alias: ['greeter', 'gr'],
					description: 'Calls greeter',
					options: [
						{
							type: 'variadicPos',
							name: 'customOptions',
							def: { 
								bestGuess: true
							}
						},
						{
							type: 'stringPos',
							name: 'jsonParams',
							def: {
								desc: `JSON Parameters (e.g. '{"a": 5}' )`,
								descArg: 'jsonParams'
							}
						},
						{
							type: 'stringPos',
							name: 'meta',
							def: {
								desc: "Metadata to pass to the service action. Must start with '#' (e.g., --#auth 123)",
								descArg: 'meta'
							}
						},
						{
							type: 'flag',
							name: 'help',
							alias: ['--help'],
							def: {
								desc: "Output usage information"
							}
						},
						{
							type: 'string',
							name: 'load',
							alias: ['--load'],
							def: {
								desc: "Load params from file.",
								descArg: 'filename'
							}
						},
						{
							type: 'string',
							name: 'stream',
							alias: ['--stream'],
							def: {
								desc: "Send a file as stream.",
								descArg: 'filename'
							}
						},
						{
							type: 'string',
							name: 'save',
							alias: ['--save'],
							def: {
								desc: "Save response to file.",
								descArg: 'filename'
							}
						},
					],
					async action(broker, cmd, args, errs) {
						console.log(args)
						// const res = await broker.call('greeter.welcome')
						// console.log(res)
					}
				}
			]
		}
	}*/
})

broker.createService(GreeterSchema)

broker.start()
    .then(() => broker.repl())