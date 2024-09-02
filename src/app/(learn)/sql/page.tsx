"use client";
import React, { useEffect, useState } from "react";
import Item from "@/components/learnItem/item";
import styles from "./sql.module.css";

export default function SQLPage() {
  const [items, setItems] = useState([]);
  useEffect(() => {
    const getItems = async () => {
      const response = await fetch("/api/sql");
      const { data } = await response.json();
      setItems(data);
    };
    getItems();
  }, []);

  return (
    <div className={styles.container}>
      {items.map((item) => (
        <Item item={item} branch={"sql"} key={item["sqlID"]} />
      ))}
    </div>
  );
}
