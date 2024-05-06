"use client";
import UploadSpend from "@/components/createSpend/createspend";
import React, { useEffect, useState } from "react";
import styles from "./spend.module.css";
import moment from "moment";
import { Card, Tag, Space, Table, Button, Modal, Carousel, Spin } from "antd";

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
        {(record.description || record.image?.length > 0) && (
          <Button>View Details</Button>

          // <Button onClick={() => showModal(record)}>View Details</Button>
        )}
      </Space>
    ),
  },
];
export default function Spend() {
  const [transactions, setTransactions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [spin, setSpin] = useState(false);

  const getTransactions = async () => {
    setSpin(true);
    const response = await fetch(`/api/spend?page=${currentPage}`);
    const { data, totalPages } = await response.json();
    setTransactions(data);
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
        <UploadSpend />
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
    </div>
  );
}
