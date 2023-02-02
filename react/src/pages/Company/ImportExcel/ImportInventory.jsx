import { SearchOutlined, UploadOutlined } from "@ant-design/icons";
import { Button, Input, message, Space, Table, Upload } from "antd";
import { Link } from "react-router-dom";
import { useRef, useState } from "react";
import { ExcelRenderer } from "react-excel-renderer";
import Highlighter from "react-highlight-words";

export const ImportInventory = (props) => {
    const [data, setData] = useState({
        rows: props.inventory,
    });

    const [searchText, setSearchText] = useState("");
    const [searchedColumn, setSearchedColumn] = useState("");
    const [loading, setLoading] = useState(false);
    const searchInput = useRef(null);

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

    const cols = [
        {
            title: "STT",
            dataIndex: "no",
            key: "no",
            width: "5%",
            sorter: (a, b) => a.no - b.no,
            sortDirections: ["descend", "ascend"],
            fixed: "left",
        },
        {
            title: "Mã sản phẩm",
            dataIndex: "masanpham",
            key: "masanpham",
            ...getColumnSearchProps("masanpham"),
            sorter: (a, b) => a.masanpham.length - b.masanpham.length,
            sortDirections: ["descend", "ascend"],
            fixed: "left",
        },
        {
            title: "Tên hàng hóa",
            dataIndex: "tenhanghoa",
            ...getColumnSearchProps("tenhanghoa"),
            key: "tenhanghoa",
        },
        {
            title: "Đơn vị tính",
            dataIndex: "dvt",
            key: "dvt",
            width: 90,
        },
        {
            title: "Tồn đầu kỳ",
            children: [
                {
                    title: "Số lượng",
                    dataIndex: "slg_dauky",
                    width: 75,
                    key: "slg_dauky",
                },
                {
                    title: "Thành tiền",
                    dataIndex: "thtien_dauky",
                    key: "thtien_dauky",
                },
            ],
        },
        {
            title: "Nhập trong kỳ",
            children: [
                {
                    title: "Số lượng",
                    dataIndex: "slg_nhaptrongky",
                    width: 75,
                    key: "slg_nhaptrongky",
                },
                {
                    title: "Thành tiền",
                    dataIndex: "thtien_nhaptrongky",
                    key: "thtien_nhaptrongky",
                },
            ],
        },
        {
            title: "Xuất trong kỳ",
            children: [
                {
                    title: "Số lượng",
                    dataIndex: "slg_xuattrongky",
                    width: 75,
                    key: "slg_xuattrongky",
                },
                {
                    title: "Thành tiền",
                    dataIndex: "thtien_xuattrongky",
                    key: "thtien_xuattrongky",
                },
            ],
        },
        {
            title: "Tồn cuối kỳ",
            children: [
                {
                    title: "Số lượng",
                    dataIndex: "slg_cuoiky",
                    key: "slg_cuoiky",
                    width: 75,
                    fixed: "right",
                },
                {
                    title: "Thành tiền",
                    dataIndex: "thtien_cuoiky",
                    key: "thtien_cuoiky",
                    fixed: "right",
                },
                {
                    title: "Đơn giá TB",
                    key: "avg",
                    fixed: "right",
                    render: (_, record) => (
                        <span className="text-primary">
                            {record.slg_cuoiky == 0
                                ? 0
                                : (
                                      record.thtien_cuoiky / record.slg_cuoiky
                                  ).toFixed(1)}
                        </span>
                    ),
                },
            ],
        },
    ];

    const beforeUpload = (file) => {
        const isXlsx =
            file.type ===
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
        if (!isXlsx) {
            message.error("You can only upload XLSX file!");
        }
        return isXlsx;
    };

    const onChangeFile = (ev) => {
        if (beforeUpload(ev.target.files[0])) {
            const fileObj = ev.target.files[0];
            setLoading(true);
            ExcelRenderer(fileObj, (err, resp) => {
                if (err) {
                    console.log(err);
                    setLoading(false);
                } else {
                    const rows = [];
                    let i = 0;
                    resp.rows &&
                        resp.rows.map((row, index) => {
                            if (row.length >= 11 && row[0]) {
                                rows.push({
                                    key: i,
                                    no: i + 1,
                                    masanpham: row[0],
                                    tenhanghoa: row[1],
                                    dvt: row[2],
                                    slg_dauky: row[3],
                                    thtien_dauky: row[4],
                                    slg_nhaptrongky: row[5],
                                    thtien_nhaptrongky: row[6],
                                    slg_xuattrongky: row[7],
                                    thtien_xuattrongky: row[8],
                                    slg_cuoiky: row[9],
                                    thtien_cuoiky: row[10],
                                });
                                i += 1;
                            }
                        });
                    setData({
                        // cols: cols,
                        rows: rows,
                    });
                    props.setInventory([...rows]);
                    setLoading(false);
                    props.data;
                }
            });
        }
    };

    return (
        <div>
            <div className="text-center mb-2 mt-2 fz-18">
                <b className="text-muted">TỒN ĐẦU KỲ</b>
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
                        <a href={"/files/MauTonKho.xlsx"} target="_blank" download>File Mẫu</a>
                    </Button>
                </div>
            </div>
            <Table
                loading={loading}
                dataSource={data.rows}
                columns={cols}
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
            />
        </div>
    );
};
