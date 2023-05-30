import React, { Component } from "react";
import "./Quiz.css";
import CookieLib from "../../../cookielib/index";
import axios from "axios";
import LoadingScreen from "react-loading-screen";
import { Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useParams, Navigate } from "react-router-dom";

function withParams(Component) {
	return (props) => <Component {...props} params={useParams()} />;
}

class Quiz extends Component {
	constructor(props) {
		super(props);
		this.state = {
			quiz_id: this.props.params.quiz,
			loading: true,
		};
	}

	async createToken() {
		let token = await axios
			.post("/api/token/create_respondent")
			.then((x) => x.data.respondent_token)
			.catch((e) =>
				alert(
					e.response.data?.detail ||
						e.response.data?.detail ||
						e.response.statusText
				)
			);
		CookieLib.setCookieToken(token);
		return token;
	}

	async getQuiz() {
		let quiz = await axios
			.get(`/api/quizzes/${this.state.quiz_id}`, {
				params: {
					respondent_id: this.state.id,
				},
			})
			.then((x) => x.data)
			.catch((e) =>
				alert(
					e.response.data?.detail ||
						e.response.data?.detail ||
						e.response.statusText
				)
			);

		if (quiz)
			quiz = {
				...quiz,
				template: await axios
					.get(`/api/templates/${quiz.template_id}`)
					.then((x) => x.data)
					.catch((e) =>
						alert(
							e.response.data?.detail ||
								e.response.data?.detail ||
								e.response.statusText
						)
					),
				results: await axios
					.get(`/api/results/${quiz.id}`, {
						params: {
							respondent_id: this.state.id,
						},
					})
					.then((x) => x.data.tests_result)
					.catch((e) =>
						alert(
							e.response.data?.detail ||
								e.response.data?.detail ||
								e.response.statusText
						)
					),
			};

		let tests = await axios
			.get(`/api/tests`)
			.then((x) => x.data)
			.catch((e) =>
				alert(
					e.response.data?.detail ||
						e.response.data?.detail ||
						e.response.statusText
				)
			);

		this.setState({ quiz, tests, loading: false });
	}

	async checkPermission() {
		let check = await axios
			.get(`/api/quizzes/${this.state.quiz_id}/check_access`, {
				params: {
					respondent_id: this.state.id,
				},
			})
			.then((x) => x.data.has_access)
			.catch((e) =>
				alert(
					e.response.data?.detail ||
						e.response.data?.detail ||
						e.response.statusText
				)
			);
		// let check = true;
		this.setState({ check }, this.getQuiz.bind(this));
	}

	componentDidMount() {
		let getData = {
			getToken: async () => {
				let token = CookieLib.getCookieToken();
				if (!token || token === undefined || token === "undefined")
					token = await this.createToken();

				let id = await axios
					.get(`/api/token/${token}/id`)
					.then((x) => x.data.respondent_id)
					.catch((e) =>
						alert(
							e.response.data?.detail ||
								e.response.data?.detail ||
								e.response.statusText
						)
					);

				if (!id) token = await this.createToken();

				this.setState({ token, id }, this.checkPermission);
			},
		};
		async function start() {
			for (let i of Object.keys(getData)) {
				await getData[i]();
			}
		}
		start.bind(this)();
	}

	render() {
		return this.state.loading ? (
			<>
				<LoadingScreen
					loading={true}
					bgColor="#E7E2E2"
					spinnerColor="#ff7f50"
					textColor="#676767"
				></LoadingScreen>
				<Spinner animation="border" role="status">
					<span className="sr-only">Loading...</span>
				</Spinner>
			</>
		) : this.state.check && this.state.quiz?.name ? (
			<div className="parent">
				<div id="upTile">
					<p id="text">{this.state.quiz.name}</p>
					<p id="desc">{this.state.quiz.description}</p>
				</div>

				<div id="btnTile">
					{this.state.quiz.template.tests.map((x, i) => {
						if (
							i === 0 ||
							this.state.quiz.results.find(
								(y) => y.id === this.state.quiz.template.tests[i - 1]
							)?.results.length > 0
						)
							return (
								<Link
									id="btnQuiz"
									style={{ textDecoration: "none" }}
									to={`${
										this.state.tests.find((y) => y.id === x.id).url
									}?quiz_id=${x.id}&redirect_url=${window.location.href}`}
									key={i}
								>
									<div className="btnQuizComponents">
										<a id="titleTiles">
											{this.state.quiz.results[x]?.length > 0 ? "✔️" : "⏱️"}{" "}
											{this.state.tests.find((y) => y.id === x.id).name}
										</a>
										{/* <span className="icon">
											{this.state.quiz.results[x]?.length > 0 ? "✔️" : "⏱️"}
										</span> */}
									</div>
								</Link>
							);
						else
							return (
								<div id="btnQuizDis" key={i}>
									<div className="btnQuizComponents" styles={{ width: "80%" }}>
										<a id="titleTiles">
											🔒 {this.state.tests.find((y) => y.id === x.id).name}
										</a>
										{/* <span class="icon">🔒</span> */}
									</div>
								</div>
							);
					})}
				</div>
			</div>
		) : (
			<Navigate to="/quizzes" replace={true} />
		);
	}
}

export default withParams(Quiz);
