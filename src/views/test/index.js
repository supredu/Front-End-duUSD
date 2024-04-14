import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import tokenJSon from "../../out/MockERC20.sol/mockToken.json"
const contractABI = tokenJSon.abi; // 替换为你的合约ABI
const contractAddress = '0xcC808c2962bB8f2c92B269E04D536B702a8758A0'; // 替换为你的合约地址

const App = () => {
  const [web3, setWeb3] = useState(undefined);
  const [account, setAccount] = useState('');
  const [contract, setContract] = useState();

  useEffect(() => {
    const loadBlockchainData = async () => {
      if (window.ethereum) {
        console.log("1")
        const web3 = new Web3(window.ethereum);
        const accounts = await web3.eth.requestAccounts();
        const contract = new web3.eth.Contract(contractABI, contractAddress);
        setWeb3(web3);
        setAccount(accounts[0]);
        setContract(contract);
      } else {
        alert('Please install MetaMask to use this feature!');
      }
    };

    loadBlockchainData();
  }, []);

  const getData = async () => {
    const result = await contract.methods.getData().call();
    alert(`Data from contract: ${result}`);
  };

  const setData = async () => {
    if (!account) return;
    await contract.methods.setData("YourData").send({ from: account });
    alert('Data set successfully!');
  };

  return (
    <div>
        <br/>
        <br/>

        <br/>
        <br/>
        <br/>
        <h2>Smart Contract Interaction Example</h2>
      {account && <p>Account: {account}</p>}
      <button onClick={getData}>Get Data</button>
      <button onClick={setData}>Set Data</button>
    </div>
  );
};

export default App;
