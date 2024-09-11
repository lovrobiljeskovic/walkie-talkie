import React from "react";
import styled from "styled-components";
import { theme } from "../styles/theme";

const DebugContainer = styled.div`
  margin-top: 1rem;
  border: 1px solid ${theme.colors.text};
  border-radius: 5px;
  padding: 1rem;

  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: 0.5rem;
  }
`;

const DebugTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: ${theme.colors.text};
  text-transform: uppercase;

  @media (max-width: ${theme.breakpoints.mobile}) {
    font-size: 1rem;
  }
`;

const DebugList = styled.ul`
  padding: 0.5rem;
  border-radius: 0.25rem;
  height: 15rem;
  overflow-y: auto;
  list-style-type: none;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: ${theme.colors.background};
  }

  &::-webkit-scrollbar-thumb {
    background: ${theme.colors.text};
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: ${theme.colors.accent};
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    height: 10rem;
  }
`;

const DebugItem = styled.li`
  font-size: 0.875rem;
  margin-bottom: 0.25rem;
  color: ${theme.colors.text};
  line-height: 1.4;

  &::before {
    content: "> ";
    color: ${theme.colors.accent};
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    font-size: 0.8rem;
  }
`;

interface DebugLogProps {
  debugLog: string[];
}

export const DebugLog: React.FC<DebugLogProps> = ({ debugLog }) => (
  <DebugContainer>
    <DebugTitle>System Log</DebugTitle>
    <DebugList>
      {debugLog.map((log, index) => (
        <DebugItem key={index}>{log}</DebugItem>
      ))}
    </DebugList>
  </DebugContainer>
);
