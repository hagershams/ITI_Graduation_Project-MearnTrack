import {
  Outlet,
  useNavigate,
  useRouteLoaderData,
  useLocation,
  redirect,
} from "react-router";
import {
  Breadcrumb,
  Col,
  Flex,
  Layout,
  Menu,
  Row,
  theme,
  Avatar,
  ConfigProvider,
} from "antd";
import {
  HomeOutlined,
  UserOutlined,
  CalendarOutlined,
  SettingOutlined,
  AntDesignOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import { ButtonOutlined } from "../../shared/ui";
import { ButtonBlack } from "../../shared/ui/ButtonBlack";
import signUserOut from "../../shared/model/signUserOut";
import { useState } from "react";

const { Header, Content, Footer, Sider } = Layout;

export default function AccountLayout() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  return (
    <>
      <Layout
        style={{
          maxWidth: "1150px",
          margin: "0 auto",
          padding: "0",
          background: "#ffffff",
        }}
      >
        <Sider
          style={{
            top: "100px",
            background: "#ffffff",
            position: "sticky",
            overflowY: "auto",
            padding: "36px 20px 0 0",
            height: "calc(100vh - 100px)",
            borderRight: "1px solid #EEEEEE",
          }}
          width={290}
          className="aside"
          collapsed={!drawerOpen}
        >
          <AsideCom drawerOpen={drawerOpen} setDrawerOpen={setDrawerOpen} />
        </Sider>
        <Content
          style={{
            padding: "36px 25px 0 25px",
            minHeight: 280,
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </>
  );
}
export function AsideCom(props) {
  console.log("🚀 ~ file: accountLayout.js:76 ~ AsideCom ~ props:", props);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { user } = useRouteLoaderData("root");
  // const user = { handler: "omar" };
  console.log("🚀 ~ file: accountLayout.js:71 ~ AsideCom ~ user:", user);
  console.log("acc nav", pathname);

  const logOut = () => {
    signUserOut();
  };

  const items = [
    {
      label: "Home",
      key: `/${user && user.handler}/account`,
      icon: <HomeOutlined />,
    },
    {
      label: "Sessions",
      key: `/${user && user.handler}/account/sessions`,
      icon: <CalendarOutlined />,
    },
    {
      label: "My Profile",
      key: `/${user && user.handler}/account/update`,
      icon: <UserOutlined />,
    },
    {
      label: "Settings",
      key: `/${user && user.handler}/account/settings`,
      icon: <SettingOutlined />,
    },
    {
      label: "Sign Out",
      key: "/",
      icon: <LogoutOutlined />,
      onClick: logOut,
    },
  ];
  const handleMenuSelect = ({ key }) => {
    if (key === "/") {
      logOut();
      // setDrawerOpen(false);
      navigate("/");
    } else {
      // Close the drawer when any menu item is selected
      // setDrawerOpen(false);
      // console.log(drawerOpen);

      navigate(key);
    }
  };
  return (
    <>
      {!user && (
        <div className="authHeaderBtns">
          <Flex vertical={false} style={{ justifyContent: "space-around" }}>
            <ButtonOutlined to="/login">Login</ButtonOutlined>
            <ButtonBlack to="/signup">Signup</ButtonBlack>
          </Flex>
        </div>
      )}
      {user && (
        <>
          <Flex vertical={false} style={{ marginBottom: "12px" }}>
            <Avatar
              className="img-avatar"
              size={{ xs: 50, sm: 50, md: 75, lg: 75, xl: 75, xxl: 100 }}
              src={user.photo}
            />
            <Flex vertical={true} justify="center" className="prof">
              <div style={{ fontSize: "18px", fontWeight: "bold" }}>
                {user.firstName + " " + user.lastName}
              </div>
              <Link to={"/" + user.handler} style={{ color: "#343434" }}>
                View profile
              </Link>
            </Flex>
          </Flex>
          <ConfigProvider
            theme={{
              components: {
                Menu: {
                  itemSelectedBg: "#fff",
                  itemHoverBg: "#fff",
                  itemHoverColor: "#da005c",
                  itemActiveBg: "#fff",
                  padding: 0,
                  iconSize: 24,
                  fontSize: 20,
                  iconMarginInlineEnd: 20,
                },
              },
            }}
          >
            <Menu
              mode="inline"
              inlineIndent={5}
              style={{ border: "none" }}
              items={items}
              // defaultSelectedKeys={[`${pathname}`]}
              onSelect={handleMenuSelect}
            />
          </ConfigProvider>
        </>
      )}
    </>
  );
}
