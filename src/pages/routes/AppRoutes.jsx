
import { Route, Routes } from "react-router-dom";
import Landing from "../Landing";
import Register from "../auth/Register";

export default function AppRoutes(){
  return(
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/auth/register" element={<Register />}/>
    </Routes>
  );
}