const { subcommand, stringPos, flag } = require("shargs-opts");
const { wrapper } = require('../../usage/help')
const kleur 			= require("kleur");

const subCommandOpt = subcommand([
    stringPos("pattern", { desc: "Clear cache entries.", descArg: "pattern"}),
	flag("help", ["--help"], { desc: "Output usage information" }),
]);

function handler(broker, cmd, args, errs) {
    if (broker.cacher) {
        broker.cacher.clean(args.pattern).then(() => {
            console.log(kleur.yellow().bold(args.pattern ? "Cacher cleared entries by pattern." : "Cacher cleared all entries."));
            done();
        });
        return;
    }

    console.log(kleur.red().bold("No cacher."));
}

module.exports = function (commands, broker) {
	const cmd = subCommandOpt(
		"clear", // Name
		["clear"], // Alias
		{
			desc: "Clear cache entries.", // Description
		}
	);
	
	// Register the handler
	const action = (args, errs) => wrapper(broker, cmd, args, errs, handler)
	
	return { ...cmd, action }
};
