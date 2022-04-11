import web3 from "./web3";
import CampaignFactory from "./build/CampaignFactory.json";

const instance = new web3.eth.Contract(
  JSON.parse(CampaignFactory.interface),
  "0x212e46C2F76F1C1A3EC2e3cEE59Ebd8b8749167A"
);

export default instance;
