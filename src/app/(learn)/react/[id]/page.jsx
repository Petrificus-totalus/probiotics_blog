"use client";
import Code from "@/components/Code/code";
import Markdown from "markdown-to-jsx";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import styles from "./content.module.css";

export default function ReactDetail({ params }) {
  const [content, setContent] = useState("");
  const router = useRouter();
  console.log(params);
  useEffect(() => {
    const getContent = async () => {
      const response = await fetch(`/api/react/content?id=${params.id}`);
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
        options={{
          overrides: {
            code: {
              component: Code,
            },
            ha: {
              component: ({ children }) => (
                <span style={{ color: "red" }}>{children}</span>
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
