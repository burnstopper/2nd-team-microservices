import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import reportWebVitals from "./reportWebVitals";

import Header from "./Components/Menu/Header/Header";
import Form from "./Components/Form/form";

const root = ReactDOM.createRoot(document.getElementById("root"));
let id = Math.floor(Math.random() * 1000000 + 10000000);
root.render(
	<>
		<Header />
		<Form id={id} />
	</>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
