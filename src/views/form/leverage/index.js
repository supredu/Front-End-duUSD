import React from 'react'
import './index.less'
import { Form,Input,Button,Alert,Space } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';

export default class Leverage extends React.Component{
     onFinish = (values) => {
        console.log('Received values of form: ', values);
      };
    render(){
        return (
            <Form name="complex-form"
            className='leverage-container'
            onFinish={this.onFinish}
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            style={{ maxWidth: 600 }}>

                <Form.Item className='form-item'>
                    <span className='title'>ETH Avail.</span>
                    <Input className='value_input'/>
                </Form.Item>

                <Form.Item  className='form-item'>
                    <span className='title'>crvUSD borrow amount</span>
                    <Input className='value_input'/>
                </Form.Item>
                <Form.Item className='form-item'>
                    <div className='rate'>
                        <span className='rate_1'>Borrow rate: </span>
                        <span className='rate_2'>27.07%-&gt;27.09%</span>
                    </div>
                   
                </Form.Item>

                <Form.Item className='form-item'>
                    <Alert
                        description="You can leverage your collateral up to 9x. This has the effect of repeat trading crvUSD to collateral and depositing to maximize your collateral position. Essentially, all borrowed crvUSD is utilized to purchase more collateral. Be careful, if the collateral price dips, you would need to repay the entire amount to reclaim your initial position."
                        type="info"
                        showIcon
                        icon={<ExclamationCircleOutlined />}
                        className="customAlert"
                        />
                </Form.Item>

                <Form.Item className='form-item'>
                    <Button type='primary' className='submit-btn'>Connect Wallet</Button>

                </Form.Item>
                
            </Form>
        );
    }
}