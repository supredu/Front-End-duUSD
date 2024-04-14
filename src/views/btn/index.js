import { Button } from 'antd';
import React, { useState } from 'react';
import Web3 from 'web3';
import { setName,setTopHeader,setAddress} from '../../redux/action';
import { connect } from 'react-redux';


function WalletButton() {
  const [account, setAccount] = useState('');

  // 连接钱包的函数
  const connectWalletHandler = async () => {
    // 检查window.ethereum是否可用，MetaMask注入的对象
    var web3 = new Web3(Web3.givenProvider || "http://localhost:8545");
    let accounts = await web3.eth.requestAccounts()
    setAccount(accounts[0]);
    setAddress(accounts[0])
    window.web = web3
  };

  
  return (
    <Button onClick={connectWalletHandler}>
      {account ? account : 'CONNECT WALLET'}
    </Button>
  );
}



const mapStateToProps = (state) => ({
  name: state.name,
  topHeader: state.topHeader,
  address: state.address
});

const mapDispatchToProps = (dispatch) => ({
  setName: (name) => dispatch(setName(name)),
  setTopHeader: (topHeader) => dispatch(setTopHeader(topHeader)),
  setAddress: (address) => dispatch(setAddress(address))
});

export default connect(mapStateToProps, mapDispatchToProps)(WalletButton);
