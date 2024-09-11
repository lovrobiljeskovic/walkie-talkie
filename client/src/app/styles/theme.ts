import styled from 'styled-components';

export const theme = {
    colors: {
        background: '#0c0c0c',
        text: '#00ff00',
        accent: '#00cc00',
        error: '#ff0000',
    },
    fonts: {
        main: "'Courier New', Courier, monospace",
    },
    breakpoints: {
        mobile: '480px',
        tablet: '768px',
        desktop: '1024px',
    },
};

export const Container = styled.div`
  max-width: 800px;
  width: 100%;
  margin: 0 auto;
  padding: 1rem;
  background-color: ${theme.colors.background};
  color: ${theme.colors.text};
  font-family: ${theme.fonts.main};

  @media (max-width: ${theme.breakpoints.tablet}) {
    padding: 0.5rem;
  }
`;

export const Title = styled.h1`
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 1rem;
  text-transform: uppercase;
  text-align: center;
  color: ${theme.colors.text};
  text-shadow: 0 0 10px ${theme.colors.text};

  @media (max-width: ${theme.breakpoints.mobile}) {
    font-size: 1.5rem;
  }
`;

export const Button = styled.button`
  background-color: ${theme.colors.background};
  color: ${theme.colors.text};
  padding: 0.5rem 1rem;
  margin-top: 0.5rem;
  border: 1px solid ${theme.colors.text};
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: ${theme.colors.text};
    color: ${theme.colors.background};
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: 0.4rem 0.8rem;
    font-size: 0.9rem;
  }
`;

export const Input = styled.input`
  flex-grow: 1;
  padding: 0.5rem;
  margin-right: 0.5rem;
  background-color: ${theme.colors.background};
  border: 1px solid ${theme.colors.text};
  border-radius: 5px;
  color: ${theme.colors.text};
  font-family: ${theme.fonts.main};

  &::placeholder {
    color: ${theme.colors.accent};
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 5px ${theme.colors.text};
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: 0.4rem;
    font-size: 0.9rem;
  }
`;