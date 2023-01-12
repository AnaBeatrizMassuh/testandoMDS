import React, { useState, useEffect } from "react";
import { Input, FormStatus } from "../../components";
import styles from "./login.module.scss";
import { Context } from "../../contexts/form/form-context";
import { IValidation } from "../../protocols/IValidation";
import { IAuthentication } from "../../../domain/usecases/IAuthenticationUseCase";
import { Link, useNavigate } from "react-router-dom";
import { ISaveAccessToken } from "../../../domain/usecases/ISaveAccessTokenUseCase";

type Props = {
	validation: IValidation;
	authentication: IAuthentication;
	saveAccessToken: ISaveAccessToken;
};

type StateProps = {
	isLoading: boolean;
	isFormInvalid: boolean;
	email: string;
	password: string;
	emailError: string;
	passwordError: string;
	mainError: string;
};

const Login: React.FC<Props> = ({
	validation,
	authentication,
	saveAccessToken,
}: Props) => {
	const navigate = useNavigate();
	const [state, setState] = useState<StateProps>({
		isLoading: false,
		isFormInvalid: true,
		email: "",
		password: "",
		emailError: "",
		passwordError: "",
		mainError: "",
	});

	useEffect(() => {
		const { email, password } = state;
		const formData = { email, password };
		const emailError = validation.validate("email", formData);
		const passwordError = validation.validate("password", formData);
		setState({
			...state,
			emailError,
			passwordError,
			isFormInvalid: !!emailError || !!passwordError,
		});
	}, [state.email, state.password]);

	const handleSubmit = async (
		event: React.FormEvent<HTMLFormElement>
	): Promise<void> => {
		event.preventDefault();
		try {
			if (state.isLoading || state.isFormInvalid) {
				return;
			}
			setState({ ...state, isLoading: true });
			const account = await authentication.auth({
				email: state.email,
				password: state.password,
			});
			await saveAccessToken.save(account.accessToken);
			navigate("/");
		} catch (error) {
			setState({
				...state,
				isLoading: false,
				mainError: error.message,
			});
		}
	};

	return (
		<div className={styles.login}>
			<Context.Provider value={{ state, setState }}>
				<form
					data-testid="form"
					className={styles.form}
					onSubmit={handleSubmit}
				>
					<h1 className={styles.titile}>UnBooK</h1>
					<Input type="email" name="email" placeholder="Digite seu e-mail" />
					<Input
						type="password"
						name="password"
						placeholder="Digite sua senha"
					/>
					<button
						data-testid="submit"
						disabled={state.isFormInvalid}
						type="submit"
					>
						Entrar
					</button>
					<div className={styles.separator} />
					<div className={styles.signup}>
						Não tem uma conta?
						<Link data-testid="signup" to="/signup">
							Cadastre-se
						</Link>
					</div>
					<FormStatus />
				</form>
			</Context.Provider>
			<footer className={styles.footer}></footer>
		</div>
	);
};

export { Login };
