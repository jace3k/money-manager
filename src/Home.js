import React, { useState } from "react";
import { Row, Col, Progress, Table, Avatar, Badge, Divider, Button } from "antd";
import { useSelector, useDispatch } from 'react-redux'
import { removeRecordAsync, setAccountBalance } from "./slices/userSlice";

// const BADGE_COLOR_NON_COMPLIANT = '#d46b08'
const BADGE_COLOR_COMPLIANT = '#595959'
const AVATAR_COLOR_COMPLIANT = '#52c41a'
const AVATAR_COLOR_NON_COMPLIANT = '#d46b08'

const Home = () => {
  const balance = useSelector(state => state.user.balance)
  const users = useSelector(state => state.user.users)
  const user = useSelector(state => state.user.user)
  const localMaxValue = useSelector(state => state.user.max)
  const records = useSelector(state => state.user.records)
  const [userDepositMap, setUserDepositMap] = useState({})

  const getUserDepositsMap = () => Object.keys(users)
    .reduce((depositMap, userID) => {
      const userTotalDeposit = records.reduce(
        (acc, record) =>
          record.userID === userID && record.amount > 0
            ? acc + record.amount
            : acc,
        0
      )
      depositMap[userID] = userTotalDeposit.toFixed(2)
      return depositMap
    }, {})

  const getColorBasedOnDeposit = (userID) => {
    const maxDeposit = Math.max(...Object.values(userDepositMap))

    if (userDepositMap[userID] < maxDeposit)
      return AVATAR_COLOR_NON_COMPLIANT

    return AVATAR_COLOR_COMPLIANT
  }

  const dispatch = useDispatch()

  const columns = [
    {
      title: 'Osoba',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: 'Opis',
      dataIndex: 'description',
      key: 'description'
    },
    {
      title: 'Transakcja',
      dataIndex: 'amount',
      key: 'amount',
      render: text => `${text} zł`
    },
    {
      title: 'Data',
      dataIndex: 'timestamp',
      key: 'timestamp',
      render: text => new Date(text).toLocaleString()
    }
  ]

  if (user && user.role === 'admin') {
    columns.push({
      title: 'Akcja',
      dataIndex: 'timestamp',
      key: 'action',
      render: timestampID => (
        <Button
          onClick={() => {
            dispatch(removeRecordAsync(timestampID))
          }}
        >
          X
        </Button>
      )
    })
  }

  React.useEffect(() => {
    const totalValue = records.reduce((total, record) => total += record.amount, 0);
    dispatch(setAccountBalance(totalValue));
  }, [records])

  React.useEffect(() => {
    const depositMap = getUserDepositsMap();
    setUserDepositMap(depositMap)
  }, [users, records])

  return (
    <div>
      <Row style={{ textAlign: 'center', margin: '1em' }}>
        <Col span={24}>
          <h1>Saldo</h1>
          <Progress type="circle" percent={Math.ceil(balance * 100 / localMaxValue)} format={_ => `${balance.toFixed(2)} zł`} />
          <Divider />
        </Col>
      </Row>
      <Row style={{ textAlign: 'center', margin: '1em' }}>
        <Col span={24}>
          <h2>Status wpłat</h2>
        </Col>
      </Row>
      <Row style={{ margin: '1em', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        {
          Object.keys(users).map(userID => (
            <Col key={userID} style={{ margin: '1em' }}>
              <Badge
                count={`${userDepositMap[userID]} zł`}
                offset={[-30, 0]}
                style={{ backgroundColor: BADGE_COLOR_COMPLIANT }}
              >
                <Avatar
                  shape="square"
                  size={64}
                  style={{ backgroundColor: getColorBasedOnDeposit(userID) }}
                >
                  {users[userID].displayName}
                </Avatar>
              </Badge>
            </Col>
          ))
        }
      </Row>

      <Row style={{ margin: '1em' }}>
        <Col span={24}>
          <Divider />
          <Table
            columns={columns}
            dataSource={records}
            pagination={{ position: ['bottomCenter'], pageSize: 5 }}
          />
        </Col>
      </Row>
    </div>
  )
}

export default Home;