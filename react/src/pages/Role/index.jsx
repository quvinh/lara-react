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
    Checkbox,
    Divider,
} from "antd";
import Highlighter from "react-highlight-words";
import axiosClient from "../../axios-client";
import { Link, useNavigate } from "react-router-dom";
import { Excel } from "antd-table-saveas-excel";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import locale from "antd/locale/vi_VN";
import { useStateContext } from "../../context/ContextProvider";
import { useForm } from "antd/es/form/Form";
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
    const [roleSelected, setRoleSelected] = useState({
        id: null,
        name: "",
        permissions: [],
    });
    const [storeForm] = useForm();
    const [updateForm] = useForm();

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
                    <Button type="text" onClick={(ev) => editModal(roles.id)}>
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
                        onClick={(ev) => console.log(roles.id)}
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
    const [openAdd, setAddOpen] = useState(false);
    const [openEdit, setEditOpen] = useState(false);
    const addModal = () => {
        setAddOpen(true);
    };
    const editModal = (id) => {
        axiosClient
            .get(`/roles/${id}`)
            .then(({ data }) => {
                console.log(data);
                const role = data.data;
                updateForm.setFieldsValue({
                    name: role.name,
                });
                setRoleSelected({
                    name: role.name,
                });
                setEditOpen(true);
            })
            .catch((err) => {
                console.log(err);
                message.error("error");
            });
    };
    // const handleOk = () => {
    //     setLoading(true);
    //     setTimeout(() => {
    //         setLoading(false);
    //         setAddOpen(false);
    //     }, 3000);
    // };
    const handleCancelAdd = () => {
        setAddOpen(false);
    };
    const handleCancelEdit = () => {
        setEditOpen(false);
    };

    const addForm = (values) => {
        console.log(values);
        setLoading(true);
        axiosClient
            .post("/roles", values)
            .then(() => {
                message.success("Role was successfully created");
                getRoles();
                storeForm.setFieldsValue({ name: "" });
                handleCancelAdd();
            })
            .catch((err) => {
                setLoading(false);
                if (err.response.status == 422) {
                    message.error(err.response.data.name[0]);
                }
            });
    };

    const editForm = (values) => {
        console.log(values);
    };

    const CheckboxGroup = Checkbox.Group;
    const plainOptions = ["Apple", "Pear", "Orange"];
    const defaultCheckedList = ["Apple", "Orange"];
    const [checkedList, setCheckedList] = useState(defaultCheckedList);
    const [indeterminate, setIndeterminate] = useState(true);
    const [checkAll, setCheckAll] = useState(false);
    const onChange = (list) => {
        setCheckedList(list);
        setIndeterminate(!!list.length && list.length < plainOptions.length);
        setCheckAll(list.length === plainOptions.length);
    };
    const onCheckAllChange = (e) => {
        setCheckedList(e.target.checked ? plainOptions : []);
        setIndeterminate(false);
        setCheckAll(e.target.checked);
    };

    return (
        <>
            <div className="row mb-1">
                <div className="col-md-2">
                    <Button className="w-100" type="primary" onClick={addModal}>
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
                forceRender
                open={openAdd}
                title="Add Role"
                onCancel={handleCancelAdd}
                okButtonProps={{ style: { display: "none" } }}
                cancelButtonProps={{ style: { display: "none" } }}
            >
                <Form form={storeForm} onFinish={addForm}>
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
                            onChange={(ev) => console.log(ev.target.value)}
                        />
                    </Form.Item>
                    <Divider />
                    {/* <Form.Item valuePropName="checked">
                        <Checkbox
                            indeterminate={indeterminate}
                            onChange={onCheckAllChange}
                            checked={checkAll}
                        >
                            Check all
                        </Checkbox>
                    </Form.Item> */}
                    <Form.Item name="remember" valuePropName="checked" noStyle>
                        <Checkbox>Remember me</Checkbox>
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

            <Modal
                forceRender
                open={openEdit}
                width={900}
                title={`Edit Role: ${roleSelected.name}`}
                onCancel={handleCancelEdit}
                okButtonProps={{ style: { display: "none" } }}
                cancelButtonProps={{ style: { display: "none" } }}
            >
                <Form form={updateForm} onFinish={editForm}>
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
                                setRoleSelected({
                                    ...roleSelected,
                                    name: ev.target.value,
                                })
                            }
                        />
                    </Form.Item>
                    <Form.Item className="d-flex justify-content-end">
                        <Button
                            className="me-1"
                            type="primary"
                            htmlType="submit"
                        >
                            Update
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
            <FloatButton.BackTop />
        </>
    );
};
