import { Button, message, Steps, theme } from 'antd';
import { useState } from 'react';
import { ImportInventory } from './ImportInventory';
import { ExportInvoice } from './ExportInvoice';

export const index = () => {
    const { token } = theme.useToken();
    const [current, setCurrent] = useState(0);

    const [inventory, setInventory] = useState([]);
    // console.log(new Set(inventory.map(item => item.masanpham)))
    const steps = [
        {
            title: 'Tồn đầu kỳ',
            content: <ImportInventory inventory={inventory} setInventory={setInventory} />,
        },
        {
            title: 'Dữ liệu bán hàng',
            content: <ExportInvoice inventory={inventory} />,
        },
        {
            title: 'Kết quả',
            content: 'Last-content',
        },
    ];

    const next = () => {
        setCurrent(current + 1);
    };
    const prev = () => {
        setCurrent(current - 1);
    };
    const items = steps.map((item) => ({
        key: item.title,
        title: item.title,
    }));
    const contentStyle = {
        // lineHeight: '260px',
        // textAlign: 'center',
        // color: token.colorTextTertiary,
        // backgroundColor: token.colorFillAlter,
        // borderRadius: token.borderRadiusLG,
        // border: `1px dashed ${token.colorBorder}`,
        marginTop: 16,
    };
    return (
        <>
            <Steps current={current} items={items} />
            <div style={contentStyle}>{steps[current].content}</div>
            <div className='d-flex justify-content-end align-items-center mt-2'>
                {current > 0 && (
                    <div className='me-1'>
                        <Button
                            onClick={() => prev()}
                        >
                            Previous
                        </Button>
                    </div>
                )}
                {current < steps.length - 1 && (
                    <div>
                        <Button type="primary" onClick={() => next()}>
                            Next
                        </Button>
                    </div>
                )}
                {current === steps.length - 1 && (
                    <div>
                        <Button type="primary" onClick={() => message.success('Processing complete!')}>
                            Done
                        </Button>
                    </div>
                )}
            </div>
        </>
    );
}
