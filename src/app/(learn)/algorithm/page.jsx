"use client";
import {
  Button,
  Modal,
  Form,
  Input,
  Select,
  List,
  Row,
  Col,
  Tag,
  Spin,
} from "antd";
import React, { useState, useEffect } from "react";
import useMarkdownEditor from "@/hook/MarkdownEditor";
import MdEditor from "react-markdown-editor-lite";
import styles from "./algorithm.module.css";
import "react-markdown-editor-lite/lib/index.css";
import Link from "next/link";
const { Option } = Select;

const tagColor = {
  easy: "green",
  medium: "orange",
  hard: "red",
};

export default function Algorithm() {
  const [data, setData] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const { markdown, setMarkdown, mdParser, handleEditorChange } =
    useMarkdownEditor();
  const [form] = Form.useForm();
  const [selectedTags, setSelectedTags] = useState([]);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [detail, setDetail] = useState(null);
  const [tags, setTags] = useState([]);
  const [selectedSearchTags, setSelectedSearchTags] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      console.log(values);
      const formData = new FormData();
      for (var key in values) {
        formData.append(key, values[key]);
      }
      formData.append("markdown", markdown);
      await fetch("/api/algorithm", {
        method: "POST",
        body: formData,
      });

      setIsModalOpen(false);
      form.resetFields();
      setMarkdown("");
      getAlgorithms();
    } catch (error) {
      console.log("Error uploading data:", error);
    }
  };

  const fetchItemsWithTagsContainingLe = () => {};
  const getTags = async () => {
    const response = await fetch("/api/algorithm/tags");
    const { data } = await response.json();
    setTags(data);
  };
  useEffect(() => {
    getTags();
  }, []);
  const getAlgorithms = async (currentPage) => {
    setIsSpinning(true);
    const response = await fetch(`/api/algorithm?page=${currentPage}`);
    const { data, totalPages } = await response.json();

    console.log(data);
    setData(data);
    setTotalPages(totalPages);
    setIsSpinning(false);
  };
  useEffect(() => {
    getAlgorithms(currentPage);
  }, [currentPage]);
  const showModal = (item) => {
    setDetail(item);
    setIsDetailModalOpen(true);
  };

  const handlePrev = () => {
    setCurrentPage((current) => Math.max(1, current - 1));
  };

  const handleNext = () => {
    setCurrentPage((current) => Math.min(totalPages, current + 1));
  };
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Button onClick={() => setIsModalOpen(true)}>Add solution</Button>
        <Select
          mode="multiple"
          allowClear
          style={{
            width: "220px",
            margin: "0 20px",
          }}
          placeholder="Please select"
          defaultValue={[]}
          onChange={(tags) => {
            setSelectedSearchTags(tags);
          }}
          options={tags.map((item) => ({
            value: item.tagID,
            label: item.tag,
          }))}
        />

        <Button onClick={fetchItemsWithTagsContainingLe} type="primary">
          Search
        </Button>
        <div>
          <Button
            style={{ marginRight: "10px" }}
            onClick={handlePrev}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <Button onClick={handleNext} disabled={currentPage === totalPages}>
            Next
          </Button>
        </div>
      </div>
      <Modal
        open={isModalOpen}
        onOk={handleOk}
        onCancel={() => {
          setIsModalOpen(false);
        }}
      >
        <Form form={form}>
          <Form.Item name="tags">
            <Select
              placeholder="Select Tags"
              mode="multiple"
              onChange={(tags) => {
                setSelectedTags(tags);
              }}
              options={tags.map((item) => ({
                value: item.tagID,
                label: item.tag,
              }))}
            />
          </Form.Item>
          <Form.Item
            name="description"
            rules={[
              {
                required: true,
                message: "Please input Intro",
              },
            ]}
          >
            <Input.TextArea showCount maxLength={100} />
          </Form.Item>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item name="difficulty">
                <Select placeholder="Select Difficulty">
                  <Option value="easy">Easy</Option>
                  <Option value="medium">Medium</Option>
                  <Option value="hard">Hard</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col>
              <Form.Item name="link">
                <Input placeholder="Link" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item>
            <MdEditor
              style={{ height: "300px" }}
              value={markdown}
              renderHTML={(text) => mdParser.render(text)}
              onChange={handleEditorChange}
            />
          </Form.Item>
        </Form>
      </Modal>

      <Spin spinning={isSpinning}>
        <List
          itemLayout="horizontal"
          dataSource={data}
          renderItem={(item) => {
            const displayText = `${item.description}`;

            return (
              <List.Item
                onClick={() => showModal(item)}
                className="custom-list-item"
              >
                {item.tags.map((item, index) => (
                  <Tag key={index}>{item}</Tag>
                ))}
                <Tag color={tagColor[item.difficulty]}>{item.difficulty}</Tag>
                <List.Item.Meta title={displayText} />
                <Link href={item.link} onClick={(e) => e.stopPropagation()}>
                  Link
                </Link>
              </List.Item>
            );
          }}
        />
      </Spin>
      <Modal
        open={isDetailModalOpen}
        onCancel={() => {
          setIsDetailModalOpen(false);
        }}
        footer={null}
        width={720}
        className="modal-content"
      >
        {detail && (
          <div
            dangerouslySetInnerHTML={{
              __html: mdParser.render(detail.markdown),
            }}
          />
        )}
      </Modal>
    </div>
  );
}
