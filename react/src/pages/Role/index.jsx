import React, { useEffect, useRef, useState } from "react";
import {
    SearchOutlined,
    EditOutlined,
    DeleteOutlined,
    FileExcelOutlined,
    PlusOutlined,
} from "@ant-design/icons";
import {
    Button,
    Input,
    Space,
    Table,
    Popconfirm,
    message,
    Pagination,
    Dropdown,
    Form,
    Select,
    DatePicker,
    ConfigProvider,
    FloatButton,
    Tag,
    Modal,
} from "antd";
import Highlighter from "react-highlight-words";
import axiosClient from "../../axios-client";
import { Link, useNavigate } from "react-router-dom";
import { Excel } from "antd-table-saveas-excel";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import locale from "antd/locale/vi_VN";
import { useStateContext } from "../../context/ContextProvider";
export const index = () => {
    const [roles, setRoles] = useState([]);

    const [searchText, setSearchText] = useState("");
    const [searchedColumn, setSearchedColumn] = useState("");
    const [loading, setLoading] = useState(false);
    const searchInput = useRef(null);

    const navigate = useNavigate();

    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const onSelectChange = (newSelectedRowKeys, records) => {
        setSelectedRowKeys(newSelectedRowKeys);
    };
    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
        onSelectAll: (ev) => console.log(ev),
    };
    const hasSelected = selectedRowKeys.length > 0;

    useEffect(() => {
        getRoles();
    }, []);

    const getRoles = () => {
        setLoading(true);
        axiosClient
            .get("/roles")
            .then(({ data }) => {
                setRoles(data.data);
                setLoading(false);
            })
            .catch((err) => {
                setLoading(false);
                if (err.response.status == 403) {
                    navigate("/not-authorized");
                }
            });
    };

    const confirmDelete = (u) => {
        axiosClient.delete(`/roles/${u.id}`).then(() => {
            message.success("Role was successfully deleted");
            getRoles();
        });
    };

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };
    const handleReset = (clearFilters) => {
        clearFilters();
        setSearchText("");
    };
    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({
            setSelectedKeys,
            selectedKeys,
            confirm,
            clearFilters,
            close,
        }) => (
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
                    onChange={(e) =>
                        setSelectedKeys(e.target.value ? [e.target.value] : [])
                    }
                    onPressEnter={() =>
                        handleSearch(selectedKeys, confirm, dataIndex)
                    }
                    style={{
                        marginBottom: 8,
                        display: "block",
                    }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() =>
                            handleSearch(selectedKeys, confirm, dataIndex)
                        }
                        icon={<SearchOutlined />}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Search
                    </Button>
                    <Button
                        onClick={() =>
                            clearFilters && handleReset(clearFilters)
                        }
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
                    color: filtered ? "#1890ff" : undefined,
                }}
            />
        ),
        onFilter: (value, record) =>
            record[dataIndex]
                .toString()
                .toLowerCase()
                .includes(value.toLowerCase()),
        onFilterDropdownOpenChange: (visible) => {
            if (visible) {
                setTimeout(() => searchInput.current?.select(), 100);
            }
        },
        render: (text) =>
            searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{
                        backgroundColor: "#ffc069",
                        padding: 0,
                    }}
                    searchWords={[searchText]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ""}
                />
            ) : (
                text
            ),
    });

    const columns = [
        {
            title: "ID",
            dataIndex: "id",
            key: "id",
            width: "5%",
            sorter: (a, b) => a.id - b.id,
            sortDirections: ["descend", "ascend"],
            ...getColumnSearchProps("id"),
            fixed: "left",
        },
        {
            title: "Role",
            dataIndex: "name",
            key: "name",
            width: "30%",
            ...getColumnSearchProps("name"),
            // fixed: "left",
            render: (text, roles) => (
                <>
                    <Button type="text" onClick={(ev) => showModal(roles.id)}>
                        <div className="text-primary">{text}</div>
                    </Button>
                </>
            ),
        },
        {
            title: "Guard",
            dataIndex: "guard_name",
            key: "guard_name",
            width: "20%",
        },
        {
            title: "Create Date",
            dataIndex: "created_at",
            key: "created_at",
            width: "35%",
            sorter: (a, b) => dayjs(a.created_at).isBefore(dayjs(b.created_at)),
            ...getColumnSearchProps("created_at"),
            render: (text, roles) => (
                <>
                    <div className="text-muted">
                        {dayjs(text).format("DD-MM-YYYY hh:mm")}
                    </div>
                </>
            ),
        },
        {
            title: "Action",
            key: "operation",
            fixed: "right",
            width: "10%",
            render: (roles) => (
                <>
                    <Button
                        type="text"
                        className="text-warning"
                        onClick={(ev) => showModal(roles.id)}
                    >
                        <EditOutlined />
                    </Button>
                    <Popconfirm
                        title="Confirm"
                        description="Are you sure, you want to delete this role?"
                        onConfirm={(ev) => confirmDelete(roles)}
                    >
                        <Button type="text" className="text-danger">
                            <DeleteOutlined />
                        </Button>
                    </Popconfirm>
                </>
            ),
        },
    ];
    const [open, setOpen] = useState(false);
    const showModal = (id) => {
        setOpen(true);
        console.log(id);
    };
    const handleOk = () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setOpen(false);
        }, 3000);
    };
    const handleCancel = () => {
        setOpen(false);
    };

    return (
        <>
            <div className="row mb-1">
                <div className="col-md-2">
                    <Button
                        className="w-100"
                        type="primary"
                        onClick={(ev) => showModal(0)}
                    >
                        <PlusOutlined /> Add Role
                    </Button>
                </div>
                <div className="col-md-10 d-flex justify-content-start align-items-center">
                    <div>
                        {hasSelected
                            ? `* Selected ${selectedRowKeys.length} items`
                            : ""}
                    </div>
                </div>
            </div>
            <Table
                loading={loading}
                rowSelection={rowSelection}
                columns={columns}
                dataSource={roles}
                rowKey="id"
                scroll={{
                    x: 1500,
                    y: 500,
                }}
                pagination={{
                    showTotal: (total, range) =>
                        `${range[0]}-${range[1]} of ${total} items`,
                    defaultPageSize: 20,
                    position: ["topRight", "bottomRight"],
                    pageSizeOptions: [10, 20, 50, 100, 500],
                }}
            />

            <Modal
                open={open}
                title="Title"
                onOk={handleOk}
                onCancel={handleCancel}
                okButtonProps={{ style: { display: 'none' } }}
                cancelButtonProps={{ style: { display: 'none' } }}
            >
                <Form>
                    <Form.Item
                        hasFeedback
                        name="name"
                        label="Name"
                        rules={[
                            {
                                required: true,
                                message: "Please input your Name!",
                            },
                        ]}
                    >
                        <Input
                            placeholder="..."
                            onChange={(ev) =>
                                console.log(ev.target.value)
                            }
                        />
                    </Form.Item>
                    <Form.Item className="d-flex justify-content-end">
                        <Button
                            className="me-1"
                            type="primary"
                            htmlType="submit"
                        >
                            Submit
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
            <FloatButton.BackTop />
        </>
    );
};