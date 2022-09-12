/* eslint-disable no-unused-vars */
import { Button, Input, Table } from "antd";
import React, { useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { updateCart } from "./slices/userSlice";

const CartTable = ({ data }) => {
  const dispatch = useDispatch();
  const [newCartItem, setNewCartItem] = useState("");

  const onRemoveFromCart = (text) => {
    console.log("removing", text, data);
    const newList = data.filter((item) => item !== text);
    console.log(newList);
    dispatch(updateCart(newList));
  };

  const handleAddCartItem = () => {
    if (data.includes(newCartItem)) return;

    const newList = [...data, newCartItem];
    dispatch(updateCart(newList));
    setNewCartItem("");
  };

  const columns = useMemo(
    () => [
      {
        title: "Rzecz do kupienia",
        dataIndex: "item",
        key: "item",
      },
      {
        title: "Akcja",
        dataIndex: "item",
        key: "action",
        render: (text) => {
          return <Button onClick={() => onRemoveFromCart(text)}>usuń</Button>;
        },
      },
    ],
    [data]
  );

  return (
    <div>
      <Table
        size="small"
        dataSource={data.map((item) => ({ item, key: item }))}
        columns={columns}
        pagination={{
          position: ["bottomCenter"],
          pageSize: 10,
          hideOnSinglePage: true,
        }}
      />
      <div>
        <Input.Group
          compact
          style={{
            textAlign: "center",
            margin: "0.5rem",
          }}
        >
          <Input
            value={newCartItem}
            onChange={(e) => setNewCartItem(e.target.value)}
            placeholder="papier toaletowy, płyn do naczyń"
            style={{
              width: "calc(100% - 200px)",
              minWidth: "150px",
            }}
          />
          <Button type="primary" onClick={handleAddCartItem}>
            Dodaj
          </Button>
        </Input.Group>
      </div>
    </div>
  );
};

export default CartTable;
