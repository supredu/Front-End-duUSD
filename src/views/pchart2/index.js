import React from 'react';
import { Tabs } from 'antd';
import Home from '../home';
import Loan from '../form/loan';
import Leverage from '../form/leverage'
import './index.less'
import echarts from "echarts"
import ReactECharts from 'echarts-for-react';
import Deposit from '../form/deposit';
import { connect } from 'react-redux';
import { setPoolInfo } from '../../redux/action';
import { AddressContract } from '../../constVal/ContractAddr';

 class PoolChart extends React.Component {
    state = {
        items: '',
        ethname: '',
        curveUSD: '',
        secname: ''
    }
    componentWillMount(){
        const items = [
            {
                label: `Swap`,
                key: 1,
                children: <Deposit/>
            }
        ];
        this.setState({
            items: items
        })
        
    }
  componentDidMount(){
    const { poolName,setPoolInfo } = this.props;
    const [firstCurrency, secondCurrency] = poolName.split('/');
    console.log(firstCurrency)
    if (firstCurrency=='btc'){
      console.log('btc')
      this.setState({
        curveUSD: 'BTC / duUSD',
      })
      setPoolInfo({
        ethname: 'BTC',
        curveUSD: 'BTC / duUSD',
        secname: 'duUSD'
      })

    }else if(firstCurrency=='eth'){
      console.log('eth')
      this.setState({
        curveUSD: 'ETH / duUSD',
      })
      setPoolInfo({
        ethname: 'ETH',
        curveUSD: 'ETH / duUSD',
        secname: 'duUSD'
      })
    }
  }
    
    render(){
        
      const onChange = (key) => {
        console.log(key);
      };
      let seriesData;
      if (this.state.curveUSD === 'BTC / duUSD') {
        seriesData = [
          {
            name: 'BTC', // 第二根线的名称
            data: [69849,65464,65963,68488,67820,68896,69360,71620,69146,70631,69704,68788,70123,69668],
            type: 'line'
          },
        ];
      } else if (this.state.curveUSD === 'ETH / duUSD') {
        seriesData = [
          {  name: 'ETH', // 第二根线的名称
          data: [3504,3212,3310,3327,3318,3352,3454,3642,3506,3545,3492,3600,3621,3300],
          type: 'line'},
        ];
      } else {
        // 如果 name 不匹配任何预期值，则设置默认 series 数据
        seriesData = [
          {
            name: 'ETH', // 第二根线的名称
            data: [3504,3212,3310,3327,3318,3352,3454,3642,3506,3545,3492,3600,3621,3300],
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
  poolName: state.poolName,
  poolInfo: state.poolInfo
});
const mapDispatchToProps = (dispatch) => ({
  setPoolInfo: (poolInfo) => dispatch(setPoolInfo(poolInfo)),
});
export default connect(mapStateToProps,mapDispatchToProps)(PoolChart);