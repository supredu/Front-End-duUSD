import React from 'react'
import './index.less'
import { Form,Input,Button } from 'antd';
import { connect } from 'react-redux';
import IERC20JSON from "../../../out/IERC20.sol/IERC20.json";

import AMMJSON from "../../../out/AMM.sol/LLAMMA.json";
import { AddressContract } from '../../../constVal/ContractAddr';
import { RetweetOutlined } from '@ant-design/icons';

class Deposit extends React.Component{
    
   
    constructor(props) {
        super(props); 
        const {poolInfo} = this.props;
        this.state = {
          input_value: 0,
          readOnlValue: 0,
          CB: true,
          ethname: poolInfo.ethname || "", 
          secname: poolInfo.secname || ""
        };
      }
     onFinish = (values) => {
        console.log('Received values of form: ', values);
      };

      handleInputChange = (event)=>{
            

            this.setState({
                input_value: event.target.value
            });
            this.fetchData();
        
        }

      
      async fetchData(){
        const {poolInfo} = this.props;
        // AMM.borrowedTokenAmount() - AMM.k() / AMM.collateralTokenAmount()
        if(poolInfo.ethname == 'BTC'){
            const AMMBTC = AddressContract.AMMBTC;
            const AMMAbi = AMMJSON.abi;
            const AMMBTCContract = new window.web.eth.Contract(AMMAbi,AMMBTC);
            const AMMBTCBrrowed =  await AMMBTCContract.methods.borrowedTokenAmount().call();
            const AMMK = await AMMBTCContract.methods.k().call();
            const AMMColla = await AMMBTCContract.methods.collateralTokenAmount().call();
     
            if(this.state.CB){
                const value2 = (AMMBTCBrrowed - AMMK/(AMMColla+this.state.input_value * (10**18)))/(10**18);
                this.setState({
                    readOnlValue: value2
                });
                console.log(this.state.CB+ "-"+ value2)
            }else{
                const value2_ = (AMMColla - AMMK/(AMMBTCBrrowed+this.state.input_value * (10**18)))/(10**18);
                this.setState({
                    readOnlValue: value2_
                });
                console.log(this.state.CB+ "-"+ value2_)
            }
            
            
        }else if(poolInfo.ethname=='ETH'){
            const AMMETH = AddressContract.AMMETH;
            const AMMAbi = AMMJSON.abi;
            const AMMETHContract = new window.web.eth.Contract(AMMAbi,AMMETH);
            const AMMETHBrrowed = await  AMMETHContract.methods.borrowedTokenAmount().call();
            const AMMK = await AMMETHContract.methods.k().call();
            const AMMColla = await AMMETHContract.methods.collateralTokenAmount().call();
            if(this.state.CB){
                const value3 = (AMMETHBrrowed - AMMK/(AMMColla+this.state.input_value * (10**18)))/(10**18);
                this.setState({
                    readOnlValue: value3
                });
            }else{
                const value3_ = (AMMColla - AMMK/(AMMETHBrrowed+this.state.input_value * (10**18)))/(10**18);
                this.setState({
                    readOnlValue: value3_
                });
            }
           
      }
    }
    render(){
        const {poolInfo,address} = this.props;
        // ①调用BTC的approve方法，approve(AMM_BTC,amount)②调用AMM_BTC的 swapCForB(uint256)
        // -> swap duUSD to btc ①调用duUSD的approve方法，approve(AMM_BTC,amount)②调用AMM_BTC的 swapBForC(uint256)
        // eth/duUSD -> swap eth to duUSD ①调用AMM_ETH的 swapCForB(uint256)
        // -> swap duUSD to eth ①调用duUSD的approve方法，approve(AMM_ETH,amount)②调用AMM_ETH的 swapBForC(uint256)
        const commitAmount = async () => {
            if(poolInfo.ethname == 'BTC'){
                const IERC20Abi = IERC20JSON.abi;
                const AMMAbi = AMMJSON.abi;
                const BTCAddr = AddressContract.BTC;
                const AMMBTC = AddressContract.AMMBTC;
                const duUSDAddr = AddressContract.duUSD;
                const amount = this.state.input_value * (10**18)+"";

               
                const AMMContract = new  window.web.eth.Contract(AMMAbi,AMMBTC);
                if(this.state.CB){
                    const BTCContract = new window.web.eth.Contract(IERC20Abi,BTCAddr);
                    await BTCContract.methods.approve(AMMBTC,amount).send({ from: address });
                    await AMMContract.methods.swapCForB(amount).send({ from: address });
                }else{
                    const duUSDContract = new window.web.eth.Contract(IERC20Abi,duUSDAddr);
                    await duUSDContract.methods.approve(AMMBTC,amount).send({ from: address });
                    await AMMContract.methods.swapBForC(amount).send({ from: address });
                }
                

               
            }else if(poolInfo.ethname=='ETH'){
                const IERC20Abi = IERC20JSON.abi;
                const AMMAbi = AMMJSON.abi;
                const ETHAddr = AddressContract.ETH;
                const AMMETH = AddressContract.AMMETH;
                const duUSDAddr = AddressContract.duUSD;
                const amount = this.state.input_value * (10**18)+"";

                const AMMContract = new  window.web.eth.Contract(AMMAbi,AMMETH);
                if(this.setState.CB){
                    await AMMContract.methods.swapCForB(amount).send({ from: address });
                }else{
                    const duUSDContract = new window.web.eth.Contract(IERC20Abi,duUSDAddr);
                    await duUSDContract.methods.approve(AMMETH,amount).send({ from: address });
                    await AMMContract.methods.swapBForC(amount).send({ from: address });
                }
               

               
          }};

          const commitSwap = ()=>{
                console.log(this.state.CB)
                if(this.state.CB){
                    // c for duUSd
                   this.setState(
                    {
                        CB: false,
                        ethname: poolInfo.secname,
                        secname: poolInfo.ethname
                    }
                   )
                }else{
                    this.setState(
                        {
                            CB: true,
                            ethname: poolInfo.ethname,
                            secname: poolInfo.secname
                        }
                       )
                }
          }
        return (
            <Form name="complex-form"
            className='deposit-container'
            onFinish={this.onFinish}
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            style={{ maxWidth: 600 }}>

                <Form.Item className='form-item'>
                    <span className='title'>{this.state.ethname}</span>
                    <Input className='value_input'  value={this.state.input_value}  onChange={this.handleInputChange}/>
                </Form.Item>
                <Form.Item className='form-item1'>
                    <Button type="circle" className='swap_btn' onClick={commitSwap} icon={<RetweetOutlined />}>
                    </Button>
                </Form.Item>
                <Form.Item  className='form-item'>
                    <span className='title'>{this.state.secname}</span>
                    <Input className='value_input' value={this.state.readOnlValue} readOnly/>
                </Form.Item>
                <Form.Item className='form-item'>
                    <span className='rate_1'>Additional slippage tolerance:</span>
                    <span className='rate_2'>0.03%</span>
                </Form.Item>

                <Form.Item className='form-item'>
                    <Button type='primary' onClick={commitAmount} className='submit-btn'>SWAP</Button>
                </Form.Item>
                
            </Form>
        );
    }
}

const mapStateToProps = (state) => ({
    poolName: state.poolName,
    poolInfo: state.poolInfo,
    address: state.address
  });

  export default connect(mapStateToProps)(Deposit);