import { Button, Card, Space } from "antd";
import { /*GoogleAuthProvider,*/ signInWithPopup } from "firebase/auth";
import React from "react";
import { ref, set, get } from "firebase/database";

const Login = ({ auth, provider, db }) => {
  const [loading, setLoading] = React.useState(false);
  const [danger, setDanger] = React.useState(false);
  return (
    <Space
      direction="vertical"
      align="center"
      size="middle"
      style={{ display: "flex", margin: "1em" }}
    >
      <Card title="Kasa">
        <Button
          loading={loading}
          danger={danger}
          type="primary"
          onClick={() => {
            setLoading(true);
            signInWithPopup(auth, provider)
              .then((result) => {
                // This gives you a Google Access Token. You can use it to access the Google API.
                // const credential = GoogleAuthProvider.credentialFromResult(result);
                // const token = credential.accessToken;
                // The signed-in user info.
                const user = result.user;
                get(ref(db, "users/" + user.uid)).then((snapshot) => {
                  const existingUser = snapshot.val();

                  if (!existingUser) {
                    console.log("Creating new user!", user.displayName);
                    set(ref(db, "users/" + user.uid), {
                      email: user.email,
                      displayName: user.displayName,
                      role: "standard",
                      createdAt: new Date().getTime(),
                    });
                  }
                });

                setLoading(false);
              })
              .catch((error) => {
                console.log("Error when login.", error);
                // Handle Errors here.
                // const errorCode = error.code;
                // const errorMessage = error.message;
                // The email of the user's account used.
                // const email = error.customData.email;
                // The AuthCredential type that was used.
                // const credential = GoogleAuthProvider.credentialFromError(error);
                // ...
                setLoading(false);
                setDanger(true);
                setTimeout(() => setDanger(false), 1000);
              });
          }}
        >
          Zaloguj się z Google
        </Button>
      </Card>
    </Space>
  );
};

export default Login;
