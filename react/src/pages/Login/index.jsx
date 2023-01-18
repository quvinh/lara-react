import React, { createRef, useState } from 'react'
import { Card, Button, Checkbox, Form, Input, Alert, message } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { useStateContext } from '../../context/ContextProvider';
import axiosClient from '../../axios-client';
import { message as messageAnt } from 'antd'
export const index = () => {
    const [loadings, setLoadings] = useState([]);
    const [errors, setErrors] = useState(null);
    const { setUser, setToken } = useStateContext();

    const enterLoading = (index) => {
        setLoadings((prevLoadings) => {
          const newLoadings = [...prevLoadings];
          newLoadings[index] = true;
          return newLoadings;
        });
        setTimeout(() => {
          setLoadings((prevLoadings) => {
            const newLoadings = [...prevLoadings];
            newLoadings[index] = false;
            return newLoadings;
          });
        }, 9000);
      };

    const onFinish = (values) => {
        const payload = {
            username: values.username,
            password: values.password
        }
        setErrors(null);
        axiosClient.post('/login', payload)
            .then(({ data }) => {
                setUser(data.user);
                setToken(data.token);
                messageAnt.info('Logged in successfully');
            })
            .catch(err => {
                const response = err.response;
                if (response && response.status == 422) {
                    if (response.data.message) {
                        setErrors({
                            message: [response.data.message]
                        })
                    } else {
                        setErrors(response.data);
                    }
                }
            })
    };

    return (
        <Card
            bordered={true}
            style={{
                width: 600,
            }}
        >
            <Form
                name="normal_login"
                className="login-form"
                initialValues={{ remember: true }}
                onFinish={onFinish}
            >
                <div className="text-center fs-3 mb-4 text-secondary"><b>LOGIN</b></div>

                {errors && <div className='mb-2'>
                    {Object.keys(errors).map(key => (
                        <Alert key={key} message={errors[key][0]} type="warning" />
                    ))}
                </div>}
                <Form.Item
                    hasFeedback
                    name="username"
                    rules={[{ required: true, message: 'Please input your Username!', max: 55 }]}
                >
                    <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
                </Form.Item>
                <Form.Item
                    hasFeedback
                    name="password"
                    rules={[{ required: true, message: 'Please input your Password!', min: 8 }]}
                >
                    <Input.Password
                        prefix={<LockOutlined className="site-form-item-icon" />}
                        type="password"
                        placeholder="Password"
                    />
                </Form.Item>
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <Form.Item name="remember" valuePropName="checked" noStyle>
                        <Checkbox>Remember me</Checkbox>
                    </Form.Item>

                    <a className="login-form-forgot" href="">
                        Forgot password
                    </a>
                </div>

                <div className="d-flex flex-column mb-1">
                    <Button type="primary" htmlType="submit" className="login-form-button" loading={loadings[0]} onClick={() => enterLoading(0)}>
                        Log in
                    </Button>
                    {/* <p className="text-center">Or <a href="/signup">register now!</a></p> */}
                </div>
            </Form>
        </Card>
    )
}
