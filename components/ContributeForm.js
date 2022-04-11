import React, { Component } from "react";
import { Form, Button, Input, Message } from "semantic-ui-react";
import Camp from "../ethereum/campaign";
import web3 from "../ethereum/web3";
import { Router } from "../routes";
class ContributeForm extends Component {
  state = {
    value: "",
    loading: false,
    errorMessage: "",
  };

  onSubmit = async (e) => {
    e.preventDefault();
    this.setState({ loading: true, errorMessage: "" });
    const campaign = Camp(this.props.address);
    const accounts = await web3.eth.getAccounts();
    try {
      await campaign.methods.contribute().send({
        from: accounts[0],
        value: web3.utils.toWei(this.state.value, "ether"),
      });
    } catch (err) {
      this.setState({ errorMessage: err.message });
    }
    this.setState({ loading: false });
    Router.replaceRoute(`/campaigns/${this.props.address}`);
  };
  render() {
    return (
      <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
        <Form.Field>
          <label>Amount to contribute</label>
          <Input
            onChange={(event) => this.setState({ value: event.target.value })}
            label="ether"
            labelPosition="right"
            value={this.state.value}
          />
        </Form.Field>
        <Message header="Oops!" content={this.state.errorMessage} error />
        <Button loading={this.state.loading} primary>
          Contribute!
        </Button>
      </Form>
    );
  }
}
export default ContributeForm;
