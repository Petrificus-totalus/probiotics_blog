"use client";
import React, { useState } from "react";
import { Modal, Button, Form, Input, DatePicker, Select, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import moment from "moment";
import S3UploadForm from "@/components/S3UploadForm/uploadForm";

const { Option } = Select;

const UploadSpend = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [tags, setTags] = useState([]);
  const [files, setFiles] = useState([]);

  const showModal = async () => {
    setIsModalOpen(true);
    const response = await fetch("/api/tags");
    const { data } = await response.json();
    setTags(data);
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();

      // if (!values.description) values.description = "";
      // values.date = moment(values.date.toDate()).format("YYYY-MM-DD");
      // const formData = new FormData();
      // for (var key in values) {
      //   formData.append(key, values[key]);
      // }

      // await fetch("/api/spend", {
      //   method: "POST",
      //   body: formData,
      // });

      // setIsModalOpen(false);
      // form.resetFields();
      // setFileList([]);
    } catch (error) {
      console.log("Error uploading data:", error);
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Button type="primary" onClick={showModal}>
        Add Transaction
      </Button>
      <Modal
        title="Add Transaction"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="date" label="Purchase Date">
            <DatePicker />
          </Form.Item>
          <Form.Item name="title" label="title" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item
            name="location"
            label="Location"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="price" label="Price" rules={[{ required: true }]}>
            <Input type="number" />
          </Form.Item>
          <Form.Item name="tags" label="Tags">
            <Select mode="multiple" placeholder="Select tags">
              {tags.map((item) => (
                <Option value={item.tagID} key={item.tagID}>
                  {item.tag}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="description" label="Description">
            <Input.TextArea />
          </Form.Item>
        </Form>
        <S3UploadForm setFiles={setFiles} />
        {files.map((item) => (
          <div key={item}>{item}</div>
        ))}
      </Modal>
    </>
  );
};

export default UploadSpend;
