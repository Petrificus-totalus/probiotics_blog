"use client";
import Markdown from "markdown-to-jsx";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import styles from "./content.module.css";
import options from "@/lib/markdownOptions";

export default function SQLDetail({ params }) {
  const [content, setContent] = useState("");
  const router = useRouter();
  useEffect(() => {
    const getContent = async () => {
      const response = await fetch(`/api/sql/content?id=${params.id}`);
      const { data } = await response.json();
      setContent(data[0].content);
    };
    getContent();
  }, []);

  return (
    <div className={styles.container}>
      <button onClick={() => router.back()} className={styles.back}>
        back
      </button>
      <Markdown className={styles.markdown} options={options}>
        {content}
      </Markdown>
    </div>
  );
}
