"use client";
import React from "react";
import { Menu } from "antd";
import { usePathname } from "next/navigation";
import Link from "next/link";
import styles from "./menuList.module.css";
const { SubMenu } = Menu;
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
} from "@ant-design/icons";

export default function Menulist() {
  const path = usePathname();
  return (
    <div className={styles.container}>
      <Menu
        theme="dark"
        mode="inline"
        defaultSelectedKeys={["/spend"]}
        selectedKeys={[path === "/" ? "/spend" : path]}
        defaultOpenKeys={["bank_account"]}
      >
        <SubMenu key="bank_account" icon={<UserOutlined />} title="Account">
          <Menu.Item key="/spend">
            <Link href="/spend">spend</Link>
          </Menu.Item>
          <Menu.Item key="/chart">
            <Link href="/chart">chart</Link>
          </Menu.Item>
        </SubMenu>
        <SubMenu key="learn" icon={<MenuFoldOutlined />} title="Learn">
          <Menu.Item key="/algorithm">
            <Link href="/algorithm">algorithm</Link>
          </Menu.Item>
          <Menu.Item key="/h5c3">
            <Link href="/h5c3">h5c3</Link>
          </Menu.Item>
        </SubMenu>
      </Menu>
    </div>
  );
}
