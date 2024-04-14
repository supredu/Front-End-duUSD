import React from 'react'
import './index.less'
import { Form,Input,Button,Alert,Space } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { connect } from 'react-redux';
import ControllerJSON from "../../../out/Controller.sol/Controller.json"
import IERC20JSON from "../../../out/IERC20.sol/IERC20.json";
import { AddressContract } from '../../../constVal/ContractAddr';
import BigNumber from 'bignumber.js';


 class Redeems extends React.Component{
     onFinish = (values) => {
        console.log('Received values of form: ', values);
      };
      state = {
        "redeemValue": 0,
    }
 
    componentDidMount(){
        this.fetchTotalDebt2();
        // this.intervalId = setInterval(this.fetchTotalDebt2.bind(this), 1000);
    }
    componentWillUnmount() {
        // clearInterval(this.intervalId); // 组件卸载时清除定时器
      }
    async fetchTotalDebt2() {
        const { name,address,topHeader } = this.props;
        const controllerABi = ControllerJSON.abi;
        // controller_btc.positions(address).debt / (10 ** 18)
        console.log("------1")
        if(name=='ETH'){
            const controllerETH = AddressContract.controllerETH;
            const ETHContract = new window.web.eth.Contract(controllerABi, controllerETH);
            const debt1 = await ETHContract.methods.positions(address).call();
            const debt2 = debt1[1] * topHeader.priceOracleETH;
            console.log("debt: "+debt1.debt)
            this.setState({
                redeemValue: debt2/(10**18)
            })
           
        }else if(name=='BTC'){
            const controllerBTC = AddressContract.controllerBTC;
            const BTCContract = new window.web.eth.Contract(controllerABi, controllerBTC);
            const debt1 = await BTCContract.methods.positions(address).call();
            const debt2 = debt1[1] * topHeader.priceOracleBTC;
            console.log("debt2: "+debt2)

            this.setState({
                redeemValue: debt2/(10**18)
            })
        }
    }
   
    render(){
        const RedeemSubmit = async () => {
            const { name,address } = this.props;
            // 检查window.ethereum是否可用，MetaMask注入的对象
            const IERC20ABI = IERC20JSON.abi;
            // const amount = Number.MAX_SAFE_INTEGER+"";
            const amount = new BigNumber ( Number.MAX_SAFE_INTEGER)
            const controllerABi = ControllerJSON.abi;
            const duUSDAddr = AddressContract.duUSD;
            if(name == 'BTC'){
                const controllerBTC = AddressContract.controllerBTC;
                const IERCContract = new window.web.eth.Contract(IERC20ABI, duUSDAddr);
                await IERCContract.methods.approve(controllerBTC,amount).send({ from: address });

                const BTCContract = new window.web.eth.Contract(controllerABi, controllerBTC);
                await BTCContract.methods.withdraw().send({ from: address });
             }else if(name=='ETH'){
                const controllerETH = AddressContract.controllerETH;
                const IERCContract = new window.web.eth.Contract(IERC20ABI, duUSDAddr);
                await IERCContract.methods.approve(controllerETH,amount).send({ from: address });

                const ETHContract = new window.web.eth.Contract(controllerABi, controllerETH);
                await ETHContract.methods.withdrawETH().send({ from: address });
          }};

        return (
            <Form name="complex-form"
            className='redeem-container'
            onFinish={this.onFinish}
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            style={{ maxWidth: 600 }}>

                <Form.Item className='form-item'>
                    <span className='title'>debt: </span>
                    <Input className='value_input' value={this.state.redeemValue} readOnly/>
                </Form.Item>

               
                <Form.Item className='form-item'>
                    <Button type='primary' className='submit-btn' onClick={RedeemSubmit} >Redeem</Button>

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
  
export default connect(mapStateToProps)(Redeems);