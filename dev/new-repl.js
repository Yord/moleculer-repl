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
	}
})

broker.createService(GreeterSchema)

broker.start()
    .then(() => broker.repl())