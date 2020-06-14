module.exports = {
	name: "greeter",
	
	version: 2,
	
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
}