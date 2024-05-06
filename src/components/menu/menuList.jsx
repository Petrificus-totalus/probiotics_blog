"use client";
import React from "react";
import { Menu } from "antd";
import { usePathname } from "next/navigation";
import Link from "next/link";
import styles from "./menuList.module.css";
import { MenuFoldOutlined, UserOutlined } from "@ant-design/icons";

export default function Menulist() {
  const path = usePathname();
  const items = [
    // {
    //   key: "bank_account",
    //   label: "Account",
    //   icon: <UserOutlined />,
    //   children: [
    //     {
    //       key: "/spend",
    //       label: <Link href="/spend">spend</Link>,
    //     },
    //     {
    //       key: "/chart",
    //       label: <Link href="/chart">chart</Link>,
    //     },
    //   ],
    // },
    {
      key: "learn",
      label: "Learn",
      icon: <MenuFoldOutlined />,
      children: [
        {
          key: "/algorithm",
          label: <Link href="/algorithm">algorithm</Link>,
        },
        {
          key: "/h5c3",
          label: <Link href="/h5c3">h5c3</Link>,
        },
      ],
    },
  ];
  return (
    <div className={styles.container}>
      <Menu
        theme="dark"
        mode="inline"
        defaultSelectedKeys={["/spend"]}
        selectedKeys={[path === "/" ? "/spend" : path]}
        defaultOpenKeys={["bank_account"]}
        items={items}
      />
    </div>
  );
}
