import { Routes, Route } from 'react-router-dom'
import Home  from "./screens/Home"
import LoginScreen  from "./screens/LoginScreen"

const App = () => (
  <Routes>
    <Route path="/" element={<Home />}></Route>
    <Route path="/login" element={<LoginScreen />}></Route>
  </Routes>
);

export default App;
