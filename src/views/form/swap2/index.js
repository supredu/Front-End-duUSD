import React from 'react'
import './index.less'
import { Form,Input,Button } from 'antd';
import { connect } from 'react-redux';
import IERC20JSON from "../../../out/IERC20.sol/IERC20.json";

import AMMJSON from "../../../out/AMM.sol/LLAMMA.json";
import { AddressContract } from '../../../constVal/ContractAddr';
import { RetweetOutlined } from '@ant-design/icons';
import STABLEJSON from "../../../out/StablePool.sol/StablePool.json"
import BigNumber from 'bignumber.js';

class SWAP2 extends React.Component{
    
   
    constructor(props) {
        super(props); 
        const {stablePoolInfo} = this.props;
        this.state = {
          input_value: 0,
          readOnlValue: 0,
          UD: true,
          ethname: stablePoolInfo.ethname || "", 
          secname: stablePoolInfo.secname || "",
          price: 1
        };
      }
     onFinish = (values) => {
        console.log('Received values of form: ', values);
      };

      handleInputChange = (event)=>{
            

            this.setState({
                input_value: event.target.value,
                readOnlValue: event.target.value
            });        
        }

        componentDidMount() {
            // 在组件挂载后调用合约方法，获取 "Total debt" 数据
            this.fetchTotalDebt();
          }
      
        async fetchTotalDebt(){
            const {stablePoolInfo} = this.props;
            if(stablePoolInfo.ethname == 'USDT'){
                // swap duUSD to USDT->①调用duUSD的approve方法，approve(stablePoolT,amount)②调用stablePoolT的 swap(duUSD,uint256)
                // ->swap USDT to duUSD->①调用USDT的approve方法，approve(stablePoolT,amount)②调用stablePoolT的 swap(USDT,uint256)
                    const IERC20Abi = IERC20JSON.abi;
                    const stablePoolTAddr = AddressContract.STABLEPOOLDuUSDUSDT;
                    const usdtAddr = AddressContract.USDT;
                    const USDTContract = new window.web.eth.Contract(IERC20Abi,usdtAddr);
                    const duUSDAddr = AddressContract.duUSD;
                    const duUSDContract = new window.web.eth.Contract(IERC20Abi,duUSDAddr);
                    const balance1 = await USDTContract.methods.balanceOf(stablePoolTAddr).call();
                    const balance2 = await duUSDContract.methods.balanceOf(stablePoolTAddr).call();

                    const price = new BigNumber(balance1).times(1000).dividedBy(new BigNumber(balance2));

                    const priceRe  = price /1000
                    console.log("price: "+priceRe)
                    this.setState({
                        price: priceRe
                    })
            }else if(stablePoolInfo.ethname=='USDC'){
//                 swap duUSD to USDC->①调用duUSD的approve方法，approve(stablePoolC,amount)②调用stablePoolC的 swap(duUSD,uint256)
                        // ->swap USDC to duUSD->①调用USDC的approve方法，approve(stablePoolC,amount)②调用stablePoolC的 swap(USDC,uint256)
                    const IERC20Abi = IERC20JSON.abi;
                    const stablePoolCAddr = AddressContract.STABLEPOOLDuUSDUSDC;
                    const usdcddr = AddressContract.USDC;
                    const USDTContract = new window.web.eth.Contract(IERC20Abi,usdcddr);
                    const duUSDAddr = AddressContract.duUSD;
                    const duUSDContract = new window.web.eth.Contract(IERC20Abi,duUSDAddr);
                    const balance1 = await USDTContract.methods.balanceOf(stablePoolCAddr).call();
                    const balance2 = await duUSDContract.methods.balanceOf(stablePoolCAddr).call();
                    const price = new BigNumber(balance1).times(1000).dividedBy(new BigNumber(balance2));

                    const priceRe  =price /1000
                    console.log("price: "+priceRe)
                    this.setState({
                        price: priceRe
                    })
                    

          }};
    
