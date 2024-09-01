import { useState, useEffect } from "react";
import UserInfo from "./components/UserInfo/UserInfo";
import Questionnaire from "./components/Questionnaire/Questionnaire";
import Rank from "./components/Rank/Rank";
import "./App.css";

function App() {
  const [userInfo, setUserInfo] = useState(null);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    // Verifique se o questionário já foi concluído
    const answered = localStorage.getItem("answered");
    if (answered === "true") {
      setCompleted(true);
    }
  }, []);

  const handleUserInfoSubmit = (info) => {
    setUserInfo(info);
  };

  const handleCompletion = () => {
    setCompleted(true);
  };

  if (completed) {
    return <Rank />;
  }

  return (
    <div className="App">
      {!userInfo ? (
        <UserInfo onSubmit={handleUserInfoSubmit} />
      ) : (
        <Questionnaire userInfo={userInfo} onComplete={handleCompletion} />
      )}
    </div>
  );
}

export default App;
