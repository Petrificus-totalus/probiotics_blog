"use client";
import Markdown from "markdown-to-jsx";
import React, { useState, useEffect } from "react";
import styles from "./content.module.css";
import options from "@/lib/markdownOptions";
export default function JavaDetail({ params }) {
  const [content, setContent] = useState("");
  useEffect(() => {
    const getContent = async () => {
      const response = await fetch(`/api/java/content?id=${params.id}`);
      const { data } = await response.json();
      setContent(data[0].content);
    };
    getContent();
  }, []);

  return (
    <div className={styles.container}>
      <Markdown className={styles.markdown} options={options}>
        {content}
      </Markdown>
    </div>
  );
}
