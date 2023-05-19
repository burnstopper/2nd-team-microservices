import React, { useState, useEffect } from "react";
import "./radio.css";
import "./styles.css";
import axios from "axios";
import LoadingScreen from "react-loading-screen";
import { Spinner } from "react-bootstrap";

import CookieLib from "../../cookielib/index";

let localization = {
	date_of_birth: "дату рождения",
	gender: "пол",
	years_of_work: "стаж",
};

let speciality = [
	"Администратор",
	"Аналитик",
	"Архитектор",
	"Дизайнер",
	"Менеджер",
	"Разработчик",
	"Студент ИТ-специальности",
	"Тестировщик",
	"Сотрудник технической поддержки",
];
function calculateAge(birthday) {
	// birthday is h3 date
	var ageDifMs = Date.now() - birthday;
	if (ageDifMs < 0) return -1;
	var ageDate = new Date(ageDifMs); // miliseconds from epoch
	return Math.abs(ageDate.getUTCFullYear() - 1970);
}

export default function Form() {
	const [params, setParams] = useState({ loading: true });
	const [another, setAnother] = useState(null);
	const [token, setToken] = useState(null);
	useEffect(() => {
		async function data() {
			let tok = CookieLib.getCookieToken();
			if (!tok) {
				tok = await axios.post("/api/get-token").then((x) => x.data);
				CookieLib.setCookieToken(tok);
			}
			setToken(tok);
			setParams({
				...((await axios
					.get("/api/fetch-results", {
						params: {
							respondent_token: tok,
						},
					})
					.then((x) => x.data)
					.then((x) => {
						if (!speciality.includes(x.speciality)) {
							setAnother(x.speciality);
							x.speciality = "";
						}
						return x;
					})
					.catch(() => {})) || { speciality: speciality[0] }),
				loading: false,
			});
		}
		data();
	}, []);

	function setWork(e) {
		setParams({ ...params, speciality: e.target.value });
		if (e.target.value === "") setAnother("");
		else setAnother(null);
	}
	/**
	 *
	 * @param {String} str
	 * @returns
	 */
	function rebuildBirth(str) {
		if (str.length <= 2) return str;
		str = str.replace("/", "");
		return `${str.slice(0, 2)}/${str.slice(2, 6)}`;
	}

	async function submit() {
		let uncheck = ["gender", "date_of_birth", "years_of_work"].filter(
			(x) => !params[x] || params[x] === ""
		);
		if (uncheck.length !== 0)
			return alert(
				`Вы не ввели: ${uncheck.map((x) => localization[x]).join(", ")}`
			);

		let birth = new Date(
			params.date_of_birth.slice(0, 2) +
				"/01/" +
				params.date_of_birth.slice(3, 7)
		);

		if (
			params.date_of_birth.length < 7 ||
			isNaN(birth) ||
			calculateAge(birth) <= 0
			// || calculateAge(birth) > 90
		)
			return alert("Вы ввели неправильную дату");

		if (isNaN(params.years_of_work))
			return alert("Вы ввели неправильно число лет работы");
		if (
			(!params.speciality || params.speciality === "") &&
			(!another || another === "")
		)
			return alert("Вы не ввели специальность");

		// console.log({
		// 	date_of_birth: params.date_of_birth,
		// 	gender: params.gender,
		// 	speciality: params.speciality === "" ? another : params.speciality,
		// 	years_of_work: Number(params.years_of_work),
		// });

		let resp = await axios.post(`/api/submit?respondent_token=${token}`, {
			date_of_birth: params.date_of_birth,
			gender: params.gender,
			speciality: params.speciality === "" ? another : params.speciality,
			years_of_work: Number(params.years_of_work),
		});

		if (resp.status === 200) return alert("Все прошло успешно");
		else return alert(resp.statusText);
	}

	return params.loading ? (
		<>
			{" "}
			<LoadingScreen
				loading={true}
				bgColor="#E7E2E2"
				spinnerColor="#ff7f50"
				textColor="#676767"
			></LoadingScreen>
			<Spinner animation="border" role="status">
				<span className="sr-only">Loading...</span>
			</Spinner>
			<div
				id="loading"
				style={{
					backgroundImage:
						"url('https://cdn.discordapp.com/h3 ttachments/1081428905082245130/1081484406549651517/ezgif-5-d1da3f96d7.gif') no-repeat center center fixed",
				}}
			></div>
		</>
	) : (
		<div class="parent">
			<div id="upTile">
				<h3 id="text">Форма анкеты</h3>

				{/* <button id="btnBack" onclick=""></button> */}
			</div>

			<h3 id="quizText">Пол:</h3>

			<div class="wrapper">
				<input
					type="radio"
					name="select"
					id="option-1"
					checked={params.gender === "male"}
					onClick={() => setParams({ ...params, gender: "male" })}
				/>
				<input
					type="radio"
					name="select"
					id="option-2"
					checked={params.gender === "female"}
					onClick={() => setParams({ ...params, gender: "female" })}
				/>
				<label for="option-1" class="option option-1">
					<div class="dot"></div>
					<span>Мужской</span>
				</label>
				<label for="option-2" class="option option-2">
					<div class="dot"></div>
					<span>Женский</span>
				</label>
			</div>

			<div id="quizTile">
				<div id="createQuizTile1" class="row">
					<h3 id="quizText">Дата рождения (в формате месяц/год)</h3>
					<input
						id="search"
						type="text"
						placeholder="Месяц/год"
						value={params.date_of_birth}
						onChange={(e) =>
							setParams({
								...params,
								date_of_birth: rebuildBirth(e.target.value),
							})
						}
					/>
				</div>

				<div id="createQuizTile1" class="row">
					<h3 id="quizText">Специальность</h3>
					<select id="select" onChange={setWork} value={params.speciality}>
						{speciality.map((x) => (
							<option key={x} value={x}>
								{x}
							</option>
						))}
						<option value="">Другое</option>
					</select>
				</div>

				{another != null ? (
					<div id="createQuizTile1" class="row">
						<h3 id="quizText">Другое</h3>
						<input
							id="search"
							type="text"
							placeholder="Ваша специальность"
							value={another}
							onChange={(e) => setAnother(e.target.value)}
						/>
					</div>
				) : (
					<></>
				)}

				<div id="createQuizTile1" class="row">
					<h3 id="quizText">Текущий профессиональный стаж в годах</h3>
					<input
						id="search"
						type="text"
						placeholder="Количество"
						value={params.years_of_work}
						onChange={(e) =>
							setParams({
								...params,
								years_of_work: e.target.value.slice(0, 2),
							})
						}
					/>
				</div>
			</div>

			<div id="downTile">
				<button id="btnPlay" onClick={submit}>
					Сохранить
				</button>
			</div>
		</div>
	);
}
