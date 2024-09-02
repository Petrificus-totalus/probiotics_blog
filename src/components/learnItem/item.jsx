import React from "react";
import styles from "./item.module.css";
import { useRouter } from "next/navigation";

export default function Item({ item, branch }) {
  const router = useRouter();
  const name = branch + "ID"; // javaID  reactID....

  const getDetail = () => {
    router.push(`/${branch}/${item[name]}`);
  };
  return (
    <div className={styles.container} onClick={() => getDetail()}>
      <div className={styles.title}>{item.title}</div>
      <div className={styles.desc}>{item.desc}</div>
    </div>
  );
}
