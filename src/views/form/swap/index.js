import React from 'react'
import './index.less'
import { Form,Input,Button } from 'antd';
import { connect } from 'react-redux';
import STABLEJSON from "../../../out/StablePool.sol/StablePool.json";
import { AddressContract } from '../../../constVal/ContractAddr';
import IERC20JSON from "../../../out/IERC20.sol/IERC20.json";

import BigNumber from 'bignumber.js';
class SWAP extends React.Component{
    state={
        'input_value': 0,
        "input_value2": 0
    }
   
     onFinish = (values) => {
        console.log('Received values of form: ', values);
      };

      handleInputChange = (event)=>{
            this.setState({
                input_value: event.target.value
            });
        
        }
        handleInputChange2 = (event)=>{
            this.setState({
                input_value2: event.target.value
            });
        }

      
    render(){
        const {address,stablePoolInfo} = this.props;
        const commitAmount = async () => {
            if(stablePoolInfo.ethname == 'USDT'){
                const usdtAmount = this.state.input_value * (10**18);
                const duUsdAmount = this.state.input_value2 * (10**18); 
                const usdtA = new BigNumber(usdtAmount)
                const duUSA = new BigNumber(duUsdAmount)
                // ①调用USDT的approve方法，approve(stablePoolT,amount),调用duUSD的approve方法，
                // approve(stablePoolT,amount②调用stablePoolT的addLiquidity(duUSDamount,USDTamount)
                const USDTAddr = AddressContract.USDT;
                const stablePoolTAddr = AddressContract.STABLEPOOLDuUSDUSDT;
                const duUsdAddr = AddressContract.duUSD;
                const IERC20Abi = IERC20JSON.abi;
                const USDIERCContract = new window.web.eth.Contract(IERC20Abi,USDTAddr);
                const duUSDContract = new window.web.eth.Contract(IERC20Abi,duUsdAddr);

                await USDIERCContract.methods.approve(stablePoolTAddr,usdtA).send({ from: address });
                await duUSDContract.methods.approve(stablePoolTAddr,duUSA).send({ from: address });              
               
                console.log(usdtAmount)
                console.log(duUsdAmount)
                const STABLEPOOLduUSDUSDT  = AddressContract.STABLEPOOLDuUSDUSDT;
                const STABLEJSONAbi = STABLEJSON.abi;
                const STABLEContract = new window.web.eth.Contract(STABLEJSONAbi,STABLEPOOLduUSDUSDT);
                await STABLEContract.methods.addLiquidity(duUSA,usdtA).send({ from: address });
            }else if(stablePoolInfo.ethname=='USDC'){
                // ①调用USDC的approve方法，approve(stablePoolC,amount),调用duUSD的approve方法，
                // approve(stablePoolC,amount)
                // ②调用stablePoolC的addLiquidity(duUSDamount,USDCamount)
                const usdcAmount = this.state.input_value * (10**18);
                const duUsdAmount = this.state.input_value2 * (10**18); 
                const usdcA = new BigNumber(usdcAmount)
                const duUSA = new BigNumber(duUsdAmount)


                const USDCAddr = AddressContract.USDC;
                const stablePooCTAddr = AddressContract.STABLEPOOLDuUSDUSDC;
                const duUsdAddr = AddressContract.duUSD;
                const IERC20Abi = IERC20JSON.abi;
                const USDCERCContract = new window.web.eth.Contract(IERC20Abi,USDCAddr);
                const duUSDContract = new window.web.eth.Contract(IERC20Abi,duUsdAddr);

                await USDCERCContract.methods.approve(stablePooCTAddr,usdcA).send({ from: address });
                await duUSDContract.methods.approve(stablePooCTAddr,duUSA).send({ from: address });              
               

                const STABLEPOOLduUSDUSDC  = AddressContract.STABLEPOOLDuUSDUSDC;
                const STABLEJSONAbi = STABLEJSON.abi;
                const STABLEContract = new window.web.eth.Contract(STABLEJSONAbi,STABLEPOOLduUSDUSDC);
                await STABLEContract.methods.addLiquidity(duUSA,usdcA).send({ from: address });
          }};

        return (
            <Form name="complex-form"
            className='swap-container'
            onFinish={this.onFinish}
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            style={{ maxWidth: 600 }}>

                <Form.Item className='form-item'>
                    <span className='title'>{stablePoolInfo.ethname}</span>
                    <Input className='value_input'  value={this.state.input_value}  onChange={this.handleInputChange}/>
                </Form.Item>
              
                <Form.Item  className='form-item'>
                    <span className='title'>{stablePoolInfo.secname}</span>
                    <Input className='value_input' value={this.state.input_value2} onChange={this.handleInputChange2}/>
                </Form.Item>
                <Form.Item className='form-item'>
                    <span className='rate_1'>Additional slippage tolerance:</span>
                    <span className='rate_2'>0.03%</span>
                </Form.Item>

                <Form.Item className='form-item'>
                    <Button type='primary' onClick={commitAmount} className='submit-btn'>Deposit</Button>
                </Form.Item>
                
            </Form>
        );
    }
}

const mapStateToProps = (state) => ({
    poolName: state.poolName,
    poolInfo: state.poolInfo,
    address: state.address,
    stablePoolName: state.stablePoolName,
    stablePoolInfo: state.stablePoolInfo
  });

  export default connect(mapStateToProps)(SWAP);