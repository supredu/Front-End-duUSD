import React from 'react';
import { Table ,Spin} from 'antd';
import './index.less'
import { Link } from 'react-router-dom'; // 假设你使用React Router进行导航
import { connect } from 'react-redux';
import { setName,setTopHeader,setPoolName,setStablePoolInfo,setStablePoolName } from '../../redux/action';
import { AddressContract } from '../../constVal/ContractAddr';
import PriceOracleJSON from "../../out/IPriceOracle.sol/IPriceOracle.json";
import StablePoolJSON from "../../out/StablePool.sol/StablePool.json"
class StablePool extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true, 
      data: [
        {
          key: '1',
          name: 'usdt/DuUSD',
          chinese: '19.98%',
          math: '19.98%->24.39%',
          volume: 'US$9',
          tvl: 'US$1.10亿'
        },
        {
            key: '2',
            name: 'usdc/duUSD',
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

      const stablePoolTAddrUSDT = AddressContract.STABLEPOOLDuUSDUSDT;
      const stablePoolTAddrUSDC = AddressContract.STABLEPOOLDuUSDUSDC;
      
      const duUSDAddr = AddressContract.duUSD;
      const OracleABI = PriceOracleJSON.abi;
      const StableAbi = StablePoolJSON.abi;
      const contractPriceOracle = AddressContract.PriceOracle;

      const PriceOracleContract = new window.web.eth.Contract(OracleABI, contractPriceOracle);
      const StablePoolContractUSDT = new window.web.eth.Contract(StableAbi,stablePoolTAddrUSDT);
      const StablePoolContractUSDC = new window.web.eth.Contract(StableAbi,stablePoolTAddrUSDC);
      const reserve1 = await StablePoolContractUSDT.methods.reserve1().call();
      const reserve2 = await StablePoolContractUSDT.methods.reserve2().call();

      const reserveUSDC1 = await StablePoolContractUSDC.methods.reserve1().call();
      const reserveUSDC2 = await StablePoolContractUSDC.methods.reserve2().call();

      const VolumeUSDT =( (reserve1+reserve2) /(10**18)).toLocaleString()
      const VolumeUSDC =( (reserveUSDC1+reserveUSDC2) /(10**18)).toLocaleString()
      const duUsdPrice = await PriceOracleContract.methods.getPrice(duUSDAddr).call();
      const tvlUSDT = VolumeUSDT * (duUsdPrice / (10**18)).toLocaleString()
      const tvlUSDC = VolumeUSDC * (duUsdPrice / (10**18)).toLocaleString()
      this.setState(prevState => ({
        loading: false, 
        data: prevState.data.map(item => {
          if (item.name === 'usdt/DuUSD') {
            return { ...item,volume: VolumeUSDT, tvl: tvlUSDT };
          } else if (item.name === 'usdc/duUSD') {
            return { ...item,volume: VolumeUSDC, tvl: tvlUSDC};
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
        case 'usdt/DuUSD':
          return <span>
              <img src='/assets/sshi.png' style={{ width: '20px', height: '20px' }}/>
              <img src='/assets/curve-logo.png' style={{ width: '20px', height: '20px' }}/>
          </span>
          
        case 'usdc/duUSD':
          return  <span>
              <img src='/assets/tshi.png' style={{ width: '20px', height: '20px' }}/>
              <img src='/assets/curve-logo.png' style={{ width: '20px', height: '20px' }}/>
          </span>
          
        default:
          return null; // 如果没有匹配的name，则返回null或其他默认值
      }
    };
    render() {
          const { setStablePoolName } = this.props;

          const { loading,data } = this.state;


        const columns = [
          {
              title: 'POOL',
              dataIndex: 'name',
              render: (text, record) => (
                <Link to={`/pchart`} onClick={() => setStablePoolName(text)}>
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
  poolName: state.poolName,
  stablePoolInfo: state.stablePoolInfo,
  stablePoolName: state.stablePoolName
});

const mapDispatchToProps = (dispatch) => ({
  setName: (name) => dispatch(setName(name)),
  setTopHeader: (topHeader) => dispatch(setTopHeader(topHeader)),
  setPoolName: (name) => dispatch(setPoolName(name)),
  setStablePoolInfo: (stablePoolInfo)=>dispatch(setStablePoolInfo(stablePoolInfo)),
  setStablePoolName: (name)=> dispatch(setStablePoolName(name))
});

export default connect(mapStateToProps, mapDispatchToProps)(StablePool);