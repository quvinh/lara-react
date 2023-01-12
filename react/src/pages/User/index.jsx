import React, { useEffect, useRef, useState } from 'react';
import { SearchOutlined, EditOutlined, DeleteOutlined, FileExcelOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Input, Space, Table, Popconfirm, message, Pagination, Dropdown, Form, Select, DatePicker, ConfigProvider, FloatButton } from 'antd';
import Highlighter from 'react-highlight-words';
import axiosClient from '../../axios-client';
import { Link } from 'react-router-dom';
import { Excel } from 'antd-table-saveas-excel';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import locale from 'antd/locale/vi_VN';
import { useStateContext } from '../../context/ContextProvider';
export const index = () => {
    const { user } = useStateContext();
    const [users, setUsers] = useState([]);
    const [usersSelect, setUsersSelect] = useState([]);

    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const [loading, setLoading] = useState(false);
    const searchInput = useRef(null);

    const [pageTotal, setPageTotal] = useState(0);

    // export excel
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const onSelectChange = (newSelectedRowKeys, records) => {
        setSelectedRowKeys(newSelectedRowKeys);
        setUsersSelect(records);
    };
    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
        onSelectAll: (ev) => console.log(ev)
    };
    const hasSelected = selectedRowKeys.length > 0;

    useEffect(() => {
        getUsers();
    }, []);

    const getUsers = () => {
        setLoading(true);
        axiosClient.get('/users')//?page=${page}
            .then(({ data }) => {
                setUsers(data.data);
                setPageTotal(data.data.length);
                setLoading(false);
            })
            .catch(err => {
                setLoading(false);
                console.log('Error 500');
            })
    }

    const confirmDelete = (u) => {
        axiosClient.delete(`/users/${u.id}`)
            .then(() => {
                message.success('User was successfully deleted');
                getUsers();
            })
    }

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };
    const handleReset = (clearFilters) => {
        clearFilters();
        setSearchText('');
    };
    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
            <div
                style={{
                    padding: 8,
                }}
                onKeyDown={(e) => e.stopPropagation()}
            >
                <Input
                    ref={searchInput}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{
                        marginBottom: 8,
                        display: 'block',
                    }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Search
                    </Button>
                    <Button
                        onClick={() => clearFilters && handleReset(clearFilters)}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Reset
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            confirm({
                                closeDropdown: false,
                            });
                            setSearchText(selectedKeys[0]);
                            setSearchedColumn(dataIndex);
                        }}
                    >
                        Filter
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            close();
                        }}
                    >
                        close
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered) => (
            <SearchOutlined
                style={{
                    color: filtered ? '#1890ff' : undefined,
                }}
            />
        ),
        onFilter: (value, record) =>
            record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
        onFilterDropdownOpenChange: (visible) => {
            if (visible) {
                setTimeout(() => searchInput.current?.select(), 100);
            }
        },
        render: (text) =>
            searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{
                        backgroundColor: '#ffc069',
                        padding: 0,
                    }}
                    searchWords={[searchText]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ''}
                />
            ) : (
                text
            ),
    });

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            width: '5%',
            sorter: (a, b) => a.id - b.id,
            sortDirections: ['descend', 'ascend'],
            ...getColumnSearchProps('id'),
            fixed: 'left'
        },
        {
            title: 'Username',
            dataIndex: 'username',
            key: 'username',
            width: '10%',
            ...getColumnSearchProps('username'),
            fixed: 'left',
            render: (text, users) => (
                <>
                    <Link to={`/users/${users.id}`}>{text}</Link>
                </>
            )
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            width: '15%',
            ...getColumnSearchProps('name')
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            ...getColumnSearchProps('email'),
        },
        {
            title: 'Mobile',
            dataIndex: 'mobile',
            key: 'mobile',
            ...getColumnSearchProps('mobile'),
        },
        {
            title: 'Address',
            dataIndex: 'address',
            key: 'address',
            ...getColumnSearchProps('address'),
        },
        {
            title: 'Create Date',
            dataIndex: 'created_at',
            key: 'created_at',
            sorter: (a, b) => dayjs(a.created_at).isBefore(dayjs(b.created_at)),
            ...getColumnSearchProps('created_at'),
            render: (text, users) => (
                <>
                    <div className="text-muted">{dayjs(text).format('DD-MM-YYYY hh:mm')}</div>
                </>
            )
        },
        {
            title: 'Action',
            key: 'operation',
            fixed: 'right',
            width: 150,
            render: (users) => (
                <>
                    <Link to={`/users/${users.id}`} className="me-1"><Button type="text" className="text-warning"><EditOutlined /></Button></Link>
                    {user.id === users.id ? (
                        <Button type="text" disabled ><DeleteOutlined /></Button>
                    ) : (
                        <Popconfirm
                            title="Confirm"
                            description="Are you sure, you want to delete this user?"
                            onConfirm={ev => confirmDelete(users)}
                        >
                            <Button type="text"  className="text-danger"><DeleteOutlined /></Button>
                        </Popconfirm>
                    )}
                </>
            )
        }
    ];

    const columnsExcel = [
        {
            title: 'ID',
            dataIndex: 'id'
        },
        {
            title: 'NAME',
            dataIndex: 'name'
        },
        {
            title: 'EMAIL',
            dataIndex: 'email'
        },
        {
            title: 'CREATED AT',
            dataIndex: 'created_at'
        },
    ]

    const exportExcel = (sheet, columns, data, file) => {
        const excel = new Excel();
        excel.addSheet(sheet)
            .addColumns(columns)
            .addDataSource(data)
            .saveAs(`${file}.xlsx`);
    }

    const handleButtonClick = (ev) => {
        exportExcel('Data', columnsExcel, users, 'User');
    };
    const handleMenuClick = (ev) => {
        switch (ev.key) {
            case 'all':
                exportExcel('Data', columnsExcel, users, 'User');
                break;
            case 'selected':
                if (usersSelect.length > 0) {
                    exportExcel('Data', columnsExcel, usersSelect, 'User');
                } else {
                    message.warning('Please select at least 1 item');
                }
                break;
            default:
                break;
        }
    };

    const items = [
        {
            label: 'Export Excel',
            key: 'all',
            icon: <FileExcelOutlined />,
        },
        {
            label: 'Export Row Selectd',
            key: 'selected',
            icon: <FileExcelOutlined />,
        },
    ];
    const menuProps = {
        items,
        onClick: handleMenuClick,
    };

    const onFilter = () => {
        getUsers();
    }

    return (
        <>
            <div className="row mb-1">
                <div className="col-md-2">
                    <Link to={'/users/new'} className="text-white"><Button className='w-100' type="primary"><PlusOutlined /> Add User</Button></Link>
                </div>
                <div className="col-md-10 d-flex justify-content-start align-items-center">
                    <div className="me-5">
                        <Dropdown.Button menu={menuProps} onClick={handleButtonClick}>
                            <span className="text-success"><FileExcelOutlined /> Export Excel</span>
                        </Dropdown.Button>
                    </div>
                    <div>
                        {hasSelected ? `* Selected ${selectedRowKeys.length} items` : ''}
                    </div>
                </div>
            </div>
            <Table
                loading={loading}
                rowSelection={rowSelection}
                columns={columns}
                dataSource={users}
                rowKey="id"
                scroll={{
                    x: 1500,
                    y: 500,
                }}
                pagination={{
                    total: pageTotal,
                    showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
                    defaultPageSize: 20,
                    position: ['topRight', 'bottomRight'],
                    pageSizeOptions: [10, 20, 50, 100, 500]
                }} />
        </>

    )
}
