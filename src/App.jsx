import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/clerk-react";

import Navbar from "./Navbar";
import HomePage from "./pages/home";
import LoginPage from "./pages/login"; 
import Footer from "./Footer";

const App = () => {
  return (
    <div className="min-h-screen w-screen flex flex-col">
      <BrowserRouter>
        <Navbar />

        <main className="flex-1">
          <Routes>
            <Route
              path="/"
              element={
                // <SignedIn>
                //   <HomePage/>
                // </SignedIn>
                <HomePage/>
              }
            />
            <Route
              path="/"
              element={
                <SignedOut>
                  <RedirectToSignIn />
                </SignedOut>
              }
            />
            <Route path="/login-signup" element={<LoginPage />} />
          </Routes>
        </main>

        <Footer />
      </BrowserRouter>
    </div>
  );
};

export default App;
