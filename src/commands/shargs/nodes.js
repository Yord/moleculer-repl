const kleur 			= require("kleur");
const fs 				= require("fs");
const path				= require("path");
const util 				= require("util");
const _ 				= require("lodash");
const { table, getBorderCharacters } 	= require("table");
const { match } 		= require("../../utils");

const { flag, subcommand, string } = require("shargs-opts");
const { wrapper } = require("../../usage/help")

const subCommandOpt = subcommand([
	    flag("help", ["--help"], { desc: "Output usage information" }),
        flag("all", ["-a", "--all"], { desc: "List all (offline) nodes" }),
        flag("details", ["-d", "--details"], { desc: "Detailed list." }),
		string("filter", ["-f", "--filter"], { desc: "Filter nodes (e.g.: 'node-*').", descArg: 'match' }),
        flag("raw", ["--raw"], { desc: "Print service registry to JSON." }),
        string("save", ["--save"], { desc: "Save service registry to a JSON file.", descArg: 'filename' }),
]);

function call(broker, cmd, args, errs) {
    const nodes = broker.registry.getNodeList({ onlyAvailable: false, withServices: true });

    if (args.options.save) {
        const fName = path.resolve(_.isString(args.options.save) ? args.options.save : "nodes.json");
        const nodes = broker.registry.getNodeRawList();
        fs.writeFileSync(fName, JSON.stringify(nodes, null, 4), "utf8");
        console.log(kleur.magenta().bold(`>> Node list has been saved to '${fName}' file.`));
        return
    }

    if (args.options.raw) {
        const nodes = broker.registry.getNodeRawList();
        console.log(util.inspect(nodes, { showHidden: false, depth: 4, colors: true }));
        return
    }

    // action, nodeID, cached, CB state, description?, params?
    const data = [];
    data.push([
        kleur.bold("Node ID"),
        kleur.bold("Services"),
        kleur.bold("Version"),
        kleur.bold("Client"),
        kleur.bold("IP"),
        kleur.bold("State"),
        kleur.bold("CPU")
    ]);

    let hLines = [];

    nodes.sort((a, b) => a.id.localeCompare(b.id));

    nodes.forEach(node => {
        if (!args.options.all && !node.available) return;

        if (args.options.filter && !match(node.id, args.options.filter))
            return;

        let ip = "?";
        if (node.ipList) {
            if (node.ipList.length == 1)
                ip = node.ipList[0];
            else if (node.ipList.length > 1)
                ip = node.ipList[0] + `  (+${node.ipList.length - 1})`;
        }

        let cpu = "?";
        if (node.cpu != null) {
            const width = 20;
            const c = Math.round(node.cpu / (100 / width));
            cpu = ["["].concat(Array(c).fill("■"), Array(width - c).fill("."), ["] ", node.cpu.toFixed(0), "%"]).join("");
        }

        data.push([
            node.id == broker.nodeID ? kleur.gray(node.id + " (*)") : node.id,
            node.services ? Object.keys(node.services).length : 0,
            node.client.version,
            node.client.type,
            ip,
            node.available ? kleur.bgGreen().black(" ONLINE "):kleur.bgRed().white().bold(" OFFLINE "),
            cpu
        ]);

        if (args.options.details && node.services && Object.keys(node.services).length > 0) {
            _.forIn(node.services, service => {
                data.push([
                    "",
                    service.name,
                    service.version || "-",
                    "",
                    "",
                    "",
                    ""
                ]);
            });
            hLines.push(data.length);
        }
    });

    const tableConf = {
        border: _.mapValues(getBorderCharacters("honeywell"), (char) => {
            return kleur.gray(char);
        }),
        columns: {
            2: { alignment: "right" },
            5: { alignment: "right" }
        },
        drawHorizontalLine: (index, count) => index == 0 || index == 1 || index == count || hLines.indexOf(index) !== -1
    };

    console.log(table(data, tableConf));
}

module.exports = function (commands, broker) {
	const cmd = subCommandOpt(
		"nodes", // Name
		["nodes"], // Alias
		{
			desc: "List of nodes.", // Description
		}
	);

	const action = (args, errs) => wrapper(broker, cmd, args, errs, call) // Handler

	return { ...cmd, action }
};
