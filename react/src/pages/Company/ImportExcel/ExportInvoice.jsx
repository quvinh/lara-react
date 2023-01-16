import { SearchOutlined, UploadOutlined } from '@ant-design/icons';
import { Button, Input, message, Space, Table, Upload } from 'antd';
import dayjs from 'dayjs';
import 'dayjs/locale/en';
import locale from 'antd/locale/vi_VN';
import { useRef, useState } from 'react';
import { ExcelRenderer } from 'react-excel-renderer';
import Highlighter from 'react-highlight-words';

export const ExportInvoice = (props) => {
    const [data, setData] = useState({
        rows: props.inventory
    });
    const inventory = [...props.inventory];

    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const [loading, setLoading] = useState(false);
    const searchInput = useRef(null);

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

    const cols = [
        {
            title: 'STT',
            dataIndex: 'no',
            key: 'no',
            width: 60,
            sorter: (a, b) => a.no - b.no,
            sortDirections: ['descend', 'ascend'],
            fixed: 'left'
        },
        {
            title: 'Ngày',
            dataIndex: 'ngay',
            key: 'ngay',
            width: 100,
            fixed: 'left',
        },
        {
            title: 'Seri hóa đơn',
            dataIndex: 'seri',
            width: 100,
            key: 'seri'
        },
        {
            title: 'Số Hóa đơn',
            dataIndex: 'sohdon',
            width: 100,
            key: 'sohdon'
        },
        {
            title: 'Ngày hóa đơn',
            dataIndex: 'ngayhoadon',
            width: 100,
            key: 'ngayhoadon'
        },
        {
            title: 'Ông/Bà',
            dataIndex: 'ongba',
            width: 100,
            key: 'ongba'
        },
        {
            title: 'Diễn giải',
            dataIndex: 'diengiai',
            width: 100,
            key: 'diengiai'
        },
        {
            title: 'Mã đối tượng',
            dataIndex: 'madoituong',
            width: 100,
            key: 'madoituong'
        },
        {
            title: 'Đối tượng',
            dataIndex: 'doituong',
            width: 100,
            key: 'doituong'
        },
        {
            title: 'KH thuế',
            dataIndex: 'khthue',
            width: 100,
            key: 'khthue'
        },
        {
            title: 'Địa chỉ',
            dataIndex: 'diachi',
            width: 200,
            key: 'diachi'
        },
        {
            title: 'Mã số thuế',
            dataIndex: 'mst',
            width: 100,
            key: 'mst'
        },
        {
            title: 'Email',
            dataIndex: 'email',
            width: 100,
            key: 'email'
        },
        {
            title: 'Kho',
            dataIndex: 'kho',
            width: 100,
            key: 'kho'
        },
        {
            title: 'Mã nhân viên',
            dataIndex: 'manv',
            width: 80,
            key: 'manv'
        },
        {
            title: 'Nhân viên',
            dataIndex: 'nv',
            width: 80,
            key: 'nv'
        },
        {
            title: 'Tk ngân hàng nợ',
            dataIndex: 'tknhno',
            width: 100,
            key: 'tknhno'
        },
        {
            title: 'Ngân hàng',
            dataIndex: 'nh',
            width: 100,
            key: 'nh'
        },
        {
            title: 'HT Thanh toán',
            dataIndex: 'htthtoan',
            width: 100,
            key: 'htthtoan'
        },
        {
            title: 'Ghi chú thêm',
            dataIndex: 'ghichu',
            width: 100,
            key: 'ghichu'
        },
        {
            title: 'Lý do',
            dataIndex: 'lydo',
            width: 150,
            key: 'lydo'
        },
        {
            title: 'Mã vật tư',
            dataIndex: 'mavattu',
            width: 100,
            key: 'mavattu'
        },
        {
            title: 'Tên vật tư',
            dataIndex: 'tenvattu',
            width: 120,
            key: 'tenvattu'
        },
        {
            title: 'Đv đo',
            dataIndex: 'dvdo',
            width: 100,
            key: 'dvdo'
        },
        {
            title: 'Số lượng tồn',
            dataIndex: 'slgton',
            width: 100,
            key: 'slgton'
        },
        {
            title: 'Số lượng',
            dataIndex: 'slg',
            width: 100,
            key: 'slg'
        },
        {
            title: 'Đơn giá',
            dataIndex: 'dongia',
            width: 100,
            key: 'dongia'
        },
        {
            title: 'Thành tiền',
            dataIndex: 'thtien',
            width: 100,
            key: 'thtien'
        },
        {
            title: 'Tiền giảm theo NQ43',
            dataIndex: 'tgiamnq43',
            width: 120,
            key: 'tgiamnq43'
        },
        {
            title: 'Thanh toán',
            dataIndex: 'thtoan',
            width: 100,
            key: 'thtoan'
        },
        {
            title: 'Ngành nghề kinh doanh',
            dataIndex: 'nngkd',
            width: 150,
            key: 'nngkd'
        },
        {
            title: 'Công trinh',
            dataIndex: 'ctrinh',
            width: 100,
            key: 'ctrinh'
        },
        {
            title: 'Vụ việc',
            dataIndex: 'vuviec',
            width: 100,
            key: 'vuviec'
        },
        {
            title: 'Diễn giải chi tiết',
            dataIndex: 'diengiaict',
            width: 200,
            key: 'diengiaict'
        },
        {
            title: 'TK nợ',
            dataIndex: 'tkno',
            width: 100,
            key: 'tkno'
        },
        {
            title: 'TK có',
            dataIndex: 'tkco',
            width: 100,
            key: 'tkco'
        },
        {
            title: 'Nhóm hàng',
            dataIndex: 'nhomhang',
            width: 100,
            key: 'nhomhang'
        },
        {
            title: 'ĐVT nhóm',
            dataIndex: 'dvtnhom',
            width: 100,
            key: 'dvtnhom'
        },
    ]

    const beforeUpload = (file) => {
        const isXlsx = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
        if (!isXlsx) {
            message.error('You can only upload XLSX file!');
        }
        return isXlsx;
    };

    const ExcelDateToJSDate = (date) => {
        const newdate = new Date(date * 1000);
        console.log(newdate);
        return dayjs(newdate).locale('en').format('DD/MM/YYYY HH:mm:ss A');
    }

    const onChangeFile = (ev) => {
        if (beforeUpload(ev.target.files[0])) {
            const fileObj = ev.target.files[0];
            setLoading(true);
            ExcelRenderer(fileObj, (err, resp) => {
                if (err) {
                    console.log(err);
                    setLoading(false);
                }
                else {
                    const rows = [];
                    let i = 0;
                    resp.rows && resp.rows.map((row, index) => {
                        if (row.length >= 11 && row[0]) {
                            rows.push({
                                key: i,
                                no: i + 1,
                                ngay: ExcelDateToJSDate(row[0]),
                                chungtu: row[1],
                                seri: row[2],
                                sohdon: row[3],
                                ngayhoadon: row[4],
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
                            })
                            i += 1;
                        }
                    })
                    setData({
                        // cols: cols,
                        rows: rows
                    });
                    setLoading(false);
                    props.data
                }
            });
        }
    }

    return (
        <div>
            <div className="text-center">
                <h2 className="text-muted">Dữ liệu bán hàng</h2>
            </div>
            <Input type='file' name='fileUpload' onChange={onChangeFile} className='mb-2' />
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
                    showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
                    defaultPageSize: 20,
                    position: ['topRight', 'bottomRight'],
                    pageSizeOptions: [10, 20, 50, 100, 500]
                }} />
        </div>

    )
}
