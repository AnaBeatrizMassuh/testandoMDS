import React, { useEffect, useState } from "react";
import { Input, FormStatus } from "../../components";
import styles from "./signup.module.scss";
import { Context } from "../../contexts/form/form-context";
import { Link } from "react-router-dom";
import { IValidation } from "../../protocols/IValidation";
import { IAddAccount } from "../../../domain/usecases/IAddAccountUseCase";

type Props = {
	validation: IValidation;
	addAccount: IAddAccount;
};

type StateProps = {
	isLoading: boolean;
	name: string;
	email: string;
	password: string;
	passwordConfirmation: string;
	nameError: string;
	emailError: string;
	passwordError: string;
	passwordConfirmationError: string;
	mainError: string;
};

const SignUp: React.FC<Props> = ({ validation, addAccount }: Props) => {
	const [state, setState] = useState<StateProps>({
		isLoading: false,
		name: "",
		email: "",
		password: "",
		passwordConfirmation: "",
		nameError: "",
		emailError: "",
		passwordError: "",
		passwordConfirmationError: "",
		mainError: "",
	});

	useEffect(() => {
		setState({
			...state,
			nameError: validation.validate("name", state.name),
			emailError: validation.validate("email", state.email),
			passwordError: validation.validate("password", state.password),
			passwordConfirmationError: validation.validate(
				"passwordConfirmation",
				state.passwordConfirmation
			),
		});
	}, [state.name, state.email, state.password, state.passwordConfirmation]);

	const handleSubmit = async (
		event: React.FormEvent<HTMLFormElement>
	): Promise<void> => {
		if (
			state.isLoading ||
			state.emailError ||
			state.passwordError ||
			state.nameError ||
			state.passwordConfirmationError
		) {
			return;
		}
		event.preventDefault();
		setState({ ...state, isLoading: true });
		await addAccount.add({
			name: state.name,
			email: state.email,
			password: state.password,
			passwordConfirmation: state.passwordConfirmation,
		});
	};

	return (
		<div className={styles.signup}>
			<Context.Provider value={{ state, setState }}>
				<form
					data-testid="form"
					onSubmit={handleSubmit}
					className={styles.form}
				>
					<h1 className={styles.titile}>Cadastra-se</h1>
					<Input type="text" name="name" placeholder="Digite seu nome" />
					<Input type="email" name="email" placeholder="Digite seu e-mail" />
					<Input
						type="password"
						name="password"
						placeholder="Digite sua senha"
					/>
					<Input
						type="password"
						name="passwordConfirmation"
						placeholder="Repita sua senha"
					/>
					<button
						data-testid="submit"
						disabled={
							!!state.nameError ||
							!!state.emailError ||
							!!state.passwordError ||
							!!state.passwordConfirmationError
						}
						type="submit"
					>
						Cadastrar
					</button>
					<div className={styles.separator} />
					<div className={styles.login}>
						Já possui uma conta?
						<Link to="/login">Entrar</Link>
					</div>
					<FormStatus />
				</form>
			</Context.Provider>
			<footer className={styles.footer}></footer>
		</div>
	);
};

export { SignUp };
