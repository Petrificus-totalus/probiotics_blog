import React from "react";
import { tagColor } from "@/lib/constant";
import styles from "./algoCard.module.css";
import { Tag } from "antd";
import Link from "next/link";

export default function Algorithmcard({ params, showDetail }) {
  const { description, tags, difficulty, link } = params;
  return (
    <div className={styles.container} onClick={() => showDetail(params)}>
      <div className={styles.desc}>{description}</div>
      <div className={styles.content1}>
        <div className={styles.difficulty}>
          <Tag color={tagColor[difficulty]}>{difficulty}</Tag>
        </div>
        {link !== '""' && link !== "undefined" && (
          <Link href={link} onClick={(e) => e.stopPropagation()}>
            Link
          </Link>
        )}
      </div>
      <div className={styles.content2}>
        <div className={styles.tag}>
          {tags.map((item, index) => (
            <Tag key={index}>{item}</Tag>
          ))}
        </div>
      </div>
    </div>
  );
}
