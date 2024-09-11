import React from "react";
import styled from "styled-components";
import { Button, theme } from "../styles/theme";

const StatusContainer = styled.div`
  margin-bottom: 1rem;
  border: 1px solid ${theme.colors.text};
  padding: 0.5rem;
  border-radius: 5px;

  @media (max-width: ${theme.breakpoints.mobile}) {
    padding: 0.3rem;
  }
`;

const StatusText = styled.span<{ isConnected: boolean }>`
  font-weight: bold;
  color: ${(props) => (props.isConnected ? theme.colors.text : theme.colors.error)};
`;

interface StatusProps {
  connectionStatus: string;
  serverStatus: string;
  onTestServer: () => void;
  onTestAudio?: () => void;
}

export const Status: React.FC<StatusProps> = ({ connectionStatus, serverStatus, onTestServer }) => (
  <StatusContainer>
    <p>
      Connection Status: <StatusText isConnected={connectionStatus === "Connected"}>{connectionStatus}</StatusText>
    </p>
    <p>
      Server Status: <StatusText isConnected={serverStatus === "Running"}>{serverStatus}</StatusText>
    </p>
    <Button onClick={onTestServer}>Ping Server</Button>
    {/* <Button onClick={onTestAudio}>Test Audio</Button> */}
  </StatusContainer>
);
