"use client";
import Code from "@/components/Code/code";
import Markdown from "markdown-to-jsx";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import styles from "./content.module.css";

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
      <Markdown
        className={styles.markdown}
        options={{
          overrides: {
            code: {
              component: Code,
            },
            h1: {
              component: ({ children }) => (
                <h1 style={{ margin: "20px 0 5px 0" }}>{children}</h1>
              ),
            },
            h2: {
              component: ({ children }) => (
                <h2 style={{ margin: "10px 0 5px 0" }}>{children}</h2>
              ),
            },
            li: {
              component: ({ children }) => (
                <li style={{ marginLeft: "20px", marginBottom: "5px" }}>
                  {children}
                </li>
              ),
            },
            highlight: {
              component: ({ children }) => (
                <strong
                  style={{
                    color: "#d9702b",
                    margin: "0 5px",
                    padding: "2px",
                    backgroundColor: "#f8f8f8",
                  }}
                >
                  {children}
                </strong>
              ),
            },
            table: {
              component: ({ children }) => (
                <table
                  style={{
                    borderCollapse: "collapse",
                    border: "1px solid #ddd",
                    marginTop: "10px",
                    marginBottom: "20px",
                  }}
                >
                  {children}
                </table>
              ),
            },
            thead: {
              component: ({ children }) => (
                <thead
                  style={{
                    backgroundColor: "#f4f4f4",
                  }}
                >
                  {children}
                </thead>
              ),
            },
            tbody: {
              component: ({ children }) => (
                <tbody
                  style={{
                    backgroundColor: "#ffffff",
                  }}
                >
                  {children}
                </tbody>
              ),
            },
            tr: {
              component: ({ children }) => (
                <tr
                  style={{
                    borderBottom: "1px solid #ddd",
                  }}
                >
                  {children}
                </tr>
              ),
            },
            th: {
              component: ({ children }) => (
                <th
                  style={{
                    padding: "10px",
                    textAlign: "left",
                    fontWeight: "bold",
                    borderRight: "1px solid #ddd",
                    borderBottom: "2px solid #ddd",
                  }}
                >
                  {children}
                </th>
              ),
            },
            td: {
              component: ({ children }) => (
                <td
                  style={{
                    padding: "10px",
                    textAlign: "left",
                    borderRight: "1px solid #ddd",
                    borderBottom: "1px solid #ddd",
                  }}
                >
                  {children}
                </td>
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
