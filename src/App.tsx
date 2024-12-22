import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { GameProvider } from './contexts/GameContext';
import { HomeScreen } from './screens/HomeScreen';
import { QuizScreen } from './screens/QuizScreen';
import { ResultsScreen } from './screens/ResultsScreen';
import { Header } from './components/Header';
import { AuthModal } from './components/AuthModal';

export default function App() {
  const [showAuthModal, setShowAuthModal] = useState(false);

  return (
    <AuthProvider>
      <GameProvider>
        <BrowserRouter>
          <div className="min-h-screen bg-gray-100">
            <Header onOpenAuth={() => setShowAuthModal(true)} />
            <Routes>
              <Route path="/" element={<HomeScreen />} />
              <Route path="/quiz" element={<QuizScreen />} />
              <Route path="/results" element={<ResultsScreen />} />
            </Routes>
            <AuthModal 
              isOpen={showAuthModal} 
              onClose={() => setShowAuthModal(false)} 
            />
          </div>
        </BrowserRouter>
      </GameProvider>
    </AuthProvider>
  );
}