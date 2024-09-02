"use client";
import Code from "@/components/Code/code";
import Markdown from "markdown-to-jsx";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import styles from "./content.module.css";

export default function JavaDetail({ params }) {
  const [content, setContent] = useState("");
  const router = useRouter();
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
      <button onClick={() => router.back()} className={styles.back}>
        back
      </button>
      <Markdown
        className={styles.markdown}
        options={{
          overrides: {
            code: {
              component: Code,
            },
            h1: {
              component: ({ children }) => (
                <h1 style={{ margin: "20px 0" }}>{children}</h1>
              ),
            },
            h2: {
              component: ({ children }) => (
                <h2 style={{ margin: "10px 0" }}>{children}</h2>
              ),
            },
            li: {
              component: ({ children }) => (
                <li style={{ marginLeft: "20px", marginBottom: "5px" }}>
                  {children}
                </li>
              ),
            },
          },
        }}
      >
        {content}
      </Markdown>
    </div>
  );
}
