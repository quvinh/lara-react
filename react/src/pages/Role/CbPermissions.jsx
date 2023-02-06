import React, { useState, useEffect } from "react";
import { Checkbox, Divider, Row, Col } from "antd";

export const CbPermissions = (props) => {
    // console.log(props.permissions);
    const [permissions, setPermissions] = useState([...props.permissions]);
    const item = props.item;
    // useEffect(() => {
    //     setPermissions([...props.permissions]);
    // }, []);
    return (
        <div>
            <Divider className="mt-1 mb-1" />
            <Checkbox.Group
                className="w-100 mt-1"
                defaultValue={permissions}
                value={permissions}
            >
                <Row className="w-100">
                    <Col span={6}>
                        <span>{item.toUpperCase()}</span>
                    </Col>
                    <Col span={3}>
                        <Checkbox
                            value={`all.${item}`}
                            onChange={(ev) =>
                                console.log("checked = ", ev.target.checked)
                            }
                        >
                            <span className="text-muted">all</span>
                        </Checkbox>
                    </Col>
                    <Col span={3}>
                        <Checkbox value={`${item}.view`} id={`${item}.view`}>
                            <span className="text-muted">view</span>
                        </Checkbox>
                    </Col>
                    <Col span={3}>
                        <Checkbox value={`${item}.add`}>
                            <span className="text-muted">add</span>
                        </Checkbox>
                    </Col>
                    <Col span={3}>
                        <Checkbox value={`${item}.edit`}>
                            <span className="text-muted">edit</span>
                        </Checkbox>
                    </Col>
                    <Col span={3}>
                        <Checkbox value={`${item}.delete`}>
                            <span className="text-muted">delete</span>
                        </Checkbox>
                    </Col>
                    <Col span={3}>
                        <Checkbox value={`${item}.confirm`}>
                            <span className="text-muted">confirm</span>
                        </Checkbox>
                    </Col>
                </Row>
            </Checkbox.Group>
        </div>
    );
};
