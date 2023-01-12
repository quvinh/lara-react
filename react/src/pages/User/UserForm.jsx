import React, { createRef, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { Button, Form, Input, message, Alert, Spin, Upload, Row, Col } from 'antd';
import axiosClient from '../../axios-client';
import { useForm } from 'antd/es/form/Form';
import { PlusOutlined } from '@ant-design/icons';

export const UserForm = () => {
    const navigate = useNavigate();
    // const formRef = createRef();
    const [form] = useForm();
    const { id } = useParams();
    const [errors, setErrors] = useState(null);
    const [loading, setLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState();
    const [user, setUser] = useState({
        id: null,
        name: '',
        address: '',
        mobile: '',
        email: '',
        username: '',
        password: '',
        password_confirmation: '',
        // image: null
    })

    if (id) {
        const initial = {
            name: 'example',
            email: 'example@gmail.com',
        }
        useEffect(() => {
            setLoading(true);

            axiosClient.get(`/users/${id}`)
                .then(({ data }) => {
                    setLoading(false);
                    setUser(data.data)
                    initial.name = data.data.name;
                    initial.email = data.data.email;
                    initial.username = data.data.username;
                    initial.address = data.data.address;
                    initial.mobile = data.data.mobile;
                    form.setFieldsValue(initial)
                })
                .catch(() => {
                    setLoading(false);
                })
        }, [])
    }

    const layout = {
        labelCol: {
            span: 8,
        },
        wrapperCol: {
            span: 16,
        },
    };
    const tailLayout = {
        wrapperCol: {
            offset: 8,
            span: 16,
        },
    };

    const onFinish = (values) => {
        setLoading(true);
        if (user.id) {
            axiosClient.put(`/users/${user.id}`, user)
                .then((response) => {
                    setLoading(false)
                    navigate('/users');
                })
                .catch(err => {
                    const response = err.response;
                    if (response && response.status == 422) {
                        setErrors(response.data);
                    }
                    setLoading(false)
                })
        } else {
            axiosClient.post(`/users`, values)
                .then(() => {
                    message.success('User was successfully created');
                    setLoading(false);
                    navigate('/users');
                })
                .catch(err => {
                    const response = err.response;
                    if (response && response.status == 422) {
                        setErrors(response.data);
                    }
                    setLoading(false)
                })
        }
    };
    const onReset = () => {
        // formRef.current.resetFields();
        form.resetFields();
    };

    // const getBase64 = (img, callback) => {
    //     const reader = new FileReader();
    //     reader.addEventListener('load', () => callback(reader.result));
    //     reader.readAsDataURL(img);
    // };

    // const beforeUpload = (file) => {
    //     const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    //     if (!isJpgOrPng) {
    //         message.error('You can only upload JPG/PNG file!');
    //     }
    //     const isLt2M = file.size / 1024 / 1024 < 2;
    //     if (!isLt2M) {
    //         message.error('Image must smaller than 2MB!');
    //     }
    //     return isJpgOrPng && isLt2M;
    // };

    // const handleChangeImage = (info) => {
    //     getBase64(info.file.originFileObj, (url) => {
    //         setImageUrl(url);
    //     });
    //     console.log(info.fileList[0].originFileObj)
    //     setUser({ ...user, image: info.fileList[0].originFileObj })
    // };

    return (
        <>
            <Spin spinning={loading} tip="Đợi tý" size="small" >
                {user.id && <h1>Update user: {user.name}</h1>}
                {!user.id && <h1>New user</h1>}
                {errors && <div className="text-center">
                    {Object.keys(errors).map(key => (
                        <Alert className="mb-2" key={key} message={errors[key][0]} type="warning" closable />
                    ))}
                </div>}

                <Form {...layout} form={form} name="control-ref" onFinish={onFinish} >
                    <Form.Item
                        hasFeedback
                        name="name"
                        label="Name"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your Name!'
                            },
                        ]}
                    >
                        <Input placeholder="..." onChange={ev => setUser({ ...user, name: ev.target.value })} />
                    </Form.Item>
                    <Form.Item
                        hasFeedback
                        name="email"
                        label="Email"
                        rules={[
                            {
                                type: "email",
                                required: true,
                                message: 'Please input your Email!'
                            },
                        ]}
                    >
                        <Input placeholder="..." onChange={ev => setUser({ ...user, email: ev.target.value })} />
                    </Form.Item>
                    <Form.Item
                        hasFeedback
                        name="username"
                        label="Username"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your Username!'
                            },
                        ]}
                    >
                        <Input placeholder="..." onChange={ev => setUser({ ...user, username: ev.target.value })} />
                    </Form.Item>
                    <Form.Item
                        hasFeedback
                        name="address"
                        label="Address"
                    >
                        <Input placeholder="..." onChange={ev => setUser({ ...user, address: ev.target.value })} />
                    </Form.Item>
                    <Form.Item
                        hasFeedback
                        name="mobile"
                        label="Mobile"
                        rules={[
                            {
                                pattern: new RegExp(/^[0-9]+$/),
                                message: 'Mobile has to be a number!'
                            },
                        ]}
                    >
                        <Input placeholder="..." maxLength={12} onChange={ev => setUser({ ...user, mobile: ev.target.value })} />
                    </Form.Item>
                    <Form.Item
                        hasFeedback
                        name="password"
                        label="Password"
                        rules={[
                            {
                                required: user.id ? false : true,
                                min: 8,
                                message: 'Please input your Password!'
                            },
                        ]}
                    >
                        <Input.Password type="password" placeholder="..." onChange={ev => setUser({ ...user, password: ev.target.value })} />
                    </Form.Item>

                    <Form.Item
                        hasFeedback
                        name="password_confirmation"
                        label="Confirm Password"
                        dependencies={['password']}
                        rules={[
                            {
                                required: user.id ? false : true,
                                min: 8,
                                message: 'Please confirm your Password!'
                            },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('password') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('The two passwords that you entered do not match!'))
                                }
                            })
                        ]}
                    >
                        <Input.Password type="password" placeholder="..." onChange={ev => setUser({ ...user, password_confirmation: ev.target.value })} />
                    </Form.Item>
                    <Form.Item {...tailLayout}>
                        <Button className="me-1" type="primary" htmlType="submit">
                            Submit
                        </Button>
                        <Button htmlType="button" onClick={onReset}>
                            Reset
                        </Button>
                    </Form.Item>
                </Form>
            </Spin>
        </>
    )
}
