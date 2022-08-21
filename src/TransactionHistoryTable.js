import React from "react";
import { Table, Button } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { removeRecordAsync } from "./slices/userSlice";

const TransactionHistoryTable = () => {
  const user = useSelector((state) => state.user.user);
  const records = useSelector((state) => state.user.records);
  const dispatch = useDispatch();
  // TODO: useMemo
  const columns = [
    {
      title: "Osoba",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Opis",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Transakcja",
      dataIndex: "amount",
      key: "amount",
      render: (text) => `${text} zł`,
    },
    {
      title: "Data",
      dataIndex: "timestamp",
      key: "timestamp",
      render: (text) => new Date(text).toLocaleString(),
    },
  ];

  if (user && user.role === "admin") {
    columns.push({
      title: "Akcja",
      dataIndex: "timestamp",
      key: "action",
      render: (timestampID) => (
        <Button
          onClick={() => {
            dispatch(removeRecordAsync(timestampID));
          }}
        >
          X
        </Button>
      ),
    });
  }

  return (
    <Table
      columns={columns}
      dataSource={records}
      pagination={{ position: ["bottomCenter"], pageSize: 5 }}
    />
  );
};

export default TransactionHistoryTable;
