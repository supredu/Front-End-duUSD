import React from 'react'
import './index.less'
import { connect } from 'react-redux';
import IERC20JSON from "../../../out/IERC20.sol/IERC20.json";
import ControllerJSON from "../../../out/Controller.sol/Controller.json"
import { AddressContract } from '../../../constVal/ContractAddr';
import BigNumber from 'bignumber.js';
import { Form,Input,Button } from 'antd';
class Loan extends React.Component{
    state = {
        "input_value": 0,
        "readOnlValue": 0,
    }
    onFinish = (values) => {
        console.log('Received values of form: ', values);
      };
      
    handleInputChange = (event)=>{
        const {topHeader,name} = this.props;

        this.setState({
            input_value: event.target.value
        });

        if(name == 'BTC'){
           const value2 = ( (event.target.value * topHeader.priceOracleBTC))*(2/3)
           this.setState({
            readOnlValue: value2
        });
        }else if(name=='ETH'){
            // const value2 = ((event.target.value*10*18) *( topHeader.priceOracleETH /  (10 * 18)) )* (2/3)
            const value3 =( (event.target.value * topHeader.priceOracleETH) )*(2/3)
            this.setState({
             readOnlValue: value3
         });
        }

        // priceOracle.getPrice(BTC) 
      }
    render(){

        const {name,address} = this.props;
//         btc -> create loan ①调用BTC的approve方法，approve(AMM_BTC,amount) 10*18
// ②调用controller_btc的deposit(uint)方法，传入用户输入的btc数量
// -> redeem[一个框 debt：controller_btc.positions(address).debt / (10 ** 18)
        const commitAmount = async () => {
            // 检查window.ethereum是否可用，MetaMask注入的对象
            const amount = new BigNumber (this.state.input_value *(10**18))
            console.log("loan: "+amount)
            
            const IERC20ABI = IERC20JSON.abi;
            const controllerABi = ControllerJSON.abi;  
            if(name == 'BTC'){
                const AMM_BTC = AddressContract.AMMBTC;
                const BTC = AddressContract.BTC;
                const controllerBTC = AddressContract.controllerBTC;
                const IERCContract = new window.web.eth.Contract(IERC20ABI, BTC);
                console.log("amount: "+amount)
                await IERCContract.methods.approve(AMM_BTC,amount).send({ from: address });
                console.log(3)
                const BTCContract = new window.web.eth.Contract(controllerABi, controllerBTC);
                await BTCContract.methods.deposit(amount).send({ from: address });
             }else if(name=='ETH'){
                const controllerETH = AddressContract.controllerETH;
                const ETHContract = new window.web.eth.Contract(controllerABi, controllerETH);
                await ETHContract.methods.depositETH().send({ value: amount, from: address });

          }};
        return (
            <Form name="complex-form"
            className='loan-container'
            onFinish={this.onFinish}
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            style={{ maxWidth: 600 }}>

                <Form.Item className='form-item'>
                    <span className='title'>{name} Avail.</span>
                    <Input className='value_input'  value={this.state.input_value}  onChange={this.handleInputChange}/>
                </Form.Item>

                <Form.Item  className='form-item'>
                    <span className='title'>duUSD borrow amount</span>
                    <Input className='value_input' value={this.state.readOnlValue} readOnly/>
                </Form.Item>
                <Form.Item className='form-item'>
                    <span className='rate_1'>Borrow rate: </span>
                    <span className='rate_2'>27.07%-&gt;27.09%</span>
                </Form.Item>

                <Form.Item className='form-item'>
                    
                    <Button type='primary' onClick={commitAmount} className='submit-btn'>Create</Button>
                </Form.Item>
                
            </Form>
        );
        }
}

const mapStateToProps = (state) => ({
    name: state.name,
    topHeader: state.topHeader,
    address: state.address

  });
  
export default connect(mapStateToProps)(Loan);