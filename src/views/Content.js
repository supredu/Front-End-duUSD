import React, { useEffect } from "react";
import Web3 from 'web3';
import MyHeader from "../components/Header";
import MyFooter from "../components/Footer";
import '../style/common.less'
import Home from "./home";
import { Row,Col } from "antd";
import ContentTable from "./table";
import Market from "./market";

class Content extends React.Component{
    
    // 1. 获取链接
    render(){
        
    
    
        async function initWeb(){
            var web3 = new Web3(Web3.givenProvider || "http://localhost:8545");
         
            //先授权
            let accounts = await web3.eth.requestAccounts()
            // console.log('acount: '+accounts[0])
    
            //获取networkId
            const networkId = await web3.eth.net.getId();
    
            // console.log('networkId: '+networkId)
    
          
            // const token = await new web3.eth.Contract(abi,adress);
            return {
                web3,
                account:accounts[0]
               
            }
    
        }
        return (
            <Row className="container">
                <Col span="24">
                    <MyHeader/>
                    <Row className="content">
                            {this.props.children}
                    </Row>
                    <MyFooter/>
                </Col>
        </Row>
        
                

        )
    }
}

export default Content