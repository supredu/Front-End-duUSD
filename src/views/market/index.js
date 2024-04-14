import React, { useState, useEffect  } from 'react';
import { Table,Spin } from 'antd';
import './index.less';
import { Link } from 'react-router-dom'; // 假设你使用React Router进行导航
import { connect } from 'react-redux';
import { setName,setTopHeader } from '../../redux/action';
import LLAMMAJSON from "../../out/AMM.sol/LLAMMA.json";
import PriceOracleJSON from "../../out/IPriceOracle.sol/IPriceOracle.json";
import IERC20JSON from "../../out/IERC20.sol/IERC20.json";
import { AddressContract } from '../../constVal/ContractAddr';


 class Market extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true, 
      data: [
        {
          key: '1',
          name: 'BTC',
          chinese: '19.98%->24.39%',
          math: 52023799.57,
          Cap: '2亿',
          borrow: '1.48亿',
          collateral: 'US$1.10亿'
        },
        {
            key: '2',
            name: 'ETH',
            chinese: '19.98%->24.39%',
            math: 52023799.57,
            Cap: '2亿',
            borrow: '1.48亿',
            collateral: 'US$1.10亿'
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
      console.log("market 拉入数据1: ")
      const { setTopHeader } = this.props;

      const contractABI = LLAMMAJSON.abi;
      const OracleABI = PriceOracleJSON.abi;
      const contractAddressBTC = AddressContract.AMMBTC;
      const contractAddressETH = AddressContract.AMMETH;
      const contractPriceOracle = AddressContract.PriceOracle;
      const BTC = AddressContract.BTC;
      const ETH = AddressContract.ETH;
      const BTCContract = new window.web.eth.Contract(contractABI, contractAddressBTC);
      const ETHContract = new window.web.eth.Contract(contractABI, contractAddressETH);
      const PriceOracleContract = new window.web.eth.Contract(OracleABI, contractPriceOracle);

      console.log("market 拉入数据2: ")
      const debt1 = await BTCContract.methods.borrowedTokenAmount().call();
      console.log("market 拉入数据?: ")
      const debt2 = await ETHContract.methods.borrowedTokenAmount().call();
      console.log("market 拉入数据*: ")
      const collateral1 = await BTCContract.methods.collateralTokenAmount().call();
      console.log("market 拉入数据_: ")
      const collateral2 = await ETHContract.methods.collateralTokenAmount().call();
      console.log("market 拉入数据|: ")
      const borrow1 = await BTCContract.methods.collateralTokenAmount().call();
      const borrow2 = await ETHContract.methods.collateralTokenAmount().call();

      const priceOracleBTC = await PriceOracleContract.methods.getPrice(BTC).call();
      const priceOracleETH = await PriceOracleContract.methods.getPrice(ETH).call();

      const collateralBTC = (collateral1/(10**18) )* ( priceOracleBTC/(10**18))
      const collateralETH = (collateral2/(10**18) )* ( priceOracleETH/(10**18))
      console.log("market 拉入数据4: ")
      // 更新 "Total debt" 数据到组件状态中
      this.setState(prevState => ({
        loading: false, 
        data: prevState.data.map(item => {
          if (item.name === 'BTC') {
            return { ...item, math: debt1 / (10 ** 18),
                    collateral: collateralBTC,
                    borrow: borrow1/(10**18)};
          } else if (item.name === 'ETH') {
            return { ...item, math: debt2 / (10 ** 18),
                      collateral: collateralETH,
                      borrow: borrow2/(10**18) };
          }
          return item;
        })
      }));
      console.log("topHeader")
 // BTC的Total collateral value + ETH的Total collateral value
      const USDT = AddressContract.USDT;
      const USDC = AddressContract.USDC;
      const stablePoolT = AddressContract.STABLEPOOLDuUSDUSDT;
      const StablePoolC = AddressContract.STABLEPOOLDuUSDUSDC;
      const duUSDPrice = AddressContract.duUSD;
      const IERC20ABI = IERC20JSON.abi;
      const tvl = (collateralBTC + collateralETH).toLocaleString();
      const contractIERC20USDT = new window.web.eth.Contract(IERC20ABI, USDT);
      const contractIERC20USDC = new window.web.eth.Contract(IERC20ABI, USDC);
      const contractDuUsd = new window.web.eth.Contract(IERC20ABI,duUSDPrice)
      //( AMM_BTC.borrowedTokenAmount() + AMM_ETH.borrowedTokenAmount() )  / (10 ** 18)
      const supply = ((debt1+debt2)/(10**18)).toLocaleString();
      const usdtPoolT =  await contractIERC20USDT.methods.balanceOf(stablePoolT).call();
      const duUSDPoolT =  await contractDuUsd.methods.balanceOf(stablePoolT).call();

      const usdCPoolTC=  await contractIERC20USDC.methods.balanceOf(StablePoolC).call();
      const duUSDPoolC =  await contractDuUsd.methods.balanceOf(StablePoolC).call();

      const duValue =( usdtPoolT/duUSDPoolT + usdCPoolTC/duUSDPoolC)/2
      // (IERC20(USDT).balanceof(stablePoolT)/IERC20(duUSD).balanceof(stablePoolT) +
      // IERC20(USDC).balanceof(stablePoolC)/IERC20(duUSD).balanceof(stablePoolC) ) / 2
     const topHeader = {
        'TVL': tvl,
        'Supply': supply,
        'duUSD': duValue,
        "priceOracleETH":  priceOracleETH/(10**18),
        "priceOracleBTC": priceOracleBTC/(10**18)
    }
      console.log(topHeader)
      setTopHeader (topHeader)

    } catch (error) {
      console.error('Error fetching total debt:', error);
    }
   

  }
  renderIcon(name) {
    // 根据name返回相应的图标
    switch (name) {
      case 'BTC':
        return <img src='/assets/bshi.png' style={{ width: '20px', height: '20px' }}/>;
      case 'ETH':
        return <img src='/assets/zhuanshi.png' style={{ width: '20px', height: '20px' }}/>;
      default:
        return null; // 如果没有匹配的name，则返回null或其他默认值
    }
  }
    render() {

      const { setName } = this.props;
      const { loading,data } = this.state;

      const columns = [
        {
            title: 'Markets',
            dataIndex: 'name',
            render: (text, record) => (
              <Link to={`/mchart`} onClick={() => setName(text)}>
                 <span>
                    {this.renderIcon(text)} {/* 根据name选择图标的方法 */}
                    {text}
                </span>
              </Link>
              // <Link to={`/mchart`}>{text}</Link> // 假设跳转到详情页，路径包含record的id
            )
          },
          {
            title: 'Borrow rate',
            dataIndex: 'chinese',
          },
        {
          title: 'Total debt',
          dataIndex: 'math',
          sorter: {
            compare: (a, b) => a.math - b.math,
            multiple: 2,
          },
        },
        {
          title: 'Cap',
          dataIndex: 'Cap',
        },
        {
            title: 'Available to borrow',
            dataIndex: 'borrow',
          },
          {
            title: 'Total collateral value',
            dataIndex: 'collateral',
          },
      ];
      const onChange = (pagination, filters, sorter, extra) => {
        console.log('params', pagination, filters, sorter, extra);
      };
        return (
            <div className='market-container'>
                      <Spin spinning={loading}> 
                      <Table columns={columns} dataSource={data} onChange={onChange} className='table-item'/>

                      </Spin>
            </div> 
            
        );
    }
}

const mapStateToProps = (state) => ({
  name: state.name,
  topHeader: state.topHeader
});

const mapDispatchToProps = (dispatch) => ({
  setName: (name) => dispatch(setName(name)),
  setTopHeader: (topHeader) => dispatch(setTopHeader(topHeader))
});

export default connect(mapStateToProps, mapDispatchToProps)(Market);