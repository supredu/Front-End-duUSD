
export const setName = (name) => ({
    type: 'SET_NAME',
    payload: name
  });
  

export const setTopHeader = (obj) => ({
    type: 'SET_TOP_Header',
    payload: obj
});


export const setAddress = (address) => ({
    type: 'SET_Address',
    payload: address
});


export const setPoolName = (name)=>({
    type: 'SET_POOL_NAME',
    payload: name
})


export const setPoolInfo = (obj)=>({
    type: 'SET_POOL_INFO',
    payload: obj
})

export const setStablePoolName = (name)=>({
    type: "SET_STABLE_NAME",
    payload: name
})

export const setStablePoolInfo = (obj)=>({
    type: 'SET_STABLE_POOL',
    payload: obj
})
