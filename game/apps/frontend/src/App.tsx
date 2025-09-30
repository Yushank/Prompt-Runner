import React from "react";
import "./App.css";

function App() {
  return (
    <div className="">
      <header className="header">
        <h1>Prompt-Runner Game</h1>
        <p>Use Arrow Keys to move the characters</p>
      </header>

      <main className="main-content">
        <div className="game-container">
          <iframe
            src="http://localhost:8080"
            title="Phaser Game"
            className="game-frame"
          />
        </div>

        <div className="info-panel">
          <h2>Game Info</h2>
          <ul>
            <li>Character: Blue Cirlce</li>
            <li>Controls: Left/Right arrow keys</li>
            <li>Speed: 200 pixels/second</li>
          </ul>
        </div>
      </main>
    </div>
  );
}

export default App;
