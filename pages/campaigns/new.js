import React, { Component } from "react";
import Layout from "../../components/Layout";
import { Button, Form, Input, Message } from "semantic-ui-react";
import factory from "../../ethereum/factory";
import web3 from "../../ethereum/web3";
import { Router } from "../../routes";
class CampaignNew extends Component {
  state = {
    minimumContribution: "0",
    errorMessage: "",
    isLoading: false,
  };
  submitHandler = async (e) => {
    e.preventDefault();
    const accounts = await web3.eth.getAccounts();
    this.setState({ isLoading: true, errorMessage: "" });
    try {
      await factory.methods
        .createCampaign(this.state.minimumContribution)
        .send({
          from: accounts[0],
        });
      Router.pushRoute("/");
    } catch (err) {
      this.setState({ errorMessage: err.message });
    }
    this.setState({ isLoading: false });
  };
  render() {
    return (
      <Layout>
        <h3>Create Campaign</h3>
        <Form error={!!this.state.errorMessage} onSubmit={this.submitHandler}>
          <Form.Field>
            <label>Minimum Contribution</label>
            <Input
              value={this.state.minimumContribution}
              label="wei"
              labelPosition="right"
              onChange={(event) =>
                this.setState({ minimumContribution: event.target.value })
              }
            />
          </Form.Field>
          <Message header="Oops!" content={this.state.errorMessage} error />
          <Button loading={this.state.isLoading} primary>
            Create!
          </Button>
        </Form>
      </Layout>
    );
  }
}
export default CampaignNew;
