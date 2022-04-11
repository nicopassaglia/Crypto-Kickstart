const path = require("path");
const solc = require("solc");
const fs = require("fs-extra");

const buildPath = path.resolve(__dirname, "build");
fs.removeSync(buildPath); //deletes build folder

const campaignPath = path.resolve(__dirname, "contracts", "Campaign.sol");

const source = fs.readFileSync(campaignPath, "utf8");
const output = solc.compile(source, 1).contracts; //compiles both contrcts

fs.ensureDirSync(buildPath); //creates build folder

for (let contract in output) {
  fs.outputJsonSync(
    path.resolve(buildPath, contract.replace(":", "") + ".json"),
    output[contract]
  );
}
