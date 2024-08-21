import React from "react";
import styles from "./item.module.css";
import { useRouter } from "next/navigation";

export default function Item({ item }) {
  const router = useRouter();

  const getDetail = () => {
    router.push(`/sql/${item.sqlID}`);
  };
  return (
    <div className={styles.container} onClick={() => getDetail()}>
      <div className={styles.title}>{item.title}</div>
      <div className={styles.desc}>{item.desc}</div>
    </div>
  );
}
