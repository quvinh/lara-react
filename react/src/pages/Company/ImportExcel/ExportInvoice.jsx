import {
    CloseCircleOutlined,
    EditOutlined,
    SaveOutlined,
    SearchOutlined,
    UploadOutlined,
} from "@ant-design/icons";
import {
    Button,
    Form,
    Input,
    InputNumber,
    message,
    Popconfirm,
    Space,
    Table,
    Upload,
    Typography,
    AutoComplete,
} from "antd";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import "dayjs/locale/en";
import { useRef, useState } from "react";
import { ExcelRenderer } from "react-excel-renderer";
import Highlighter from "react-highlight-words";
import stringSimilarity from "string-similarity";
import { Excel } from "antd-table-saveas-excel";

export const ExportInvoice = (props) => {
    // props
    const [data, setData] = useState([...props.exportInvoice]);
    const inventory = [...props.inventory];

    const mockVal = (str) => {
        const arr = [];
        inventory
            .filter((item) =>
                item.masanpham.toLowerCase().includes(str.toLowerCase())
            )
            .map((item) => {
                arr.push({
                    value: item.masanpham,
                    label: (
                        <div className="d-flex justify-content-between align-items-center">
                            <div>{item.masanpham}</div>
                            <div className="d-flex justify-content-between align-items-center">
                                <small>
                                    <span className="text-muted">u:</span>
                                    <span className="text-primary">
                                        {item.dvt}
                                    </span>
                                    &nbsp;
                                    <span className="text-muted">avg:</span>
                                    <span className="text-primary">
                                        {item.slg_cuoiky == 0
                                            ? 0
                                            : parseFloat(
                                                  (
                                                      item.thtien_cuoiky /
                                                      item.slg_cuoiky
                                                  ).toFixed(0)
                                              ).toLocaleString("en-US")}
                                    </span>
                                </small>
                            </div>
                        </div>
                    ),
                });
            });
        return arr;
        // console.log(inventory.filter((item) => (item.masanpham.toLowerCase()).includes(str)))
    };

    const EditableCell = ({
        editing,
        dataIndex,
        title,
        inputType,
        record,
        index,
        children,
        ...restProps
    }) => {
        //Autocomplete
        const [value, setValue] = useState("");
        const [options, setOptions] = useState([]);
        const onSearch = (searchText) => {
            setOptions(!searchText ? [] : mockVal(searchText));
        };
        const onSelect = (data) => {
            console.log("onSelect", data);
        };
        const onChange = (data) => {
            setValue(data);
        };
        const inputNode =
            inputType === "number" ? (
                <InputNumber />
            ) : (
                <AutoComplete
                    options={options}
                    onSelect={onSelect}
                    onSearch={onSearch}
                    dropdownMatchSelectWidth={500}
                    filterOption={(inputValue, option) =>
                        option.value
                            .toUpperCase()
                            .indexOf(inputValue.toUpperCase()) !== -1
                    }
                />
            );
        return (
            <td {...restProps}>
                {editing ? (
                    <Form.Item
                        name={dataIndex}
                        style={{
                            margin: 0,
                        }}
                        rules={[
                            {
                                required: true,
                                message: `Please Input ${title}!`,
                            },
                        ]}
                    >
                        {inputNode}
                    </Form.Item>
                ) : (
                    children
                )}
            </td>
        );
    };

    const [searchText, setSearchText] = useState("");
    const [searchedColumn, setSearchedColumn] = useState("");
    const [loading, setLoading] = useState(false);
    const searchInput = useRef(null);
    //
    const [editNo, setEditNo] = useState([]);
    const [form] = Form.useForm();
    const [editingKey, setEditingKey] = useState("");
    const isEditing = (record) => record.key === editingKey;
    const edit = (record) => {
        form.setFieldsValue({
            ...record,
        });
        setEditingKey(record.key);
    };
    const cancel = () => {
        setEditingKey("");
    };
    const save = async (key) => {
        try {
            const row = await form.validateFields();
            const newData = [...data];
            const index = newData.findIndex((item) => key === item.key);
            if (index > -1) {
                const item = newData[index];
                row.filter = row.mavattu;
                newData.splice(index, 1, {
                    ...item,
                    ...row,
                });
                setData(newData);
                props.setExportInvoice(newData);
                setEditingKey("");
                setEditNo([...editNo, item.no]);
            } else {
                newData.push(row);
                setData(newData);
                props.setExportInvoice(newData);
                setEditingKey("");
            }
        } catch (errInfo) {
            console.log("Validate Failed:", errInfo);
        }
    };
    //

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

    const selectCodeProps = (code, name, unit, price) => {
        if (
            inventory.filter(
                (item) =>
                    item.tenhanghoa == name &&
                    item.dvt.toLowerCase() == unit.toLowerCase()
            ).length > 0
        ) {
            const filter = inventory.filter(
                (item) =>
                    item.tenhanghoa == name &&
                    item.dvt.toLowerCase() == unit.toLowerCase()
            );
            let result = "";
            filter.map((value) => {
                const avg =
                    value.slg_cuoiky == 0
                        ? 0
                        : parseFloat(
                              (value.thtien_cuoiky / value.slg_cuoiky).toFixed(
                                  2
                              )
                          );

                if (price > avg) {
                    result = code;
                } else {
                    result = "";
                }
            });
            return result;
        } else return "-1";
    };

    const selectCodeSimilarity = (text) => {
        let result = "";
        try {
            if (text) {
                inventory.map((item, index) => {
                    const similarity = stringSimilarity.compareTwoStrings(
                        text,
                        item.masanpham
                    );
                    if (similarity > 0.6) {
                        result = item.masanpham;
                    }
                });
            }
        } catch (error) {
            console.log("error");
            return result;
        }
        return result;
    };

    const renderFilter = (text, name, code) => {
        if (text === "") {
            const result = selectCodeSimilarity(name);
            if (result === "") {
                return <span className="text-danger">{code}</span>;
            } else {
                return <span className="text-muted">{result}</span>;
            }
        } else if (text === "-1") {
            return <span className="text-danger">{code}</span>;
        } else {
            return <span className="text-primary">{text}</span>;
        }
    };

    /**
     * Ten
     * DVT
     * Don gia: ban hang > ton (trong khoang lai max x10)
     * ok => Lay ma theo file Ton
     */
    const cols = [
        {
            title: "STT",
            dataIndex: "no",
            key: "no",
            width: 60,
            sorter: (a, b) => a.no - b.no,
            sortDirections: ["descend", "ascend"],
            fixed: "left",
            render: (no) => {
                return {
                    props: {
                        style: {
                            background: editNo.includes(no) ? "green" : "white",
                            color: editNo.includes(no) ? "white" : "none",
                        },
                    },
                    children: <>{no}</>,
                };
            },
        },
        {
            title: "Ng??y",
            dataIndex: "ngay",
            key: "ngay",
            width: 100,
        },
        {
            title: "Seri h??a ????n",
            dataIndex: "seri",
            width: 100,
            key: "seri",
        },
        {
            title: "S??? H??a ????n",
            dataIndex: "sohdon",
            width: 100,
            key: "sohdon",
            render: (text, record) => (
                <span className={record.filter == "" ? "" : "text-primary"}>
                    {text}
                </span>
            ),
        },
        {
            title: "Ng??y h??a ????n",
            dataIndex: "ngayhoadon",
            width: 100,
            key: "ngayhoadon",
        },
        {
            title: "??ng/B??",
            dataIndex: "ongba",
            width: 100,
            key: "ongba",
        },
        {
            title: "Di???n gi???i",
            dataIndex: "diengiai",
            width: 100,
            key: "diengiai",
        },
        {
            title: "M?? ?????i t?????ng",
            dataIndex: "madoituong",
            width: 100,
            key: "madoituong",
        },
        {
            title: "?????i t?????ng",
            dataIndex: "doituong",
            width: 100,
            key: "doituong",
        },
        {
            title: "KH thu???",
            dataIndex: "khthue",
            width: 100,
            key: "khthue",
        },
        {
            title: "?????a ch???",
            dataIndex: "diachi",
            width: 200,
            key: "diachi",
        },
        {
            title: "M?? s??? thu???",
            dataIndex: "mst",
            width: 100,
            key: "mst",
        },
        {
            title: "Email",
            dataIndex: "email",
            width: 100,
            key: "email",
        },
        {
            title: "Kho",
            dataIndex: "kho",
            width: 100,
            key: "kho",
        },
        {
            title: "M?? nh??n vi??n",
            dataIndex: "manv",
            width: 80,
            key: "manv",
        },
        {
            title: "Nh??n vi??n",
            dataIndex: "nv",
            width: 80,
            key: "nv",
        },
        {
            title: "Tk ng??n h??ng n???",
            dataIndex: "tknhno",
            width: 100,
            key: "tknhno",
        },
        {
            title: "Ng??n h??ng",
            dataIndex: "nh",
            width: 100,
            key: "nh",
        },
        {
            title: "HT Thanh to??n",
            dataIndex: "htthtoan",
            width: 100,
            key: "htthtoan",
        },
        {
            title: "Ghi ch?? th??m",
            dataIndex: "ghichu",
            width: 100,
            key: "ghichu",
        },
        {
            title: "L?? do",
            dataIndex: "lydo",
            width: 150,
            key: "lydo",
        },
        {
            title: "M?? v???t t??",
            dataIndex: "mavattu",
            width: 200,
            key: "mavattu",
            editable: true,
            ...getColumnSearchProps("mavattu"),
            sorter: (a, b) => a.mavattu.length - b.mavattu.length,
            sortDirections: ["descend", "ascend"],
            render: (text) => {
                return {
                    props: {
                        style: { background: "#fff3e0" },
                    },
                    children: <>{text}</>,
                };
            },
            // onCell: (text, record) => {
            //     return {
            //         props: {
            //             style: { background: "#fff3e0" },
            //         },
            //         children: <>{text}</>,
            //     };
            // },
        },
        {
            title: "T??n v???t t??",
            dataIndex: "tenvattu",
            width: 120,
            key: "tenvattu",
            ...getColumnSearchProps("tenvattu"),
            sorter: (a, b) => a.tenvattu.length - b.tenvattu.length,
            sortDirections: ["descend", "ascend"],
        },
        {
            title: "??v ??o",
            dataIndex: "dvdo",
            width: 100,
            key: "dvdo",
            sorter: (a, b) => a.dvdo.length - b.dvdo.length,
            sortDirections: ["descend", "ascend"],
        },
        {
            title: "S??? l?????ng t???n",
            dataIndex: "slgton",
            width: 100,
            key: "slgton",
        },
        {
            title: "S??? l?????ng",
            dataIndex: "slg",
            width: 100,
            key: "slg",
        },
        {
            title: "????n gi??",
            dataIndex: "dongia",
            width: 100,
            key: "dongia",
            sorter: (a, b) => a.dongia - b.dongia,
            sortDirections: ["descend", "ascend"],
        },
        {
            title: "Th??nh ti???n",
            dataIndex: "thtien",
            width: 100,
            key: "thtien",
        },
        {
            title: "Ti???n gi???m theo NQ43",
            dataIndex: "tgiamnq43",
            width: 120,
            key: "tgiamnq43",
        },
        {
            title: "Thanh to??n",
            dataIndex: "thtoan",
            width: 100,
            key: "thtoan",
        },
        {
            title: "Ng??nh ngh??? kinh doanh",
            dataIndex: "nngkd",
            width: 150,
            key: "nngkd",
        },
        {
            title: "C??ng trinh",
            dataIndex: "ctrinh",
            width: 100,
            key: "ctrinh",
        },
        {
            title: "V??? vi???c",
            dataIndex: "vuviec",
            width: 100,
            key: "vuviec",
        },
        {
            title: "Di???n gi???i chi ti???t",
            dataIndex: "diengiaict",
            width: 200,
            key: "diengiaict",
        },
        {
            title: "TK n???",
            dataIndex: "tkno",
            width: 100,
            key: "tkno",
        },
        {
            title: "TK c??",
            dataIndex: "tkco",
            width: 100,
            key: "tkco",
        },
        {
            title: "Nh??m h??ng",
            dataIndex: "nhomhang",
            width: 200,
            // editable: true,
            key: "nhomhang",
        },
        {
            title: "??VT nh??m",
            dataIndex: "dvtnhom",
            width: 100,
            key: "dvtnhom",
            sorter: (a, b) => a.dvtnhom.length - b.dvtnhom.length,
            sortDirections: ["descend", "ascend"],
        },
        {
            title: "FILTER",
            dataIndex: "filter",
            width: 110,
            key: "filter",
            fixed: "right",
            sorter: (a, b) => a.filter.length - b.filter.length,
            sortDirections: ["descend", "ascend"],
            render: (text, record) => (
                <>{renderFilter(text, record.tenvattu, record.mavattu)}</>
            ),
        },
        {
            title: "#",
            key: "action",
            fixed: "right",
            width: 70,
            render: (_, record) => {
                const editable = isEditing(record);
                return editable ? (
                    <span>
                        <Typography.Link
                            className="text-success me-3"
                            onClick={() => save(record.key)}
                            style={{
                                marginRight: 8,
                            }}
                        >
                            <SaveOutlined />
                        </Typography.Link>
                        <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
                            <CloseCircleOutlined className="text-danger" />
                        </Popconfirm>
                    </span>
                ) : (
                    <Typography.Link
                        disabled={editingKey !== ""}
                        onClick={() => edit(record)}
                    >
                        <EditOutlined />
                    </Typography.Link>
                );
            },
        },
    ];

    const mergedColumns = cols.map((col) => {
        if (!col.editable) {
            return col;
        }
        return {
            ...col,
            onCell: (record) => ({
                record,
                inputType: "text",
                dataIndex: col.dataIndex,
                title: col.title,
                editing: isEditing(record),
            }),
        };
    });

    const beforeUpload = (file) => {
        const isXlsx =
            file.type ===
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
        if (!isXlsx) {
            message.error("You can only upload XLSX file!");
        }
        return isXlsx;
    };

    const ExcelDateToJSDate = (date) => {
        const newdate = new Date(Math.round((date - 25569) * 86400 * 1000));
        return dayjs(newdate).format("DD/MM/YYYY");
    };

    const onChangeFile = (ev) => {
        if (beforeUpload(ev.target.files[0])) {
            const fileObj = ev.target.files[0];
            inventory.length == 0 &&
                message.warning("D??? li???u T???n ?????u k??? tr???ng");
            setEditNo([]);
            setLoading(true);
            ExcelRenderer(fileObj, (err, resp) => {
                if (err) {
                    console.log("error");
                    setLoading(false);
                } else {
                    const rows = [];
                    let i = 0;
                    resp.rows &&
                        resp.rows.map((row, index) => {
                            if (row.length >= 11 && row[0] != "Ng??y") {
                                rows.push({
                                    key: i,
                                    no: i + 1,
                                    ngay: ExcelDateToJSDate(row[0]),
                                    chungtu: row[1],
                                    seri: row[2],
                                    sohdon: row[3],
                                    ngayhoadon: ExcelDateToJSDate(row[4]),
                                    ongba: row[5],
                                    diengiai: row[6],
                                    madoituong: row[7],
                                    doituong: row[8],
                                    khthue: row[9],
                                    diachi: row[10],
                                    mst: row[11],
                                    email: row[12],
                                    kho: row[13],
                                    manv: row[14],
                                    nv: row[15],
                                    tknhno: row[16],
                                    nh: row[17],
                                    htthtoan: row[18],
                                    ghichu: row[19],
                                    lydo: row[20],
                                    mavattu: row[21],
                                    tenvattu: row[22],
                                    dvdo: row[23],
                                    slgton: row[24],
                                    slg: row[25],
                                    dongia: row[26],
                                    thtien: row[27],
                                    tgiamnq43: row[28],
                                    thtoan: row[29],
                                    nngkd: row[30],
                                    ctrinh: row[31],
                                    vuviec: row[32],
                                    diengiaict: row[33],
                                    tkno: row[34],
                                    tkco: row[35],
                                    nhomhang: row[36],
                                    dvtnhom: row[37],
                                    filter: selectCodeProps(
                                        row[21],
                                        row[22],
                                        row[23],
                                        row[26]
                                    ),
                                });
                                i += 1;
                            }
                        });
                    setData(rows);
                    props.setExportInvoice(rows);
                    setLoading(false);
                }
            });
        }
    };

    const merge = () => {
        const newData = [];
        data.map((item, index) => {
            const row = item;
            if (item.filter == "") {
                row.filter = item.mavattu;
            } else {
                row.mavattu = item.filter;
            }
            newData.push(row);
        });
        setData(newData);
        props.setExportInvoice(newData);
    };

    const exportExcel = (sheet, columns, data, file) => {
        const excel = new Excel();
        excel
            .addSheet(sheet)
            .addColumns(columns)
            .addDataSource(data)
            .saveAs(`${file}.xlsx`);
    };

    const handleButtonClick = (ev) => {
        exportExcel(
            "Data",
            cols.filter(
                (item) => !["filter", "no", "action"].includes(item.key)
            ),
            data,
            "DATA"
        );
    };

    return (
        <div>
            <div className="text-center mb-2 mt-2 fz-18">
                <b className="text-muted">D??? LI???U B??N H??NG</b>
            </div>
            <div className="d-flex justify-content-between align-items-center">
                <div>
                    <Input
                        type="file"
                        name="fileUpload"
                        onChange={onChangeFile}
                        className="mb-2"
                    />
                </div>
                <div>
                    <Button className="me-1">
                        <a
                            href={"/files/MauBanRa.xlsx"}
                            target="_blank"
                            download
                        >
                            File M???u
                        </a>
                    </Button>
                    <Button
                        style={{ backgroundColor: "#fa541c", color: "white" }}
                        className="me-1"
                        onClick={merge}
                    >
                        Merge
                    </Button>
                    {/* <Button className="me-1">Restore</Button> */}
                    <Button
                        style={{ color: "white" }}
                        className="bg-success"
                        onClick={handleButtonClick}
                    >
                        Excel
                    </Button>
                </div>
            </div>
            <Form form={form} component={false}>
                <Table
                    loading={loading}
                    dataSource={data}
                    columns={mergedColumns}
                    bordered
                    size="middle"
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
                    components={{
                        body: {
                            cell: EditableCell,
                        },
                    }}
                />
            </Form>
        </div>
    );
};
