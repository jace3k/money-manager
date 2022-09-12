import React, { useMemo } from "react";
import { Table, Button } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { removeRecordAsync } from "./slices/userSlice";

const TransactionHistoryTable = ({ showUser }) => {
  const user = useSelector((state) => state.user.user);
  const records = useSelector((state) => state.user.records);
  const dispatch = useDispatch();

  const columns = useMemo(
    () => [
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
    ],
    [showUser, user?.role]
  );

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

  if (showUser) {
    columns.unshift({
      title: "Osoba",
      dataIndex: "name",
      key: "name",
    });
  }

  return (
    <Table
      size="small"
      columns={columns}
      dataSource={records}
      pagination={{ position: ["bottomCenter"], pageSize: 5 }}
    />
  );
};

export default TransactionHistoryTable;
