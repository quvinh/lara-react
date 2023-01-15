import { UploadOutlined } from '@ant-design/icons';
import { Button, message, Table, Upload } from 'antd';
import { useState } from 'react';
import { ExcelRenderer } from 'react-excel-renderer';

export const ImportExcel = () => {
    const [data, setData] = useState({});
    const beforeUpload = (file) => {
        const isXlsx = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
        if (!isXlsx) {
            message.error('You can only upload XLSX file!');
        }
        return isXlsx;
    };

    const props = {
        name: 'file',
        action: 'https://run.mocky.io/v3/d894893a-e78d-4e14-8043-2f725dd92a4c',
        onChange(info) {
            // if (info.file.status !== 'uploading') {
            //     console.log(info.file, info.fileList);
            // }
            if (info.file.status === 'done') {
                message.success(`${info.file.name} file uploaded successfully`);
                const fileObj = info.file.originFileObj;
                console.log(fileObj)
                ExcelRenderer(fileObj, (err, resp) => {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        resp.rows && resp.rows.map((row, index) => {
                            console.log(row);
                        })
                        // setData({
                        //     cols: resp.cols,
                        //     rows: resp.rows
                        // });
                    }
                });
            } else if (info.file.status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
            }
        },
        beforeUpload(file) {
            beforeUpload(file)
        }
    };


    return (
        <div>
            <Upload {...props}>
                <Button icon={<UploadOutlined />}>Click to Upload</Button>
            </Upload>
            <Table dataSource={data.rows} columns={[{name: 'a', key: 0}]} />
        </div>

    )
}
