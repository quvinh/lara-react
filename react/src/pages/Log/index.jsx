import React, { useEffect, useRef, useState } from 'react';
import { SearchOutlined, EyeOutlined, DeleteOutlined, FileExcelOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Input, Space, Table, Popconfirm, message, Pagination, Dropdown, Form, Select, DatePicker, ConfigProvider, FloatButton, Modal, Tag } from 'antd';
import Highlighter from 'react-highlight-words';
import axiosClient from '../../axios-client';
import { Link } from 'react-router-dom';
import { Excel } from 'antd-table-saveas-excel';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import locale from 'antd/locale/vi_VN';
import { useStateContext } from '../../context/ContextProvider';
export const index = () => {
    const [logs, setLogs] = useState([]);
    const [models, setModels] = useState([]);
    const [logsSelect, setLogsSelect] = useState([]);

    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const [loading, setLoading] = useState(false);
    const searchInput = useRef(null);

    const [pageTotal, setPageTotal] = useState(0);
    const [modalOpen, setModalOpen] = useState(false);
    const [showLog, setShowLog] = useState({
        id: null,
        created_at: '',
        slug: '',
        model: '',
        user_id: null,
        username: '',
        detail: ''
    });

    const [fSortId, setFSortId] = useState('-id');
    const [fSlug, setFSlug] = useState('');
    const [fModel, setFModel] = useState('');
    const [fUsername, setFUsername] = useState(null);
    const [fDateStart, setFDateStart] = useState(dayjs().format('YYYY-MM-DD'));
    const [fDateEnd, setFDateEnd] = useState(dayjs().add(1, 'day').format('YYYY-MM-DD'));

    // export excel
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const onSelectChange = (newSelectedRowKeys, records) => {
        setSelectedRowKeys(newSelectedRowKeys);
        setLogsSelect(records);
    };
    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange
    };
    const hasSelected = selectedRowKeys.length > 0;

    useEffect(() => {
        getLogs();
    }, []);

    const getLogs = () => {
        let uri = `/logs`;

        uri += fSortId ? `?sort=${fSortId}` : `?sort=-id`;
        uri += fSlug ? `&filter[slug]=${fName}` : ``;
        uri += fModel ? `&filter[model]=${fModel}` : ``;
        uri += fUsername ? `&filter[username]=${fUsername}` : ``;
        uri += fDateStart ? `&filter[date_start]=${fDateStart}` : ``;
        uri += fDateEnd ? `&filter[date_end]=${fDateEnd}` : ``;

        setLoading(true);
        axiosClient.get(uri)
            .then(({ data }) => {
                const listModels = [];
                setLogs(data.logs);
                data.models.map(key => {
                    listModels.push({
                        value: key,
                        label: key
                    })
                })
                setModels([...listModels]);
                setPageTotal(data.logs.length);
                setLoading(false);
            })
            .catch(err => {
                setLoading(false);
                console.log('Error 500');
            })
    }

    const confirmDelete = (u) => {
        axiosClient.delete(`/logs/${u.id}`)
            .then(() => {
                message.success('Log was successfully deleted');
                getLogs();
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

    const openModal = (logs) => {
        setShowLog({ ...logs })
        setModalOpen(true)
    }

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
            title: 'Slug',
            dataIndex: 'slug',
            key: 'slug',
            width: '10%',
            ...getColumnSearchProps('slug'),
            fixed: 'left'
        },
        {
            title: 'Model',
            dataIndex: 'model',
            key: 'model',
            width: '10%',
            ...getColumnSearchProps('model'),
            fixed: 'left'
        },
        {
            title: 'ID User',
            dataIndex: 'user_id',
            key: 'user_id',
            width: 100,
            ...getColumnSearchProps('user_id')
        },
        {
            title: 'Username',
            dataIndex: 'username',
            key: 'username',
            width: 100,
            ...getColumnSearchProps('username')
        },
        {
            title: 'Detail',
            dataIndex: 'detail',
            key: 'detail',
            ...getColumnSearchProps('detail'),
        },
        {
            title: 'Create Date',
            dataIndex: 'created_at',
            width: 150,
            key: 'created_at',
            fixed: 'right',
            sorter: (a, b) => dayjs(a.created_at).isBefore(dayjs(b.created_at)),
            ...getColumnSearchProps('created_at'),
            render: (text, logs) => (
                <>
                    <div className="text-muted">{dayjs(text).format('DD-MM-YYYY HH:mm')}</div>
                </>
            )
        },
        {
            title: 'Action',
            key: 'operation',
            fixed: 'right',
            width: 150,
            render: (logs) => (
                <>
                    <Button type="text" className="text-primary" onClick={ev => openModal(logs)}><EyeOutlined /></Button>
                    <Popconfirm
                        title="Confirm"
                        description="Are you sure, you want to delete this log?"
                        onConfirm={ev => confirmDelete(logs)}
                    >
                        <Button type="text" className="text-danger"><DeleteOutlined /></Button>
                    </Popconfirm>
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
            title: 'SLUG',
            dataIndex: 'slug'
        },
        {
            title: 'MODEL',
            dataIndex: 'model'
        },
        {
            title: 'USER ID',
            dataIndex: 'user_id'
        },
        {
            title: 'USERNAME',
            dataIndex: 'username'
        },
        {
            title: 'DETAIL',
            dataIndex: 'detail'
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
        exportExcel('Data', columnsExcel, logs, 'Log');
    };
    const handleMenuClick = (ev) => {
        switch (ev.key) {
            case 'all':
                exportExcel('Data', columnsExcel, logs, 'Log');
                break;
            case 'selected':
                if (logsSelect.length > 0) {
                    exportExcel('Data', columnsExcel, logsSelect, 'Log');
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
        getLogs();
    }

    return (
        <>
            <div className="row mb-2">
                <div className="col-md-2">
                    <label>Sort</label>
                    <Select
                        className='w-100'
                        defaultValue={fSortId}
                        options={[
                            { value: '-id', label: 'ID DESC' },
                            { value: 'id', label: 'ID ASC' }
                        ]}
                        onChange={ev => setFSortId(ev)}
                    />
                </div>
                <div className="col-md-2">
                    <label>Slug</label>
                    <Select
                        className='w-100'
                        defaultValue={fSlug}
                        options={[
                            { value: '', label: '_all_' },
                            { value: 'login', label: 'login' },
                            { value: 'create', label: 'create' },
                            { value: 'update', label: 'update' },
                            { value: 'delete', label: 'delete' },
                            { value: 'destroy', label: 'destroy' },
                            { value: 'confirm', label: 'confirm' }
                        ]}
                        onChange={ev => setFSlug(ev)}
                    />
                </div>
                <div className="col-md-2">
                    <label>Model</label>
                    <Select
                        className='w-100'
                        defaultValue={fSlug}
                        options={[
                            { value: '', label: '_all_' },
                            ...models
                        ]}
                        onChange={ev => setFModel(ev)}
                    />
                </div>
                <div className="col-md-2">
                    <label>Username</label>
                    <Input type='text' className='w-100' placeholder="Username" value={fUsername} onChange={ev => setFUsername(ev.target.value)} />
                </div>
                <div className="col-md-2">
                    <label>Date start</label>
                    <ConfigProvider locale={locale}>
                        <DatePicker className='w-100' format={'DD-MM-YYYY'} defaultValue={dayjs(fDateStart, 'YYYY-MM-DD')} onChange={(date, dateString) => { setFDateStart(dateString) }} />
                    </ConfigProvider>
                </div>
                <div className="col-md-2">
                    <label>Date end</label>
                    <ConfigProvider locale={locale}>
                        <DatePicker className='w-100' format={'DD-MM-YYYY'} defaultValue={dayjs(fDateEnd, 'YYYY-MM-DD')} onChange={(date, dateString) => { setFDateEnd(dateString) }} />
                    </ConfigProvider>
                </div>
            </div>
            <div className="row mb-1">
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
                <div className="col-md-2">
                    <Button className='w-100 text-white bg-secondary' type="default" onClick={onFilter}><SearchOutlined /> Filter</Button>
                </div>
            </div>
            <Table
                loading={loading}
                rowSelection={rowSelection}
                columns={columns}
                dataSource={logs}
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

            <Modal
                title={`ID:${showLog.id} | ${dayjs(showLog.created_at).format('DD-MM-YYYY HH:mm:ss')}`}
                centered
                open={modalOpen}
                onOk={() => setModalOpen(false)}
                onCancel={() => setModalOpen(false)}
                okButtonProps={{ style: { display: 'none' } }}
                cancelButtonProps={{ style: { display: 'none' } }}
            >
                <p><Tag color="default">{showLog.slug}</Tag></p>
                <p>Model: <u>{showLog.model}</u></p>
                <p>ID User: {showLog.user_id}</p>
                <p>Username: {showLog.username}</p>
                <p>Detail: {showLog.detail}</p>
            </Modal>
        </>

    )
}
