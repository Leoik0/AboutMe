/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import questions from "../../data/questions";
import balloon from "../../img/balaol.png"; // Adicione a imagem do balão de conversa
import "./Questionnaire.css";

const specialPoints = 30; // Pontos para uma resposta especial

function Questionnaire({ userInfo, onComplete }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [totalPoints, setTotalPoints] = useState(0);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    const answered = localStorage.getItem("answered");
    if (answered) {
      setShowResult(true);
    }
  }, []);

  const handleAnswer = (points) => {
    setTotalPoints(totalPoints + points);
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResult(true);
      localStorage.setItem("answered", "true");
    }
  };

  const handleFinish = () => {
    const updatedUserInfo = { ...userInfo, points: totalPoints };
    fetch(`http://localhost:5000/api/users/${userInfo.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ points: totalPoints }),
    })
      .then((response) => response.json())
      .then((data) => {
        localStorage.setItem("answered", "true");
        onComplete();
      })
      .catch((error) => {
        console.error("Erro ao atualizar dados do usuário:", error);
      });
  };

  if (showResult) {
    return (
      <div className="result-container">
        <div className="result-content">
          <h1 className="result-heading">
            {userInfo.name}, sua pontuação final é:{" "}
            <span className="result-points">{totalPoints}</span>
          </h1>
          <p className="result-message">
            {totalPoints >= specialPoints
              ? "Parabéns! Você atingiu uma pontuação especial!"
              : "Obrigado por participar!"}
          </p>
          <button onClick={handleFinish} className="result-button">
            Ver Ranking
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="questionnaire">
      <span className="question-number">{currentQuestion + 1}</span>
      <div className="container">
        <div className="box-question">
          <div className="balloon">
            <img src={balloon} alt="Balloon" className="balloon-img" />
            <div className="question-content">
              <h2>{questions[currentQuestion].phrase}</h2> {/* Exibe a frase */}
            </div>
          </div>
          <img
            src={questions[currentQuestion].avatar}
            alt="Avatar"
            className="avatar"
          />
        </div>
        <div className="answers">
          <div className="answers-header">
            <h3>{questions[currentQuestion].question}</h3>
          </div>
          <div>
            <ul>
              {questions[currentQuestion].answers.map((answer, index) => (
                <li key={index}>
                  <button onClick={() => handleAnswer(answer.points)}>
                    {answer.text}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Questionnaire;
