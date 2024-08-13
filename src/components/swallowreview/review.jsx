import Image from "next/image";
import React from "react";
import styles from "./review.module.css";
import { Rate } from "antd";

export default function Review({ params, showDetail }) {
  const handleClick = async () => {
    const response = await fetch(
      `/api/swallow/review/reviewPics?reviewID=${params.reviewID}`
    );
    const { data } = await response.json();
    const item = {
      ...params,
      imgs: [params.coverimage, ...data.map((item) => item.link)],
    };
    showDetail(item);
    // console.log(data);
  };
  return (
    <div className={styles.reviewCard} onClick={() => handleClick()}>
      <Image
        src={`https://myblogprobiotics.s3.ap-southeast-2.amazonaws.com/${params.coverimage}`}
        width={140}
        height={140}
        className={styles.coverImage}
        alt="Cover Image"
      />
      <div className={styles.info}>
        <div className={styles.restaurant}>{params.restaurant}</div>
        <div className={styles.rating}>
          <Rate
            className={styles.rate}
            disabled
            count={params.rating}
            value={params.rating}
            allowHalf
          />
        </div>
        <div className={styles.summary}>{params.summary}</div>
        <div className={styles.userDetails}>
          <Image
            src={params.avatar}
            width={40}
            height={40}
            className={styles.avatar}
            alt="Avatar"
          />
          <div className={styles.username}>{params.username}</div>
        </div>
      </div>
    </div>
  );
}
