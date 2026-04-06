import { Route, Routes } from "react-router-dom"
import AppPage from "./pages/appPage"
import LandingPage from "./pages/landing"


function App() {

  return (
   <Routes>
      <Route path="/" element={<LandingPage/>}/>
      <Route path="/app" element={<AppPage/>}/>
   </Routes>   
  )
}

export default App
