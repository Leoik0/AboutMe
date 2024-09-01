import { useState, useEffect } from "react";
import { FaTrophy, FaShareAlt } from "react-icons/fa";
import html2canvas from "html2canvas";
import bg from "../../img/bg.mp4";
import "./Rank.css";

function Rank() {
  const [ranking, setRanking] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [timeLeft, setTimeLeft] = useState(259200); // 3 dias em segundos

  useEffect(() => {
    const fetchRanking = async () => {
      try {
        const response = await fetch(
          "https://about-me-kappa-seven.vercel.app//api/users"
        );
        const data = await response.json();
        setRanking(data);
      } catch (error) {
        console.error("Error fetching ranking:", error);
      }
    };

    fetchRanking();
  }, []);

  useEffect(() => {
    const countdown = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(countdown);
  }, []);

  const formatTime = (seconds) => {
    const days = Math.floor(seconds / (3600 * 24));
    const hours = Math.floor((seconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${days}d ${hours}h ${minutes}m ${secs}s`;
  };

  const getColor = (points) => {
    if (points === 100) {
      return "#000c18"; // Azul forte
    } else if (points >= 90) {
      return "#02203d"; // Azul
    } else if (points >= 80) {
      return "#032c55"; // Azul um pouco mais fraco
    } else if (points >= 70) {
      return "#023364"; // Azul mais claro
    } else if (points >= 60) {
      return "#035f94"; // Azul bem claro
    } else if (points >= 50) {
      return "#065db9"; // Azul muito claro
    } else if (points >= 40) {
      return "#096fdb"; // Azul muito claro
    } else if (points >= 30) {
      return "#007bff"; // Azul muito claro
    } else if (points >= 20) {
      return "#0a96a0"; // Azul muito claro
    } else if (points >= 10) {
      return "#17d3c9"; // Azul muito claro
    } else {
      return "#E0F7FF"; // Quase branco, muito suave
    }
  };

  const firstPlace = ranking[0]; // Primeiro colocado

  const handleShare = async () => {
    // Captura o print da tela usando html2canvas
    const element = document.querySelector(".rank");
    const canvas = await html2canvas(element);
    canvas.toBlob((blob) => {
      const file = new File([blob], "screenshot.png", { type: "image/png" });

      // Usa a API de compartilhamento da Web para compartilhar a imagem
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        navigator
          .share({
            files: [file],
            title: "Ranking",
            text: "Confira meu resultado no ranking!",
          })
          .then(() => console.log("Compartilhado com sucesso"))
          .catch((error) => console.error("Erro ao compartilhar:", error));
      } else {
        alert("Compartilhamento não suportado nesse navegador.");
      }
    });
  };

  return (
    <div className="rank">
      <video autoPlay muted loop className="background-video">
        <source src={bg} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="rank-content">
        <div className="rank-title">
          <div className="icon-container">
            <FaTrophy
              className="rank-icon trophy"
              onClick={() => setShowModal(true)}
            />
            <span className="icon-label">Troféu</span>
          </div>
          <h1>Ranking</h1>
          <div className="icon-container">
            <FaShareAlt className="rank-icon share" onClick={handleShare} />
            <span className="icon-label">Compartilhar</span>
          </div>
        </div>

        <ul>
          {ranking.map((user, index) => (
            <li
              key={user.id}
              style={{
                backgroundColor: getColor(user.points),
              }}
            >
              <span className="rank-position">{index + 1}º lugar</span>

              <span className="user-name">{user.name}</span>
              <span className="user-points">{user.points} pontos</span>
            </li>
          ))}
        </ul>
      </div>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setShowModal(false)}>
              &times;
            </span>
            <h2>Premiação</h2>
            <p>O primeiro colocado recebe um presente misterioso</p>
            {firstPlace && (
              <div className="first-place">
                <p>{firstPlace.name}</p>
              </div>
            )}
            <div className="countdown">
              <p>Tempo restante para resgate do prêmio:</p>
              <p>{formatTime(timeLeft)}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Rank;
