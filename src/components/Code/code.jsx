import React, { useState, useEffect } from "react";
import CopyToClipboard from "react-copy-to-clipboard";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { tomorrow } from "react-syntax-highlighter/dist/esm/styles/prism";
import { CopyIcon } from "@/components/assets/icons";
import styles from "./code.module.css";
export default function Code({ children, language }) {
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => {
      setCopied(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, [copied]);
  return (
    <div className={styles.container}>
      <CopyToClipboard text={children} onCopy={() => setCopied(true)}>
        <span className={styles.icon}>{copied ? "copied" : <CopyIcon />}</span>
      </CopyToClipboard>
      <SyntaxHighlighter language={language} style={tomorrow}>
        {children}
      </SyntaxHighlighter>
    </div>
  );
}
