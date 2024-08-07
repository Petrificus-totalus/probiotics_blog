"use client";
import React, { useState } from "react";
import { Menu, Button } from "antd";
import { usePathname } from "next/navigation";
import Link from "next/link";
import styles from "./menuList.module.css";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";

export default function Menulist() {
  const path = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };
  const [openKeys, setOpenKeys] = useState(["bank_account"]); // 默认展开的主菜单项

  const items = [
    {
      key: "bank_account",
      label: "Account",
      children: [
        {
          key: "/spend",
          label: <Link href="/spend">spend</Link>,
        },
        {
          key: "/chart",
          label: <Link href="/chart">chart</Link>,
        },
      ],
    },
    {
      key: "learn",
      label: "Learn",
      children: [
        {
          key: "/algorithm",
          label: <Link href="/algorithm">algorithm</Link>,
        },
        {
          key: "/h5c3",
          label: <Link href="/h5c3">h5c3</Link>,
        },
        {
          key: "/network",
          label: <Link href="/network">network</Link>,
        },
        {
          key: "/react",
          label: <Link href="/react">react</Link>,
        },
      ],
    },
    {
      key: "swallow",
      label: <Link href="/swallow">Swallow</Link>,
    },
  ];
  const onOpenChange = (keys) => {
    const latestOpenKey = keys.find((key) => openKeys.indexOf(key) === -1);
    if (["bank_account", "learn"].indexOf(latestOpenKey) === -1) {
      setOpenKeys(keys);
    } else {
      setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
    }
  };

  return (
    <div className={styles.container}>
      <Button
        type="primary"
        onClick={toggleCollapsed}
        style={{
          margin: 10,
          marginBottom: 16,
        }}
      >
        {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
      </Button>
      <Menu
        theme="dark"
        mode="inline"
        defaultSelectedKeys={["/spend"]}
        selectedKeys={[path === "/" ? "/spend" : path]}
        openKeys={openKeys}
        onOpenChange={onOpenChange}
        inlineCollapsed={collapsed}
        items={items}
      />
    </div>
  );
}
