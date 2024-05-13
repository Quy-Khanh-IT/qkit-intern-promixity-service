"use client";
import Navbar from "./components/Navbar";
import StarsCanvas from "./components/canvas/Star";
import "./not-found.scss";
export default function NotFound() {
  return (
    <div className="vh-100 main-container ">
      <Navbar />
      <div className="h-100 w-100 d-flex flex-column justify-content-center align-items-center not-found-wrapper">
        <img src="./images/404-not-found.png" alt="404" />
        <div className="not-fount-content d-flex flex-column justify-content-center align-items-center">
          <h2 className="text-center">Oh Man, Error 404</h2>
          <span>Sorry, the page you looking for is in hiding.</span>
          <button className="mt-5 btn btn-primary">Back to home page</button>
        </div>
      </div>
      <StarsCanvas />
    </div>
  );
}
