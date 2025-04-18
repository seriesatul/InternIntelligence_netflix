import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";

// import axios from "axios";

// axios.defaults.baseURL = "http://localhost:5000"; // or the actual port your backend is on
// axios.defaults.withCredentials = true; // if using cookies/sessions


ReactDOM.createRoot(document.getElementById("root")).render(
	<React.StrictMode>
		<BrowserRouter>
			<App />
		</BrowserRouter>
	</React.StrictMode>
);