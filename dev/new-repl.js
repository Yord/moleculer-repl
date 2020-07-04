const { ServiceBroker } = require('moleculer')
const GreeterSchema = require('./greeter.service')

const broker = new ServiceBroker({
	replLocation: '../../../index', // Shargs
	// replLocation: '../../../index-vorpal',
    logLevel: 'debug'
})

broker.createService(GreeterSchema)

broker.start()
    .then(() => broker.repl())