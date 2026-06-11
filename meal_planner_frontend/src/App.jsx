import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import Landing from './pages/Landing/Landing'
import Preferences from './pages/Preferences/Preferences'
import MealPlan from './pages/MealPlan/MealPlan'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/preferences" element={<Preferences />} />
        <Route path="/mealplan" element={<MealPlan />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  )
}

export default App
