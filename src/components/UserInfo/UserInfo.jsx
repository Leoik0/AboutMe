import { useState } from "react";
import gojo from "../../img/gojo.png";
import "./UserInfo.css";

// eslint-disable-next-line react/prop-types
function UserInfo({ onSubmit }) {
  const [name, setName] = useState("");
  const [showModal, setShowModal] = useState(false);

  const bannedWords = [
    "puta",
    "vagabunda",
    "vagabundo",
    "puto",
    "vadia",
    "cadela",
    "cadelinha",
    "cu",
    "ku",
    "buceta",
    "pau",
    "porra",
    "merda",
    "xoxota",
    "trouxa",
    "caralho",
    "desgraça",
    "filho da puta",
    "vagabundagem",
    "arrombado",
    "piranha",
    "pula-pula",
    "bunda",
    "bosta",
    "bostinha",
    "pinto",
    "viado",
    "mermão",
    "cacete",
    "trampa",
    "cabeludo",
    "foda",
    "filha da puta",
    "vaca",
    "otário",
    "bichona",
    "pepeca",
    "saco",
    "capeta",
    "desgraçado",
    "farrapo",
    "xibiu",
    "cocô",
    "arrombada",
    "traveco",
    "burro",
    "cuzão",
    "defunto",
    "pederasta",
    "bicha",
    "macaco",
    "negão",
    "pauleira",
    "cachorra",
    "caô",
    "cabeleira",
    "enrolado",
    "xinga",
    "peste",
    "putinha",
    "bafo",
    "bucetinha",
    "puta velha",
    "maria mijona",
    "boceta",
    "bicho",
    "zorra",
    "cuzona",
    "esgoto",
    "porcaria",
    "cabecinha",
    "marmita",
    "vacilona",
    "paleio",
    "bostona",
    "panaca",
    "cachorrona",
    "xexelenta",
    "encosto",
    "podre",
    "palhaço",
    "desprezível",
    "merdosa",
    "cretina",
    "moribunda",
    "podrão",
    "cachorrão",
    "putona",
    "mijada",
    "pica",
    "pau no cu",
    "cuzinho",
    "pêra",
    "píula",
    "pimpolho",
    "boceta",
    "viadagem",
    "vagabundagem",
    "teta",
    "demonio",
    "merdoso",
    "mijada",
    "craco",
    "cagão",
    "cretino",
    "mijado",
    "porcaria",
    "carneirona",
    "foder",
    "cachorrada",
    "aberto",
    "porralhona",
    "boceta",
    "bunda",
    "boceta",
    "bocetinha",
    "arrombado",
    "xoxota",
    "xingar",
    "bichona",
    "vaca",
    "piranha",
    "xoxota",
    "boceta",
    "merda",
    "putona",
    "vagabunda",
    "marmita",
    "cabelo",
    "piranha",
    "desgraça",
    "vacilona",
    "cretena",
    "frouxo",
    "desprezível",
    "peste",
    "porcaria",
    "puceta",
    "vaca",
    "porralhona",
    "boceta",
    "bunda",
    "peste",
    "merda",
    "putinha",
    "vagabunda",
    "bicha",
    "peste",
    "desgraça",
    "xoxota",
    "bunda",
    "putinha",
    "boceta",
    "cabeluda",
    "merda",
    "porra",
    "vaca",
    "bunda",
    "caralho",
    "xingar",
    "bichona",
    "desgraça",
    "piranha",
    "boceta",
    "arrombada",
    "putinha",
    "xibiu",
    "boceta",
    "cachorra",
    "vaca",
    "bunda",
    "cabelo",
    "porcalhona",
    "merda",
    "xoxota",
    "peste",
    "putona",
  ];

  // Função para verificar se o nome contém palavras ofensivas
  const containsBannedWords = (name) => {
    const lowercasedName = name.toLowerCase();
    return bannedWords.some((word) =>
      lowercasedName.includes(word.toLowerCase())
    );
  };

  const handleSubmit = async () => {
    if (!name) {
      alert("Por favor, preencha todos os campos: nome.");
      return;
    }

    if (containsBannedWords(name)) {
      alert("O nome contém palavras ofensivas. Por favor, escolha outro nome.");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);

    try {
      const response = await fetch(
        "https://about-me-lac-iota.vercel.app/api/users",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();
      onSubmit(data);
    } catch (error) {
      console.error("Error submitting user info:", error);
    }
  };

  const handleModalOpen = () => setShowModal(true);
  const handleModalClose = () => setShowModal(false);

  return (
    <div className="user-info">
      <img className="img-user-info" src={gojo} alt="" />
      <div className="input-container">
        <input
          type="text"
          placeholder=" "
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={20}
        />
        <label>Seu nome</label>
      </div>
      <div className="submit-button" onClick={handleSubmit}>
        Enviar
      </div>
      <p className="rules-link" onClick={handleModalOpen}>
        Regras do site
      </p>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Regras do Site</h2>
            <ul>
              <li>Não use nomes ofensivos ou inapropriados.</li>
              <li>
                Respeite as regras de comportamento e os termos de serviço.
              </li>
              <li>Qualquer violação pode levar a ban imediato.</li>
              <li>Não flode contas, leve na brincadeira esportiva.</li>
            </ul>
            <button className="modal-close" onClick={handleModalClose}>
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserInfo;
