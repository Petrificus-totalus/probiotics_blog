"use client";
import React, { useEffect, useState } from "react";
import Item from "@/components/learnItem/item";
import styles from "./react.module.css";

export default function ReactPage() {
  const [items, setItems] = useState([]);
  useEffect(() => {
    const getItems = async () => {
      const response = await fetch("/api/react");
      const { data } = await response.json();
      setItems(data);
    };
    getItems();
  }, []);

  return (
    <div className={styles.container}>
      {items.map((item) => (
        <Item item={item} key={item["reactID"]} />
      ))}
    </div>
  );
}
