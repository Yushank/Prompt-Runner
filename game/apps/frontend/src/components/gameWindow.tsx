import React from "react";

export const GameWindow = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p4">
      <div className="w-full max-w-6xl">
        <iframe
          src="http://localhost:8080"
          title="Phaser Game"
          className="w-full h-96 rounded-lg shadow-2xl border-4 border-gray-300"
          style={{ minHeight: "400px" }} // ← Force minimum height
          allowFullScreen
          loading="eager" // ← Load immediately
        />
      </div>
    </div>
  );
};
