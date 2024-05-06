"use client";
import CreateSpend from "@/components/createSpend/createspend";
import React, { useEffect, useState } from "react";
import styles from "./spend.module.css";
import moment from "moment";
import { Card, Tag, Space, Table, Button, Modal, Carousel, Spin } from "antd";
import AddTag from "@/components/addTransactionTag/addTag";

export default function Spend() {
  const [transactions, setTransactions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [spin, setSpin] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentRecord, setCurrentRecord] = useState({});
  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Location",
      dataIndex: "location",
      key: "location",
    },

    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (text) => <span>{parseFloat(text).toFixed(2)}</span>,
    },

    {
      title: "Tags",
      key: "tags",
      dataIndex: "tags",
      render: (tags) => (
        <>
          {tags.map((tag) => (
            <Tag color="blue" key={tag}>
              {tag}
            </Tag>
          ))}
        </>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          {(record.description || record.links?.length > 0) && (
            <Button onClick={() => showModal(record)}>View Details</Button>
          )}
        </Space>
      ),
    },
  ];

  const showModal = (record) => {
    setCurrentRecord(record);
    setIsModalVisible(true);
  };
  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const getTransactions = async () => {
    setSpin(true);
    const response = await fetch(`/api/spend?page=${currentPage}`);
    const { data, totalPages } = await response.json();
    setTransactions(data);
    // console.log(data);
    setTotalPages(totalPages);
    setSpin(false);
  };
  useEffect(() => {
    getTransactions(currentPage);
  }, [currentPage]);

  const handlePrev = () => {
    setCurrentPage((current) => Math.max(1, current - 1));
  };

  const handleNext = () => {
    setCurrentPage((current) => Math.min(totalPages, current + 1));
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.buttons}>
          <CreateSpend finish={getTransactions} />
          <AddTag />
        </div>

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
      <div className={styles.content}>
        <Spin spinning={spin}>
          {transactions.map(({ date, total, transactions }) => (
            <Card
              title={moment(date).format("YYYY-MM-DD")}
              hoverable
              extra={<strong>{total.toFixed(2)}</strong>}
              key={date}
              style={{ marginBottom: "20px" }}
            >
              <Table
                columns={columns}
                dataSource={transactions}
                showHeader={false}
                pagination={false}
              />
            </Card>
          ))}
        </Spin>
      </div>
      <Modal
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Close
          </Button>,
        ]}
      >
        {currentRecord.links?.length > 0 && (
          <Carousel arrows dots={false} infinite={false}>
            {currentRecord.links.map((item) => (
              <img
                key={item}
                alt="transaction"
                src={`https://myblogprobiotics.s3.ap-southeast-2.amazonaws.com/${item}`}
              ></img>
            ))}
          </Carousel>
        )}
        {currentRecord.description && <p>{currentRecord.description}</p>}
      </Modal>
    </div>
  );
}
