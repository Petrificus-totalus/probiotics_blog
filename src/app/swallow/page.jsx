"use client";
import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Button, Upload, Rate, Row, Col } from "antd";
import { UploadOutlined } from "@ant-design/icons";

import styles from "./swallow.module.css";
import Image from "next/image";

export default function Swallow() {
  const [swallowers, setSwallowers] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    const getAvatars = async () => {
      const response = await fetch("/api/swallow/avatar");
      const { data } = await response.json();
      setSwallowers(data);
    };
    getAvatars();
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

      // if (response.ok) {
      //   const data = await response.json();
      //   console.log("Record added successfully:", data);
      //   setIsModalVisible(false);
      //   form.resetFields();
      // } else {
      //   console.error("Failed to add record");
      // }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerbar}>
          <span className={styles.title}>Top Devourers</span>
          <input className={styles.search} type="text" />
          <span className={styles.add} onClick={showModal}>
            add
          </span>
        </div>
        <div className={styles.headercontent}>
          {swallowers.map((item) => (
            <div className={styles.rank} key={item.swallowID}>
              <Image
                src={item.avatar}
                width={100}
                height={100}
                style={{ boxShadow: "1px 1px 2px black", borderRadius: "50%" }}
              />
              <span>{item.point}</span>
            </div>
          ))}
        </div>
      </div>
      <div className={styles.content}></div>
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
                <Rate />
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
