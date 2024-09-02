"use client";
import React, { useEffect, useState } from "react";
import Item from "@/components/learnItem/item";
import styles from "./java.module.css";

export default function JavaPage() {
  const [items, setItems] = useState([]);
  useEffect(() => {
    const getItems = async () => {
      const response = await fetch("/api/java");
      const { data } = await response.json();
      setItems(data);
    };
    getItems();
  }, []);

  return (
    <div className={styles.container}>
      {items.map((item) => (
        <Item item={item} branch={"java"} key={item["javaID"]} />
      ))}
    </div>
  );
}
