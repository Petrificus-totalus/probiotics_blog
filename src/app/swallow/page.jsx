"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { Modal, Form, Input, Button, Upload, Rate, Row, Col } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import Masonry from "react-masonry-css";

import styles from "./swallow.module.css";
import Image from "next/image";
import { swallowMasonryCol } from "@/lib/constant";

import Review from "@/components/swallowreview/review";

export default function Swallow() {
  const contentRef = useRef(null);

  const [swallowers, setSwallowers] = useState([]);
  const [reviews, setReviews] = useState([]);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [lastScrollTop, setLastScrollTop] = useState(0); // 记录上次滚动的位置

  useEffect(() => {
    const getAvatars = async () => {
      const response = await fetch("/api/swallow/avatar");
      const { data } = await response.json();
      setSwallowers(data);
    };
    getAvatars();
  }, []);
  const getReviews = async (page) => {
    setLoading(true);
    const response = await fetch(`/api/swallow/review?page=${page}`);
    const { data } = await response.json();
    setReviews(data);
    setLoading(false);
  };
  useEffect(() => {
    getReviews(1);
  }, []);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };
  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  const handleFinish = async (values) => {
    const formData = new FormData();
    console.log(values);

    values.images?.forEach((file) => {
      formData.append("file", file.originFileObj);
    });
    formData.append("restaurantName", values.restaurantName);
    formData.append("rating", values.rating);
    formData.append("reviewerName", values.reviewerName);
    formData.append("summary", values.summary);
    formData.append("review", values.review);

    try {
      const response = await fetch("/api/swallow/add", {
        method: "POST",
        body: formData,
      });
      // console.log(response);

      if (response.ok) {
        const data = await response.json();
        console.log("Record added successfully:", data);
        setIsModalVisible(false);
        form.resetFields();
        getReviews(1);
      } else {
        console.error("Failed to add record");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  const loadMoreData = useCallback(async () => {
    setLoading(true);
    const response = await fetch(`/api/swallow/review?page=${currentPage + 1}`);
    const { data: newData } = await response.json();
    setReviews((prevData) => [...prevData, ...newData]);
    setCurrentPage((currentPage) => currentPage + 1);
    setLoading(false);
  }, [currentPage]);
  const onScroll = useCallback(() => {
    const contentElement = contentRef.current;
    if (contentElement) {
      const scrollTop = contentElement.scrollTop ?? 0;
      const isScrollingDown = scrollTop > lastScrollTop;

      setLastScrollTop(scrollTop);

      if (
        isScrollingDown &&
        contentElement.scrollTop + contentElement.clientHeight >=
          contentElement.scrollHeight - 10
      ) {
        if (!loading) {
          loadMoreData();
        }
      }
    }
  }, [loading, lastScrollTop, loadMoreData]);

  useEffect(() => {
    const contentElement = contentRef.current;
    if (contentElement) {
      contentElement.addEventListener("scroll", onScroll);
    }
    return () => {
      if (contentElement) {
        contentElement.removeEventListener("scroll", onScroll);
      }
    };
  }, [onScroll]);

  return (
    <div className={styles.container} ref={contentRef}>
      <div className={styles.header}>
        <div className={styles.headerbar}>
          <span className={styles.title}>Top Devourers</span>
          <input className={styles.search} type="text" />
          <span className={styles.add} onClick={showModal}>
            add
          </span>
        </div>
        <div className={styles.headercontent}>
          {swallowers
            .sort((a, b) => b.point - a.point)
            .map((item) => (
              <div className={styles.rank} key={item.swallowID}>
                <Image
                  src={item.avatar}
                  width={100}
                  height={100}
                  style={{
                    boxShadow: "1px 1px 2px black",
                    borderRadius: "50%",
                  }}
                />
                <span>{item.point}</span>
              </div>
            ))}
        </div>
      </div>
      <div className={styles.content}>
        <Masonry
          breakpointCols={swallowMasonryCol}
          className="my-masonry-grid"
          columnClassName="my-masonry-grid_column"
        >
          {reviews.map((item) => (
            <div key={item.reviewID}>
              <Review params={item} />
            </div>
          ))}
        </Masonry>
      </div>
      <Modal
        title="Add Review"
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form form={form} onFinish={handleFinish} layout="vertical">
          <Form.Item
            name="restaurantName"
            label="Restaurant Name"
            rules={[
              { required: true, message: "Please input the restaurant name!" },
            ]}
          >
            <Input />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="rating"
                label="Rating"
                rules={[
                  { required: true, message: "Please rate the restaurant!" },
                ]}
              >
                <Rate allowHalf />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="reviewerName"
                label="Reviewer Name"
                rules={[{ required: true, message: "Please input your name!" }]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            name="summary"
            label="Summary"
            rules={[{ required: true, message: "Please input a summary!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="review"
            label="Review"
            rules={[{ required: true, message: "Please input your review!" }]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item
            name="images"
            label="Upload Images"
            valuePropName="fileList"
            getValueFromEvent={normFile}
          >
            <Upload
              name="images"
              listType="picture"
              multiple
              beforeUpload={() => false}
            >
              <Button icon={<UploadOutlined />}>Select Images</Button>
            </Upload>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
