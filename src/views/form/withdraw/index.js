import React from 'react'
import './index.less'
import { Form,Input,Button } from 'antd';
import { connect } from 'react-redux';
import STABLEJSON from "../../../out/StablePool.sol/StablePool.json"
import { AddressContract } from '../../../constVal/ContractAddr';

class Withdraw extends React.Component{
    
     onFinish = (values) => {
        console.log('Received values of form: ', values);
      };
      state={
        'input_value': 0
    }
   
      handleInputChange = (event)=>{
            this.setState({
                input_value: event.target.value
            });
        }

      
    render(){
        const {poolInfo,address} = this.props;
        // ①调用BTC的approve方法，approve(AMM_BTC,amount)②调用AMM_BTC的 swapCForB(uint256)
        // -> swap duUSD to btc ①调用duUSD的approve方法，approve(AMM_BTC,amount)②调用AMM_BTC的 swapBForC(uint256)
        // eth/duUSD -> swap eth to duUSD ①调用AMM_ETH的 swapCForB(uint256)
        // -> swap duUSD to eth ①调用duUSD的approve方法，approve(AMM_ETH,amount)②调用AMM_ETH的 swapBForC(uint256)
        const commitAmount = async () => {
            if(poolInfo.ethname == 'USDT'){
                const STABLEPOOLduUSDUSDT  = AddressContract.STABLEPOOLDuUSDUSDT;
                const STABLEJSONAbi = STABLEJSON.abi;
                const STABLEContract = new window.web.eth.Contract(STABLEJSONAbi,STABLEPOOLduUSDUSDT);
                await STABLEContract.methods.removeLiquidity(1).send({ from: address });
     
                // stablePoolT的removeLiquidity(1)
            }else if(poolInfo.ethname=='USDC'){
                // 调用 stablePoolC的removeLiquidity(1)
                const STABLEPOOLduUSDUSDC  = AddressContract.STABLEPOOLduUSDUSDC;
                const STABLEJSONAbi = STABLEJSON.abi;
                const STABLEContract = new window.web.eth.Contract(STABLEJSONAbi,STABLEPOOLduUSDUSDC);
                await STABLEContract.methods.removeLiquidity(1).send({ from: address });
    
          }};

        return (
            <Form name="complex-form"
            className='withdraw-container'
            onFinish={this.onFinish}
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            style={{ maxWidth: 600 }}>

                <Form.Item className='form-item'>
                    <span className='title'>LP Tokens</span>
                    <Input className='value_input'  value={this.state.input_value}  onChange={this.handleInputChange}/>
                </Form.Item>
               
                <Form.Item className='form-item'>
                    <span className='rate_1'>Additional slippage tolerance:</span>
                    <span className='rate_2'>0.03%</span>
                </Form.Item>

                <Form.Item className='form-item'>
                    <Button type='primary' onClick={commitAmount} className='submit-btn'>WITHDRAW</Button>
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

  export default connect(mapStateToProps)(Withdraw);