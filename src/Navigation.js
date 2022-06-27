import React from 'react';
import { Button, PageHeader } from "antd";
import Loader from './Loader';
import NewTransactionModal from './NewTransactionModal';
import { useSelector, useDispatch } from 'react-redux'
import { loginAsync, logoutAsync } from './slices/userSlice';
import UsersModal from './UsersModal';


const Navigation = ({ authStateChanged }) => {
  const [showNewTransaction, setShowNewTransaction] = React.useState(false);
  const [showUsersModal, setShowUsersModal] = React.useState(false);
  const user = useSelector(state => state.user.user)
  const loginLoading = useSelector(state => state.user.loginLoading)
  const dispatch = useDispatch()

  const extra = [];

  if (user) {
    extra.push(
      <Button
        key={1}
        onClick={() => {
          dispatch(logoutAsync())
        }}
      >
        Wyloguj
      </Button>
    )
  }
  else {
    extra.push(
      <Button
        key={2}
        loading={loginLoading}
        type="primary"
        onClick={() => {
          dispatch(loginAsync())
        }}
      >
        Zaloguj
      </Button>
    )
  }

  if (user && user.role === 'admin') {
    extra.push(
      <Button
        key={3}
        onClick={() => {
          setShowNewTransaction(true)
        }}
      >
        Nowa transakcja
      </Button>
    );

    extra.push(
      <Button
        key={4}
        onClick={() => {
          setShowUsersModal(true)
        }}
      >
        Użytkownicy
      </Button>
    )

  }

  extra.reverse();

  return (
    <PageHeader
      title="Skarbówka"
      subTitle={user
        ? `Witaj ${user.displayName}!`
        : 'Witaj!'
      }
      extra={authStateChanged ? extra : <Loader />}
    >
      {user && user.role === 'admin' && (
        <>
          <NewTransactionModal
            show={showNewTransaction}
            onClose={() => setShowNewTransaction(false)}
          />
          <UsersModal
            show={showUsersModal}
            onClose={() => setShowUsersModal(false)}
          />
        </>
      )}
    </PageHeader>
  )
}

export default Navigation;