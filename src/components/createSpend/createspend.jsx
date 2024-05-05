"use client";
import React, { useState } from "react";
import { Modal, Button, Form, Input, DatePicker, Select, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import moment from "moment";
import Item from "antd/es/list/Item";
const { Option } = Select;

const UploadSpend = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [tags, setTags] = useState([]);

  const showModal = async () => {
    setIsModalOpen(true);
    const response = await fetch("/api/tags");
    const { data } = await response.json();
    setTags(data);
    console.log(data);
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();

      //   const response = await fetch("/api/spend");
      //   const data = await response.json();
      //   console.log(data);

      // 上传所有图片并获取它们的 URL
      //   const uploadImagePromises = fileList.map(async (file) => {
      //     const imageRef = ref(storage, `spendItem/${file.name}`);
      //     await uploadBytes(imageRef, file.originFileObj);
      //     return getDownloadURL(imageRef);
      //   });

      //   // 等待所有图片上传完成
      //   const imageUrls = await Promise.all(uploadImagePromises);

      //   const firestoreDate = values.date
      //     ? Timestamp.fromDate(values.date.toDate())
      //     : null;

      //   values.image = imageUrls;
      if (!values.description) values.description = "";
      //   values.date = values.date.toDate();
      values.date = moment(values.date.toDate()).format("YYYY-MM-DD");
      const formData = new FormData();
      for (var key in values) {
        formData.append(key, values[key]);
      }

      await fetch("/api/spend", {
        method: "POST",
        body: formData,
      });
      //   console.log(values);

      // 添加数据到 Firestore，包括图片 URLs
      //   await addDoc(collection(db, "transactions"), {
      //     ...values,
      //     date: firestoreDate,
      //     // images: imageUrls, // 存储所有图片的 URLs
      //   });

      setIsModalOpen(false);
      form.resetFields();
      setFileList([]);
    } catch (error) {
      console.log("Error uploading data:", error);
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const handleUploadChange = ({ fileList }) => {
    setFileList(fileList);
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
                <Option value={item.tag} key={item.tagID}>
                  {item.tag}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="description" label="Description">
            <Input.TextArea />
          </Form.Item>
          <Form.Item name="image" label="Upload Image">
            <Upload
              beforeUpload={() => false}
              listType="picture"
              multiple={true}
              onChange={handleUploadChange}
            >
              <Button icon={<UploadOutlined />}>
                Click to upload (optional)
              </Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default UploadSpend;
