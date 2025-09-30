import React from "react";
import { GameWindow } from "./components/gameWindow";

function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Prompt-Runner Game
        </h1>
        <p className="text-lg text-gray-600">
          Use Arrow Keys to move the characters
        </p>
      </div>
      <div className="w-full max-w-6xl">
        <GameWindow />
      </div>
    </div>
  );
}

export default App;
