import React from 'react';
import { Table,Spin } from 'antd';
import './index.less'
import { Link } from 'react-router-dom'; // 假设你使用React Router进行导航
import { connect } from 'react-redux';
import { setName,setTopHeader,setPoolName } from '../../redux/action';
import { AddressContract } from '../../constVal/ContractAddr';
import PriceOracleJSON from "../../out/IPriceOracle.sol/IPriceOracle.json";
import AMMJSON from "../../out/AMM.sol/LLAMMA.json";
 class Pool extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true, 
      data: [
        {
          key: '1',
          name: 'btc/duUSD',
          chinese: '19.98%',
          math: '19.98%->24.39%',
          volume: 'US$9',
          tvl: 'US$1.10亿'
        },
        {
            key: '2',
            name: 'eth/duUSD',
            chinese: '19.98%',
            math: '19.98%->24.39%',
            volume: 'US$9',
            tvl: 'US$1.10亿'
          }
      ]
    };
  }
  componentDidMount() {
    // 在组件挂载后调用合约方法，获取 "Total debt" 数据
    this.fetchTotalDebt();
  }
  async fetchTotalDebt() {
    try {

      //Volume: (StablePoolT.reserve1()+StablePoolT.reserve2()) / (10 ** 18)
      // TVL: Volume * duUSD price

      // const stablePoolTAddr = AddressContract.STABLEPOOLDuUSDUSDT;
      // const duUSDAddr = AddressContract.duUSD;
      // const OracleABI = PriceOracleJSON.abi;
      // const StableAbi = StablePoolJSON.abi;
      // const contractPriceOracle = AddressContract.PriceOracle;

      // const PriceOracleContract = new window.web.eth.Contract(OracleABI, contractPriceOracle);
      // const StablePoolContract = new window.web.eth.Contract(StableAbi,stablePoolTAddr);
      // const reserve1 = await StablePoolContract.methods.reserve1().call();
      // const reserve2 = await StablePoolContract.methods.reserve2().call();
      // const VolumeT =( (reserve1+reserve2) /(10**18)).toLocaleString()
      // const duUsdPrice = await PriceOracleContract.methods.getPrice(duUSDAddr).call();
      // const tvlT = VolumeT * (duUsdPrice / (10**18))

      // POOLS: volume:AMM.collateralTokenAmount() TVL:volume * price
      const AMMBTC = AddressContract.AMMBTC;
      const AMMETH = AddressContract.AMMETH;

      const BTC = AddressContract.BTC;
      const ETH = AddressContract.ETH;
      const OracleABI = PriceOracleJSON.abi;
      const AMMAbi = AMMJSON.abi;
      const contractPriceOracle = AddressContract.PriceOracle;

      const PriceOracleContract = new window.web.eth.Contract(OracleABI, contractPriceOracle);
      const AMMBTCContract = new window.web.eth.Contract(AMMAbi,AMMBTC);
      const AMMETHCContract = new window.web.eth.Contract(AMMAbi,AMMETH);
      const AMMBTCVolume =  await AMMBTCContract.methods.collateralTokenAmount().call();
      const AMMETHVolume =  await AMMETHCContract.methods.collateralTokenAmount().call();

      const BTCPrice = await PriceOracleContract.methods.getPrice(BTC).call();
      const ETHPrice = await PriceOracleContract.methods.getPrice(ETH).call();

      this.setState(prevState => ({
        loading: false, 
        data: prevState.data.map(item => {
          if (item.name === 'btc/duUSD') {
            const btcVolumn = (AMMBTCVolume/(10**18) ).toLocaleString();
            const btcp = (BTCPrice / (10**18)).toLocaleString();
            return { ...item,volume: btcVolumn, tvl: btcp };
          } else if (item.name === 'eth/duUSD') {
            const ethVolumn = (AMMETHVolume/(10**18) ).toLocaleString();
            const ethp = (ETHPrice / (10**18)).toLocaleString();
            return { ...item,volume: ethVolumn, tvl: ethp};
          }
          return item;
        })
      }));
    } catch (error) {
      console.error('Error fetching total debt:', error);
    }

    }
   renderIcon (name) {
    // 根据name返回相应的图标
    switch (name) {
      case 'btc/duUSD':
        return <span>
            <img src='/assets/bshi.png' style={{ width: '20px', height: '20px' }}/>
            <img src='/assets/curve-logo.png' style={{ width: '20px', height: '20px' }}/>
        </span>
        
      case 'eth/duUSD':
        return  <span>
            <img src='/assets/zhuanshi.png' style={{ width: '20px', height: '20px' }}/>
            <img src='/assets/curve-logo.png' style={{ width: '20px', height: '20px' }}/>
        </span>
        
      default:
        return null; // 如果没有匹配的name，则返回null或其他默认值
    }
  };
 
    render() {
      const { setPoolName } = this.props;
      const { loading,data } = this.state;
     
      const columns = [
        {
            title: 'POOL',
            dataIndex: 'name',
            render: (text, record) => (
              <Link to={`/pool-chart`} onClick={() => setPoolName(text)}>
                <span>
                  {this.renderIcon(text)}
                   {text}
                </span>
               
                
              </Link> // 假设跳转到详情页，路径包含record的id
            )
          },
          {
            title: 'Base vAPY',
            dataIndex: 'chinese',
          },
        {
          title:  (
            <div>
              Rewards tAPR<br/>
              <span>CRV+Incentives</span>
            </div>
          ),
          dataIndex: 'math',
        
        },
        {
          title: 'Volume',
          dataIndex: 'volume',
          sorter: {
            compare: (a, b) => a.volume - b.volume,
            multiple: 2,
          },
        },
        {
            title: 'TVL',
            dataIndex: 'tvl',
          }
      ];

  const onChange = (pagination, filters, sorter, extra) => {
    console.log('params', pagination, filters, sorter, extra);
  };
        return (
            <div className='pool-container'>
              <Spin spinning={loading}> 
                <Table columns={columns} dataSource={data} onChange={onChange} className='pool_table-item'/>
              </Spin>
               
            </div> 
            
        );
    }
}


const mapStateToProps = (state) => ({
  name: state.name,
  topHeader: state.topHeader,
  poolName: state.poolName
});

const mapDispatchToProps = (dispatch) => ({
  setName: (name) => dispatch(setName(name)),
  setTopHeader: (topHeader) => dispatch(setTopHeader(topHeader)),
  setPoolName: (name) => dispatch(setPoolName(name))
});

export default connect(mapStateToProps, mapDispatchToProps)(Pool);