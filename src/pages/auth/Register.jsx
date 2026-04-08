import { Link } from "react-router-dom";


export default function Register(){
  return(
    <>
      <nav className="navbar fixed-top">
        <div className="navbar-logo">
          <Link to="/">
            <img src="/img/logo.png" alt="logo" />
          </Link>
        </div>
      </nav>
    </>
  );
}