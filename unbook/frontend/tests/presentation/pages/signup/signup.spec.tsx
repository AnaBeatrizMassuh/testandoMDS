import React from "react";
import {
	RenderResult,
	act,
	cleanup,
	fireEvent,
	render,
	waitFor,
} from "@testing-library/react";
import { ValidationStub } from "../../mocks/validation";
import { faker } from "@faker-js/faker";
import { BrowserRouter } from "react-router-dom";
import { SignUp } from "../../../../src/presentation/pages/signup/signup";
import {
	populateField,
	testButtonIsDisabled,
	testChildCount,
	testElementText,
	testStatsForField,
} from "../../mocks/form-helper";
import { AddAccountSpy } from "../../mocks/add-account/mock-add-account";
import { EmailInUseError } from "../../../../src/domain/errors/EmailInUseError";
import { vi } from "vitest";
import { SaveAccessTokenMock } from "../../mocks/validation/mock-save-access-token";

interface ISutTypes {
	sut: RenderResult;
	addAccountSpy: AddAccountSpy;
	saveAccessTokenMock: SaveAccessTokenMock;
}

type SutParams = {
	validationError: string;
};

const makeSut = (params?: SutParams): ISutTypes => {
	const validationStub = new ValidationStub();
	validationStub.errorMessage = params?.validationError;
	const addAccountSpy = new AddAccountSpy();
	const saveAccessTokenMock = new SaveAccessTokenMock();
	const sut = render(
		<BrowserRouter>
			<SignUp
				validation={validationStub}
				addAccount={addAccountSpy}
				saveAccessToken={saveAccessTokenMock}
			/>
		</BrowserRouter>
	);
	return {
		sut,
		addAccountSpy,
		saveAccessTokenMock,
	};
};

const simulateValidSubmit = async (
	sut: RenderResult,
	name = faker.name.firstName(),
	email = faker.internet.email(),
	password = faker.internet.password()
): Promise<void> => {
	populateField(sut, "name", name);
	populateField(sut, "email", email);
	populateField(sut, "password", password);
	populateField(sut, "passwordConfirmation", password);
	const form = sut.getByTestId("form");
	act(() => {
		fireEvent.submit(form);
	});
	await waitFor(() => form);
};

describe("Signup Component", () => {
	afterEach(cleanup);

	test("Deve começar com um estado incial", () => {
		const { sut } = makeSut();
		testChildCount(sut, "error-wrap", 0);
		const submitButton = sut.getByTestId("submit") as HTMLButtonElement;
		expect(submitButton.disabled).toBe(false);
	});

	test("Deve mostrar um name error se a validação falhar", () => {
		const validationError = faker.random.words();
		const { sut } = makeSut({ validationError });
		populateField(sut, "name");
		testStatsForField(sut, "name", validationError);
	});

	test("Deve mostrar um email error se a validação falhar", () => {
		const validationError = faker.random.words();
		const { sut } = makeSut({ validationError });
		populateField(sut, "email");
		testStatsForField(sut, "email", validationError);
	});

	test("Deve mostrar um password error se a validação falhar", () => {
		const validationError = faker.random.words();
		const { sut } = makeSut({ validationError });
		populateField(sut, "password");
		testStatsForField(sut, "password", validationError);
	});

	test("Deve mostrar um passwordConfirmation error se a validação falhar", () => {
		const validationError = faker.random.words();
		const { sut } = makeSut({ validationError });
		populateField(sut, "passwordConfirmation");
		testStatsForField(sut, "passwordConfirmation", validationError);
	});

	test("Deve habilitar o botão de submit se os valores passados forem válidos", () => {
		const { sut } = makeSut();
		populateField(sut, "name");
		populateField(sut, "email");
		populateField(sut, "password");
		populateField(sut, "passwordConfirmation");
		testButtonIsDisabled(sut, "submit", false);
	});

	test("Deve exibir o ícone de carregando quando o botão de submit for clicado", () => {
		const { sut } = makeSut();
		simulateValidSubmit(sut);
		const spinner = sut.getByTestId("spinner");
		expect(spinner).toBeTruthy();
	});

	test("Deve chamar o AddAccount com os valores corretos", () => {
		const { sut, addAccountSpy } = makeSut();
		const name = faker.name.firstName();
		const email = faker.internet.email();
		const password = faker.internet.password();
		simulateValidSubmit(sut, name, email, password);
		expect(addAccountSpy.params).toEqual({
			name,
			email,
			password,
			passwordConfirmation: password,
		});
	});

	test("Deve chamar o Authentication apenas uma vez", () => {
		const { sut, addAccountSpy } = makeSut();
		simulateValidSubmit(sut);
		simulateValidSubmit(sut);
		simulateValidSubmit(sut);
		expect(addAccountSpy.callsCount).toBe(1);
	});

	test("Não deve chamar o AddAccount se o formulário for inválido", async () => {
		const validationError = faker.random.words();
		const { sut, addAccountSpy } = makeSut({ validationError });
		simulateValidSubmit(sut);
		expect(addAccountSpy.callsCount).toBe(0);
	});

	test("Deve mostrar o erro se a autenticação falhar", async () => {
		const { sut, addAccountSpy } = makeSut();
		const error = new EmailInUseError();
		vi.spyOn(addAccountSpy, "add").mockRejectedValueOnce(error);
		await simulateValidSubmit(sut);
		testElementText(sut, "main-error", error.message);
		testChildCount(sut, "error-wrap", 1);
	});

	test("Deve chamar o SaveAccessToken quando a autenticação tiver sucesso", async () => {
		const { sut, addAccountSpy, saveAccessTokenMock } = makeSut();
		simulateValidSubmit(sut);
		await waitFor(() => sut.findByTestId("form"));
		expect(saveAccessTokenMock.accessToken).toBe(
			addAccountSpy.account.accessToken
		);
		expect(location.pathname).toBe("/");
	});

	test("Deve lançar um erro se o SaveAccessTokeb falhar", async () => {
		const { sut, saveAccessTokenMock } = makeSut();
		const error = new EmailInUseError();
		vi.spyOn(saveAccessTokenMock, "save").mockRejectedValueOnce(error);
		await simulateValidSubmit(sut);
		testElementText(sut, "main-error", error.message);
		testChildCount(sut, "error-wrap", 1);
	});

	test("Deve ir para página de login", async () => {
		const { sut } = makeSut();
		const login = sut.getByTestId("login");
		act(() => {
			fireEvent.click(login);
		});
		expect(location.pathname).toBe("/login");
	});
});
