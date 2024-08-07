import Image from "next/image";
import React from "react";
import styles from "./review.module.css";

export default function Review({ params }) {
  return (
    <div className={styles.reviewCard}>
      <Image
        src={`https://myblogprobiotics.s3.ap-southeast-2.amazonaws.com/${params.coverimage}`}
        width={140}
        height={140}
        className={styles.coverImage}
        alt="Cover Image"
      />
      <div className={styles.info}>
        <div className={styles.restaurant}>{params.restaurant}</div>
        <div className={styles.rating}>Rating: {params.rating}</div>
        <div className={styles.summary}>{params.summary}</div>
        <div className={styles.username}>{params.username}</div>
      </div>
      <Image
        src={params.avatar}
        width={60}
        height={60}
        className={styles.avatar}
        alt="Avatar"
      />
    </div>
  );
}