    render(){
        const {stablePoolInfo,address} = this.props;
        const commitAmount = async () => {
            // const balance1 = await token1.balanceOf(stablePoolAddress);
            // const balance2 = await token2.balanceOf(stablePoolAddress);
            // const price = balance2.mul(ethers.BigNumber.from(1000)).div(balance1);
            if(stablePoolInfo.ethname == 'USDT'){
                // swap duUSD to USDT->①调用duUSD的approve方法，approve(stablePoolT,amount)②调用stablePoolT的 swap(duUSD,uint256)
                // ->swap USDT to duUSD->①调用USDT的approve方法，approve(stablePoolT,amount)②调用stablePoolT的 swap(USDT,uint256)
                    const IERC20Abi = IERC20JSON.abi;
                    const stableUSDTAbi = STABLEJSON.abi;
                    const stablePoolTAddr = AddressContract.STABLEPOOLDuUSDUSDT;
                    const amount = this.state.input_value * (10**18)+"";
                    const STABLEContract = new window.web.eth.Contract(stableUSDTAbi,stablePoolTAddr);
                    const usdtAddr = AddressContract.USDT;
                    const USDTContract = new window.web.eth.Contract(IERC20Abi,usdtAddr);
                    const duUSDAddr = AddressContract.duUSD;
                    const duUSDContract = new window.web.eth.Contract(IERC20Abi,duUSDAddr);
                    // const balance1 = await USDTContract.methods.balanceOf(stablePoolTAddr).call();
                    // const balance2 = await duUSDContract.methods.balanceOf(stablePoolTAddr).call();
                    // const price = balance1.times(1000).dividedBy(balance2);
                    // const priceRe  = price /1000
                    // console.log("price: "+priceRe)
                    // this.setState({
                    //     price: priceRe
                    // })
                    if(this.state.UD){
                        // USDT -> duUSD
                        await USDTContract.methods.approve(stablePoolTAddr,amount).send({ from: address });
                        await STABLEContract.methods.swap(usdtAddr,amount).send({ from: address });
                    }else{
                        //duUSD->USDT
                      
                        await duUSDContract.methods.approve(stablePoolTAddr,amount).send({ from: address });
                        await STABLEContract.methods.swap(duUSDAddr,amount).send({ from: address });
                    }

            }else if(stablePoolInfo.ethname=='USDC'){
//                 swap duUSD to USDC->①调用duUSD的approve方法，approve(stablePoolC,amount)②调用stablePoolC的 swap(duUSD,uint256)
                        // ->swap USDC to duUSD->①调用USDC的approve方法，approve(stablePoolC,amount)②调用stablePoolC的 swap(USDC,uint256)
                    const IERC20Abi = IERC20JSON.abi;
                    const stableUSDTAbi = STABLEJSON.abi;
                    const stablePoolCAddr = AddressContract.STABLEPOOLDuUSDUSDC;
                    const amount = this.state.input_value * (10**18)+"";
                    const STABLEContract = new window.web.eth.Contract(stableUSDTAbi,stablePoolCAddr);
                    const usdcddr = AddressContract.USDC;
                    const USDTContract = new window.web.eth.Contract(IERC20Abi,usdcddr);
                    const duUSDAddr = AddressContract.duUSD;
                    const duUSDContract = new window.web.eth.Contract(IERC20Abi,duUSDAddr);
                    // const balance1 = await USDTContract.methods.balanceOf(stablePoolCAddr).call();
                    // const balance2 = await duUSDContract.methods.balanceOf(stablePoolCAddr).call();
                    // const price = balance1.times(1000).dividedBy(balance2);
                    // const priceRe  =price /1000
                    // console.log("price: "+priceRe)
                    // this.setState({
                    //     price: priceRe
                    // })
                    if(this.state.UD){
                        // USDC -> duUSD
                       
                        await USDTContract.methods.approve(stablePoolCAddr,amount).send({ from: address });
                        await STABLEContract.methods.swap(usdcddr,amount).send({ from: address });
                    }else{
                        //duUSD->USDC
                       
                        await duUSDContract.methods.approve(stablePoolCAddr,amount).send({ from: address });
                        await STABLEContract.methods.swap(duUSDAddr,amount).send({ from: address });
                    }

          }};

          const commitSwap = ()=>{
                console.log(this.state.UD)
                if(this.state.UD){
                    // c for duUSd
                   this.setState(
                    {
                        UD: false,
                        ethname: stablePoolInfo.secname,
                        secname: stablePoolInfo.ethname
                    }
                   )
                }else{
                    this.setState(
                        {
                            UD: true,
                            ethname: stablePoolInfo.ethname,
                            secname: stablePoolInfo.secname
                        }
                       )
                }
          }
        return (
            <Form name="complex-form"
            className='swap2-container'
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
                <Form.Item className='form-item2'>
                    <span className='rate_1'>Price</span>
                    <span className='rate_2'>{this.state.price}</span>
                </Form.Item>

                <Form.Item className='form-item'>
                    <Button type='primary' onClick={commitAmount} className='submit-btn'>SWAP</Button>
                </Form.Item>
                
            </Form>
        );
    }
}

const mapStateToProps = (state) => ({
    address: state.address,
    stablePoolName: state.stablePoolName,
    stablePoolInfo: state.stablePoolInfo
  });

  export default connect(mapStateToProps)(SWAP2);