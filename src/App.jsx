import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import RecipeDetailsPage from './pages/RecipeDetailsPage';
import FavoritesPage from './pages/FavoritesPage';
import CookingTimer from './components/timer/CookingTimer';
import { FavoritesProvider } from './context/FavoritesContext';
import { TimerProvider } from './context/TimerContext';
import ScrollToTop from './components/common/ScrollToTop';
import { NavigationProvider } from './context/NavigationContext';
import { SearchProvider } from './context/SearchContext';
import { ScrollProvider } from './context/ScrollContext';
import { NotificationProvider } from './context/NotificationContext'; // Add this import

const App = () => {
  return (
    <NotificationProvider> {/* Add the NotificationProvider as the outermost wrapper */}
      <Router>
        <FavoritesProvider>
          <TimerProvider>
            <NavigationProvider>
              <SearchProvider>
                <ScrollProvider>
                  <div className="w-full bg-[#3D405B] min-h-screen text-[#F4F1DE] relative overflow-x-hidden">
                    <Routes>
                      <Route path="/" element={<HomePage />} />
                      <Route path="/recipe/:id" element={<RecipeDetailsPage />} />
                      <Route path="/favorites" element={<FavoritesPage />} />
                    </Routes>
                  </div>
                  <CookingTimer />
                  <ScrollToTop />
                </ScrollProvider>
              </SearchProvider>
            </NavigationProvider>
          </TimerProvider>
        </FavoritesProvider>
      </Router>
    </NotificationProvider>
  );
};

export default App;