import React, { Component } from "react";
import ShoppingVoucherContract from "./contracts/ShoppingVoucher.json";
import getEthers from "./getEthers";
import { ethers } from "ethers";

import "./App.css";

class App extends Component {
  state = { voucherValue: "", web3: null, accounts: null, contract: null };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getEthers();

      // Use web3 to get the user's accounts.
      const accounts = await web3.listAccounts();

      // Get the contract instance.
      // const networkId = await web3.eth.net.getId();
      // const deployedNetwork = ShoppingVoucherContract.networks[networkId];
      // const instance = new web3.eth.Contract(
      //   ShoppingVoucherContract.abi,
      //   deployedNetwork && deployedNetwork.address
      // );
      const instance = new ethers.Contract(
        `******Enter Smart Contract Address*****`,
        ShoppingVoucherContract.abi,
        web3.getSigner()
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance });
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      );
      console.error(error);
    }
  };

  getVoucherCode = async () => {
    const { accounts, contract, web3 } = this.state;

    console.log(accounts[0]);

    await web3.send("eth_requestAccounts", []);
    const signer = web3.getSigner();

    const selectedAccount = signer.getAddress();
    // Creating a transaction param
    const tx = {
      from: selectedAccount,
      to: contract.address,
      value: ethers.utils.parseEther("0.00"),
      nonce: await web3.getTransactionCount(accounts[0], "latest"),
    };

    const signedContract = contract.connect(signer);
    console.log("signer", signedContract.signer);
    await signedContract.setAssignVoucherCode();
    const voucherCodeResult = await contract.getAssignVoucherCode();
    console.log("voucher", voucherCodeResult);
    if (!voucherCodeResult) {
      alert("error! voucher code not retrievable!");
      return;
    }
    this.setState({ voucherValue: voucherCodeResult });
  };

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <h1>Good to Go!</h1>
        <p>Your Truffle Box is installed and ready.</p>
        <h2>Mock Shopping Discount voucher provider</h2>
        <button onClick={this.getVoucherCode}>Get Voucher Now!</button>

        <div>The discount voucher code is: {this.state.voucherValue}</div>
      </div>
    );
  }
}

export default App;
