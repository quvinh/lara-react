import { useLocation, Link } from "react-router-dom";
import { Breadcrumb } from "antd";
import { HomeOutlined } from "@ant-design/icons";


export const Breadcrumbs = () => {
    const location = useLocation();
    const breadCrumbView = () => {
        const { pathname } = location;
        const pathnames = pathname.replace('/dashboard', '/').split("/").filter((item) => item);
        const capatilize = (s) => s.charAt(0).toUpperCase() + s.slice(1);
        return (
            <div className="d-flex justify-content-between align-items-center">
                {/* <h1 className="text-muted">{pathnames.slice(-1) == '' ? 'Dashboard' : capatilize(pathnames.slice(-1).toString())}</h1> */}
                <Breadcrumb>
                    {pathnames.length > 0 ? (
                        <Breadcrumb.Item>
                            <Link to="/"><HomeOutlined /> Dashboard</Link>
                        </Breadcrumb.Item>
                    ) : (
                        <Breadcrumb.Item><HomeOutlined /> Dashboard</Breadcrumb.Item>
                    )}
                    {pathnames.map((name, index) => {
                        const routeTo = `/${pathnames.slice(0, index + 1).join("/")}`;
                        const isLast = index === pathnames.length - 1;
                        return isLast ? (
                            <Breadcrumb.Item key={index}>{capatilize(name)}</Breadcrumb.Item>
                        ) : (
                            <Breadcrumb.Item key={index}>
                                <Link to={`${routeTo}`} onClick={ev => console.log(ev)}>{capatilize(name)}</Link>
                            </Breadcrumb.Item>
                        );
                    })}
                </Breadcrumb>
            </div>
        );
    };

    return <>{breadCrumbView()}</>;
}
