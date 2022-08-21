import { useEffect, useState, Fragment } from "react";
import { useNavigate } from "react-router-dom";
import Login from "../components/Login";

import Signup from "../components/Signup";

const Home = () => {
  const [signupOrLogin, setSignupOrLogin] = useState("signup");

  const navigate = useNavigate();
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo") as string);

    if (user) navigate("/chat", { replace: true });
  }, [navigate]);

  return (
    <Fragment>
      {signupOrLogin === "signup" ? (
        <Signup setSignupOrLogin={setSignupOrLogin} />
      ) : (
        <Login setSignupOrLogin={setSignupOrLogin} />
      )}
    </Fragment>
  );
};

export default Home;
