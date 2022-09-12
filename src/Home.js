import React, { useState } from "react";
import {
  Row,
  Col,
  Progress,
  Avatar,
  Badge,
  Divider,
  Collapse,
  Checkbox,
} from "antd";
import { useSelector, useDispatch } from "react-redux";
import { setAccountBalance } from "./slices/userSlice";
import TransactionHistoryTable from "./TransactionHistoryTable";
import CleaningScheduleTable from "./CleaningScheduleTable";
import CartTable from "./CartTable";

// const BADGE_COLOR_NON_COMPLIANT = '#d46b08'
const BADGE_COLOR_COMPLIANT = "#595959";
const AVATAR_COLOR_COMPLIANT = "#52c41a";
const AVATAR_COLOR_NON_COMPLIANT = "#d46b08";

const Home = () => {
  const balance = useSelector((state) => state.user.balance);
  const users = useSelector((state) => state.user.users);
  const localMaxValue = useSelector((state) => state.user.max);
  const localInitialBalance = useSelector((state) => state.user.initialBalance);
  const localCart = useSelector((state) => state.user.cart);
  const records = useSelector((state) => state.user.records);
  const [userDepositMap, setUserDepositMap] = useState({});
  const [showUser, setShowUser] = useState(false);

  const getUserDepositsMap = () =>
    Object.keys(users).reduce((depositMap, userID) => {
      const userTotalDeposit = records.reduce(
        (acc, record) =>
          record.userID === userID && record.amount > 0
            ? acc + record.amount
            : acc,
        0
      );
      depositMap[userID] = userTotalDeposit.toFixed(2);
      return depositMap;
    }, {});

  const getColorBasedOnDeposit = (userID) => {
    const maxDeposit = Math.max(...Object.values(userDepositMap));

    if (userDepositMap[userID] < maxDeposit) return AVATAR_COLOR_NON_COMPLIANT;

    return AVATAR_COLOR_COMPLIANT;
  };

  const dispatch = useDispatch();

  React.useEffect(() => {
    const totalValue = records.reduce(
      (total, record) => (total += record.amount),
      0
    );
    dispatch(setAccountBalance(localInitialBalance + totalValue));
  }, [records, localInitialBalance]);

  React.useEffect(() => {
    const depositMap = getUserDepositsMap();
    setUserDepositMap(depositMap);
  }, [users, records]);

  return (
    <div>
      <Row style={{ textAlign: "center", margin: "1em" }}>
        <Col span={24}>
          <h1>Saldo</h1>
          <Progress
            type="circle"
            percent={Math.ceil((balance * 100) / localMaxValue)}
            format={() => `${balance.toFixed(2)} zł`}
          />
          <Divider />
        </Col>
      </Row>
      <Row style={{ textAlign: "center", margin: "1em" }}>
        <Col span={24}>
          <h2>Status wpłat</h2>
        </Col>
      </Row>
      <Row
        style={{
          margin: "1em",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {Object.keys(users).map((userID) => (
          <Col key={userID} style={{ margin: "1em" }}>
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
        ))}
      </Row>

      <Row style={{ margin: "1em" }}>
        <Col span={24}>
          <Collapse>
            <Collapse.Panel header="Historia wpłat i wypłat">
              <Checkbox
                checked={showUser}
                onChange={(e) => setShowUser(e.target.checked)}
              >
                Pokaż osobę
              </Checkbox>
              <Divider />
              <TransactionHistoryTable showUser={showUser} />
            </Collapse.Panel>

            <Collapse.Panel header="Lista zakupowa">
              <CartTable data={localCart} />
            </Collapse.Panel>
          </Collapse>
          <Divider />
        </Col>
      </Row>

      <Row style={{ textAlign: "center", margin: "1em" }}>
        <Col span={24}>
          <h1>Grafik sprzątania</h1>
          <Divider />
          <CleaningScheduleTable />
        </Col>
      </Row>
    </div>
  );
};

export default Home;
