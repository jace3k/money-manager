import React from "react";
import { InputNumber, Modal, Form, Input, Select } from "antd";
import FormItem from "antd/lib/form/FormItem";
import { useSelector, useDispatch } from "react-redux";
import { createNewRecordAsync, updateUserDeposit } from "./slices/userSlice";

const NewTransactionModal = ({ show, onClose }) => {
  const user = useSelector((state) => state.user.user);
  const users = useSelector((state) => state.user.users);

  const [description, setDescription] = React.useState("");
  const [selectedUser, setSelectedUser] = React.useState(user.uid);
  const [amount, setAmount] = React.useState(0);
  const dispatch = useDispatch();

  const handleSaveNewRecord = () => {
    const timestamp = new Date().getTime();
    const newRecord = {
      userID: selectedUser,
      name: users[selectedUser].displayName,
      email: users[selectedUser].email,
      description,
      amount,
      timestamp,
      key: timestamp,
    };

    // set(ref(db, 'records/' + newRecord.timestamp), newRecord)
    dispatch(createNewRecordAsync(newRecord));

    if (amount > 0) {
      dispatch(updateUserDeposit({ amount }, selectedUser));
    }

    onClose();
    setAmount(0);
    setDescription("");
    setSelectedUser(user.uid);
  };
  return (
    <Modal
      title="Nowa transakcja"
      visible={show}
      onOk={handleSaveNewRecord}
      okButtonProps={{ disabled: !description }}
      onCancel={onClose}
    >
      <Form
        onKeyDown={(e) => {
          if (e.code === "Enter" && description) {
            handleSaveNewRecord();
          }
        }}
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 14 }}
        layout="vertical"
      >
        <FormItem label="Kwota transakcji">
          <InputNumber
            value={amount}
            onChange={setAmount}
            precision={2}
            placeholder="20 zł"
            style={{ width: "100%" }}
          />
        </FormItem>
        <FormItem label="Opis">
          <Input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="wpłata, papier, płyn do naczyń.."
          />
        </FormItem>
        <FormItem label="Użytkownik">
          <Select
            defaultValue={user.uid}
            style={{ width: "100%" }}
            value={selectedUser}
            onChange={(e) => setSelectedUser(e)}
          >
            {Object.keys(users).map((userUID) => (
              <Select.Option key={userUID} value={userUID}>
                {users[userUID].displayName}
              </Select.Option>
            ))}
          </Select>
        </FormItem>
      </Form>
    </Modal>
  );
};

export default NewTransactionModal;
