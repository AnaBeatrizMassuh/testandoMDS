import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { useRouter } from 'next/router';
import Nav from '../../components/Nav';
import { describe } from 'node:test';

const makeSut = () => {
  const { getByTestId } = render(<Nav />);
  const homeLink = getByTestId('home-link');
  const loginLink = getByTestId('login-link');
  const registerLink = getByTestId('register-link');
  return { homeLink, loginLink, registerLink };
};

describe('Componente Nav', () => { 
  test('renderiza o componente nav corretamente', () => {
    const { homeLink, loginLink, registerLink } = makeSut();
    expect(homeLink).toBeInTheDocument();
    expect(loginLink).toBeInTheDocument();
    expect(registerLink).toBeInTheDocument();
  });
  
  test('navega para a página inicial ao clicar no home link', () => {
    const { getByTestId } = render(<Nav />);
    const homeLink = getByTestId('home-link');
    expect(homeLink).toBeInTheDocument();
    fireEvent.click(homeLink);
    expect(homeLink.href).toMatch(/\/$/);
  });

  test('navega para a página de login ao clicar no login link', () => {
    const { getByTestId } = render(<Nav />);
    const loginLink = getByTestId('login-link');
    expect(loginLink).toBeInTheDocument();
    fireEvent.click(loginLink);
    expect(loginLink.href).toMatch(/\/login$/);
  });

  test('navega para a página de registro ao clicar no register link', () => {
    const { getByTestId } = render(<Nav />);
    const registerLink = getByTestId('register-link');
    expect(registerLink).toBeInTheDocument();
    fireEvent.click(registerLink);
    expect(registerLink.href).toMatch(/\/register$/);
  });
})


