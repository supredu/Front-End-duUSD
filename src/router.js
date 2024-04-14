import React from 'react';
import { HashRouter, Route, Switch} from 'react-router-dom';
import App from './App';
import Content from './views/Content';
import Home from './views/home';
import Market from './views/market';
import Pool from './views/pool';
import Mchart from './views/mchart';
import StablePool from './views/stable';
import Pchart from './views/pchart';
import Poolchart from './views/pchart2';
import Test from './views/test'



export default class ERouter extends React.Component{

    render(){
        return (
            <HashRouter>
                <App>
                    <Switch> 
                        <Route path="/" render={()=>
                            <Content>
                                <Switch>
                                    <Route path='/market' component={Market} />
                                    <Route path='/pool' component={Pool}/>
                                    <Route path='/mchart' component={Mchart}/>
                                    <Route path="/stable-pool" component={StablePool}/>
                                    <Route path='/pchart' component={Pchart}/>
                                    <Route path='/pool-chart' component={Poolchart}/>
                                    <Route path='/test' component={Test}/>
                                </Switch>

                            </Content>         
                        } />
                    </Switch>
                </App>
            </HashRouter>
        );
    }
}