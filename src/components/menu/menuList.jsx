"use client";
import React from "react";
import { Menu } from "antd";
import { usePathname } from "next/navigation";
import Link from "next/link";
import styles from "./menuList.module.css";

export default function Menulist() {
  const path = usePathname();
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
