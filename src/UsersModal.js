import React, { useState } from 'react';
import { ref, set } from "firebase/database";
import { InputNumber, Modal, Form, Input, Select, Table, Button } from "antd";
import FormItem from "antd/lib/form/FormItem";
import { db } from './config/firebase'
import { useSelector, useDispatch } from 'react-redux'
import { createNewRecordAsync } from './slices/userSlice';

const UsersModal = ({ show, onClose }) => {
  const user = useSelector(state => state.user.user)
  const users = useSelector(state => state.user.users)
  const [editModeRecord, setEditModeRecord] = useState(null)

  const isEditMode = (id) => id === editModeRecord

  const dispatch = useDispatch()


  const handleSave = () => {
    // TODO
    console.log('handleSaveNewRecord!!')

  }


  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id'
    },
    {
      title: 'E-mail',
      dataIndex: 'email',
      key: 'email'
    },
    {
      title: 'Nazwa',
      dataIndex: 'displayName',
      key: 'displayName'
    },
    {
      title: 'Poziom uprawnień',
      dataIndex: 'role',
      key: 'role'
    },
    {
      title: 'Utworzony',
      dataIndex: 'createdAt',
      key: 'createdAt'
    },
    {
      title: 'Akcja',
      dataIndex: 'id',
      key: 'action',
      render: userID => {
        if (isEditMode(userID)) {
          //render button ok and cancel
          return (
            <>
              <Button
                onClick={() => {
                  setEditModeRecord(null)
                  // save action
                }}
              >
                Zapisz
              </Button>
              <Button
                onClick={() => setEditModeRecord(null)}
              >
                Anuluj
              </Button>
            </>
          )
        }
        else {
          // render button edit
          return (
            <>
              <Button
                onClick={() => setEditModeRecord(userID)}
              >
                Edytuj
              </Button>
              <Button
                onClick={() => {}}
              >
                Usuń
              </Button>
            </>
          )
        }
      }
    }
  ]
  return (
    <Modal
      title='Użytkownicy'
      visible={show}
      onOk={handleSave}
      // okButtonProps={{ disabled: !description }}
      onCancel={onClose}
      width={1000}
    >
      <Table
        size="small"
        columns={columns}
        dataSource={Object.values(users).map(user => ({ key: user.id, ...user }))}
        pagination={{ position: ['bottomCenter'], pageSize: 5 }}
      />
      {/* <Form
        onKeyDown={e => {
          if (e.code === 'Enter' && description) {
            handleSave()
          }
        }}
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 14 }}
        layout="vertical"
      >
        <FormItem label="Kwota transakcji">
          <InputNumber value={amount} onChange={setAmount} precision={2} placeholder="20 zł" style={{ width: '100%' }} />
        </FormItem>
        <FormItem label="Opis">
          <Input
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder='wpłata, papier, płyn do naczyń..'
          />
        </FormItem>
        <FormItem
          label="Użytkownik"
        >
          <Select defaultValue={user.uid} style={{ width: '100%' }} value={selectedUser} onChange={e => setSelectedUser(e)}>
            {Object.keys(users).map(userUID => (
              <Select.Option key={userUID} value={userUID}>{users[userUID].displayName}</Select.Option>
            ))}
          </Select>
        </FormItem>
      </Form> */}
    </Modal>
  )
}

export default UsersModal;