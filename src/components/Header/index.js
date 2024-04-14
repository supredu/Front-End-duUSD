import React from 'react';
import { Col, Row,Menu,Button } from 'antd';
import { NavLink } from 'react-router-dom'
import { connect } from 'react-redux';
import { setTopHeader } from '../../redux/action';

import './index.less'
import WalletButton from '../../views/btn';

const items = [
  {
    label: 'MARKETS',
    key: 'markets',
    links: "/market"
  },
  {
    label: 'POOLS',
    key: 'pool',
    links: '/pool'
  },
];
class MyHeader extends React.Component{
  state = {
  }
  handleClick = ({ item, key }) => {
    if (key == this.state.currentKey) {
        return false;
    }
    console.log(item.props.links);
    <NavLink to={item.props.links}></NavLink>
    this.setState({
        currentKey: key
    });
};
  render(){
    const {topHeader} = this.props;


    return( 
    <div className='header'>
      <Row className='top_header'>
        <Col span={8} className='font-container'>
          <span className='font_first'>TVL: </span> 
          <span className='font_value'> US${topHeader.TVL}</span>
        </Col>
        <Col span={8} className='font-container'>
          <span className='font_first'>duUSD Total Supply: </span>
          <span className='font_value'>US${topHeader.Supply}</span>
        </Col>
        <Col span={8} className='font-container'>
          <span className='font_first'>duUSD: </span> 
          <span className='font_value'>{topHeader.duUSD}</span>
        </Col>
      </Row>
  
      <Row className='sub_header'>
        <Col span={6} className='logo'>
              <img src='/assets/curve-logo.png'/>
              
              <span className='header_font'>DuUSD</span>         
        </Col>

        <Col span={6}>
            {/* <Menu  mode="horizontal" items={items}  onClick={this.handleClick}/> */}
            <Menu mode="horizontal" onClick={this.handleClick}>
              <Menu.Item key='markets' label="MARKETS">
                  <NavLink to="/market">MARKETS</NavLink>
              </Menu.Item>
              <Menu.Item key='pool' label="POOLS">
                  <NavLink to="/pool">POOLS</NavLink>
              </Menu.Item>
              <Menu.Item key='stable-pool' label="STABLE_POOL">
                 <NavLink to="/stable-pool">STABLE_POOL</NavLink>
              </Menu.Item>
            </Menu>
        </Col>
        <Col span={6}>
            <div className='header_btn1'>
                <Button >ETHEREUM</Button>
            </div>
        </Col>
        <Col span={6}>
        <div className='header_btn2'>
            {/* <Button >CONNECT WALLET</Button> */}
            <WalletButton/>
        </div>
        </Col>
      </Row>
  
  </div>
  )
  }
 
};

const mapStateToProps = (state) => ({
  topHeader: state.topHeader
});



export default connect(mapStateToProps)(MyHeader);