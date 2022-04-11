const assert = require("assert");
const ganache = require("ganache-cli");
const Web3 = require("web3");
const web3 = new Web3(ganache.provider());

const compiledFactory = require("../ethereum/build/CampaignFactory.json");

const compiledCampaign = require("../ethereum/build/Campaign.json");

let accounts;
let factory;
let campaignAddress;
let campaign;

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();
  factory = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
    .deploy({ data: compiledFactory.bytecode })
    .send({ from: accounts[0], gas: "1000000" });

  await factory.methods
    .createCampaign("100")
    .send({ from: accounts[0], gas: "1000000" });

  [campaignAddress] = await factory.methods.getDeployedCampaigns().call(); //fancy syntax

  campaign = await new web3.eth.Contract(
    JSON.parse(compiledCampaign.interface),
    campaignAddress
  );
});
describe("Campaigns", () => {
  it("deploys a factory and a campaign", () => {
    assert.ok(factory.options.address);
    assert.ok(campaign.options.address);
  });
  it("sets the manager ok", async () => {
    const manager = await campaign.methods.manager().call();
    assert.equal(manager, accounts[0]);
  });

  it("can receive money and add approver", async () => {
    await campaign.methods.contribute().send({
      from: accounts[1],
      value: "200",
    });
    const isApprover = await campaign.methods.approvers(accounts[1]).call();
    assert(isApprover);
  });

  it("sets a minimum contribution", async () => {
    try {
      await campaign.methods.contribute().send({
        from: accounts[1],
        value: "99",
      });
      assert(false);
    } catch (err) {
      assert(err);
    }
  });
  it("allows manager to create a request", async () => {
    await campaign.methods
      .createRequest("Buy batteries", "100", accounts[1])
      .send({
        from: accounts[0],
        gas: "1000000",
      });

    const request = await campaign.methods.requests(0).call();

    assert.equal("Buy batteries", request.description);
  });
  it("works properly from end to end", async () => {
    await campaign.methods.contribute().send({
      from: accounts[0],
      value: web3.utils.toWei("10", "ether"),
    });
    await campaign.methods
      .createRequest("Description", web3.utils.toWei("5", "ether"), accounts[1])
      .send({
        from: accounts[0],
        gas: "1000000",
      });

    await campaign.methods.approveRequest(0).send({
      from: accounts[0],
      gas: "1000000",
    });

    await campaign.methods.finalizeRequest(0).send({
      from: accounts[0],
      gas: "1000000",
    });

    let balance_one = await web3.eth.getBalance(accounts[1]);

    balance_one = web3.utils.fromWei(balance_one, "ether");
    balance_one = parseFloat(balance_one);
    assert(balance_one > 104);
  });
});
