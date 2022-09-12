/* eslint-disable no-unused-vars */
import { Button, Table } from "antd";
import React, { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addNextCleaningRecord } from "./slices/userSlice";

const getFromToDate = (firstDayMs) => {
  const firstDay = new Date(firstDayMs);
  const lastDayMs = firstDayMs + 6 * 24 * 60 * 60 * 1000;
  const lastDay = new Date(lastDayMs);
  const from = `${firstDay.getDate()}.${firstDay.getMonth() + 1}`;
  const to = `${lastDay.getDate()}.${lastDay.getMonth() + 1}`;
  return `${from} - ${to}`;
};

const CleaningScheduleTable = () => {
  const dispatch = useDispatch();
  const users = useSelector((state) => state.user.users);
  const user = useSelector((state) => state.user.user);
  const localActivities = useSelector((state) => state.user.activities);
  const localCleaningSchedule = useSelector(
    (state) => state.user.cleaningSchedule
  );

  const generateRecord = () => {
    const cleaningScheduleKeys = Object.keys(localCleaningSchedule);
    if (!cleaningScheduleKeys.length) return;

    const lastSortedKey =
      cleaningScheduleKeys.sort()[cleaningScheduleKeys.length - 1];

    // generate new key (first day of week date in ms)
    const sevenDays = 7 * 24 * 60 * 60 * 1000;
    const lastDateMs = parseInt(lastSortedKey);
    const nextWeekFirstDayMs = lastDateMs + sevenDays;
    // console.log(new Date(nextWeekFirstDayMs));

    // generate new activities
    const amountOfActivities = Object.keys(localActivities).length;
    const usersActivities = { ...localCleaningSchedule[lastSortedKey] };
    // console.log(usersActivities);

    const newUsersActiv = Object.keys(usersActivities).reduce(
      (newUsersActivities, userId) => {
        const activity = usersActivities[userId];
        newUsersActivities[userId] =
          activity < amountOfActivities ? activity + 1 : 1;

        return newUsersActivities;
      },
      {}
    );

    // saving next week to db
    dispatch(addNextCleaningRecord(nextWeekFirstDayMs, newUsersActiv));
  };

  const data = Object.keys(localCleaningSchedule)
    .map((dateKey) => {
      const rowUsers = localCleaningSchedule[dateKey];
      return { key: dateKey, dateKey: parseInt(dateKey), ...rowUsers };
    })
    .filter((row) => {
      const rowDate = new Date(row.dateKey).getTime();
      const now = new Date().getTime();
      const difference = now - rowDate;
      const sevenDays = 7 * 24 * 60 * 60 * 1000;
      return difference < sevenDays;
    });

  const columns = useMemo(() => {
    const result = Object.values(users).map((user) => ({
      title: user.displayName,
      dataIndex: user.id,
      key: user.id,
      render: (text) =>
        localActivities[text] || `Nieznana aktywność (id=${text})`,
    }));

    return [
      {
        title: "Tydzień",
        dataIndex: "dateKey",
        key: "dateKey",
        render: getFromToDate,
      },
    ].concat(result);
  }, [users, localActivities]);

  return (
    <div>
      {user && user.role === "admin" && (
        <Button onClick={generateRecord}>Wygeneruj nowy tydzień</Button>
      )}
      <Table
        size="small"
        bordered
        columns={columns}
        dataSource={data}
        pagination={{ position: ["bottomCenter"], pageSize: 10 }}
        rowClassName={(row) => {
          const firstDay = new Date(row.dateKey).getTime();
          const now = new Date().getTime();
          const difference = firstDay - now;

          if (difference < 0) return "highlightCurrentWeek";
        }}
      />
    </div>
  );
};

export default CleaningScheduleTable;
