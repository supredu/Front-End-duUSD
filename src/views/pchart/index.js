import React from 'react';
import { Tabs } from 'antd';
import Home from '../home';
import Loan from '../form/loan';
import Leverage from '../form/leverage'
import './index.less'
import echarts from "echarts"
import ReactECharts from 'echarts-for-react';
import Deposit from '../form/deposit';
import Withdraw from '../form/withdraw';
import Swap from '../form/swap';
import { connect } from 'react-redux';
import { setStablePoolInfo } from '../../redux/action';
import Swap2 from '../form/swap2';

 class StablePoolChart extends React.Component {
    state = {
        items: '',
        ethname: '',
        curveUSD: '',
        secname: ''
    }
    componentWillMount(){
        const items = [
            {
                label: `Deposit`,
                key: 1,
                children: <Swap/>
            },
            {
                label: `Withdraw`,
                key: 2,
                children: <Withdraw/>,
            },
            {
                label: `Swap`,
                key: 3,
                children: <Swap2/>
            },
        ];
        this.setState({
            items: items
        })
        
    }
    componentDidMount(){
      const { stablePoolName,setStablePoolInfo } = this.props;
      const [firstCurrency, secondCurrency] = stablePoolName.split('/');
      if (firstCurrency=='usdt'){
        console.log('usdt')
        this.setState({
          curveUSD: 'USDT / duUSD',
        })
        setStablePoolInfo({
          ethname: 'USDT',
          curveUSD: 'USDT / duUSD',
          secname: 'duUSD'
        })
  
      }else if(firstCurrency=='usdc'){
        console.log('usdc')
        this.setState({
          curveUSD: 'USDC / duUSD',
        })
        setStablePoolInfo({
          ethname: 'USDC',
          curveUSD: 'USDC / duUSD',
          secname: 'duUSD'
        })
      }
    }
  
    
    render(){


      const onChange = (key) => {
        console.log(key);
      };
      let seriesData;
      if (this.state.curveUSD === 'USDT / duUSD') {
        seriesData = [
          {
            name: 'USDT', // 第二根线的名称
            data: [1,1,1,1,1,1,1,1,1,1,1,1,1,1],
            type: 'line'
          },
        ];
      } else if (this.state.curveUSD === 'USDC / duUSD') {
        seriesData = [
          {  
          name: 'USDC', // 第二根线的名称
          data: [1,1,1,1,1,1,1,1,1,1,1,1,1,1],
          type: 'line'},
        ];
      } else {
        // 如果 name 不匹配任何预期值，则设置默认 series 数据
        seriesData = [
          {
            name: 'USDC', // 第二根线的名称
            data: [1,1,1,1,1,1,1,1,1,1,1,1,1,1],
            type: 'line'
          },
        ];
      }
      const option = {
        title: {
          text: this.state.curveUSD
        },
        tooltip: {
          trigger: 'axis'
        },
        xAxis: {
          type: 'category',
          data: [1,2,3,4,5,6,7,8,9,10,11,12,13,14]
        },
        yAxis: {
          type: 'value'
        },
        series: seriesData
      };
        return(
            <div className='mchart-container'>
                <Tabs
                    onChange={onChange}
                    style={{backgroundColor: 'white',width: '400px',height:'500px',marginLeft:'100px'}}
                    type="card"
                    items={this.state.items}
                    className='tabs_info'
  />
                <span className='font_info'>{this.state.ethname}</span>

                <div className='_charts'>
                    <ReactECharts option={option} style={{ height: '400px' }} />
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
  stablePoolName: state.stablePoolName,
  stablePoolInfo: state.stablePoolInfo
});
const mapDispatchToProps = (dispatch) => ({
  setStablePoolInfo: (poolInfo) => dispatch(setStablePoolInfo(poolInfo)),
});
export default connect(mapStateToProps,mapDispatchToProps)(StablePoolChart);