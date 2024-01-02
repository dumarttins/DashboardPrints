import React, { useState } from "react";
import axios from "axios";
import './Dashboard.modulo.css';


export default function Dashboard() {
  const [dados, setDados] = useState([]);


  const pushValueToner = async () => {
    try {
      const response = await axios.get('http://localhost:3001/');
      setDados(response.data);
    } catch (error) {
      console.error('Erro ao obter dados do servidor:');
    }
    console.log(dados);
  };

  return (
    <>
      <header>
        <div className="title">
          <img className="imgLogo" src="Imagens/marca_chromos_V2.png" alt="Chromos" />
          <a></a>
        </div>
      </header>
      <main>
        <div className="divButtonTable">
          <div className="body_Dash">
            <form action="">
              <table>
                <thead>
                  <tr>
                    <th colspan="4">Impressoras P&B</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th>Unidade</th>
                    <th>IP</th>
                    <th>Número Serial</th>
                    <th>Toner</th>
                  </tr>
                    {
                      dados.map(imp => (
                        <tr>
                          <th>{imp.place}</th>
                          <th>{imp.ip}</th>
                          <th>{imp.serie}</th>
                          <th className="toners">
                            <div style={{ width: `${imp.toner}`, backgroundColor: '#000000', height: '20px', color: 'grey' }}>
                            </div>
                            <div>{imp.toner}</div>
                          </th>
                        </tr>
                      ))
                      }
                </tbody>
              </table>
            </form>
          </div>
          <div>
            <button onClick={pushValueToner}>Refrash</button>
          </div>
        </div>

      </main>
    </>
  );
}