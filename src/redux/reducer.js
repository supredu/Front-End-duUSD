const initialState = {
    name: 'TEST',
    topHeader: {
        'TVL': '265,416,621',
        'Supply': '149,343,198',
        'duUSD': '0.99638',
        "priceOracleETH": 0,
        "priceOracleBTC": 0
    },
    address: "0xFCC7F5888bD3ed6De62f6fD82Dd8Ff8ee009Fc2b",
    poolName: "TEST",
    poolInfo: {
      "ethname": "ETH",
      "curveUSD": "ETH / duUSD",
      "secname": "duUSD"
    },
    stablePoolName: "TEST",
    stablePoolInfo: {
        "ethname": "TEST",
        "curveUSD": "TEST / duUSD",
        "secname": "duUSD"
    }
  };
  
  const rootReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'SET_NAME':
        
        return {
          ...state,
          name: action.payload
        };
      case 'SET_TOP_Header':
        console.log(action.type)
        return {
            ...state,
            topHeader: action.payload
        };
      case "SET_Address":
        console.log("收到地址了： "+ action.payload)
        return {
            ...state,
            address: action.payload
        };
        case "SET_POOL_NAME":
          return {
            ...state,
            poolName: action.payload
        };
        case "SET_POOL_INFO":
          return {
            ...state,
            poolInfo: action.payload
        };
        case "SET_STABLE_POOL":
          console.log(action.payload)
          return {
            ...state,
            stablePoolInfo: action.payload
        };
        case "SET_STABLE_NAME":
          return {
            ...state,
            stablePoolName: action.payload
        };
      default:
        return state;
    }
  };
  
  export default rootReducer;
  