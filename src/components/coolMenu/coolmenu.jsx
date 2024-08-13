"use client";
import React from "react";
import { useRouter } from "next/navigation";
import styles from "./coolmenu.module.css";

const CoolMenu = ({ menuData }) => {
  const router = useRouter();

  const handleNavigation = (path) => {
    router.push(path);
  };

  return (
    <div className={styles.menuContainer}>
      {menuData.map((menu, index) => (
        <div key={index} className={styles.menuItem}>
          <div
            className={styles.parentItem}
            style={{
              animationDelay: index === 0 ? 0 : `${0.5 + (index - 1) * 0.1}s`,
            }}
          >
            {menu[0]}
          </div>
          <div className={styles.subMenu}>
            {menu.slice(1).map((subItem, subIndex) => (
              <div
                key={subIndex}
                className={styles.subMenuItem}
                style={{
                  animationDelay: `${
                    menuData.length * 0.2 + subIndex * 0.5 + index * 0.3
                  }s`,
                }}
                onClick={() => handleNavigation(`/${subItem.toLowerCase()}`)}
              >
                {subItem}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default CoolMenu;
