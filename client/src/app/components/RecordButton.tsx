import React from "react";
import styled from "styled-components";
import { Button, theme } from "../styles/theme";
import Image from "next/image";

const RecordButton = styled(Button)<{ isRecording: boolean }>`
  background-color: ${(props) => (props.isRecording ? theme.colors.error : theme.colors.background)};
  color: ${(props) => (props.isRecording ? theme.colors.background : theme.colors.error)};
  border-color: ${theme.colors.error};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 1rem 2rem;
  transition: all 0.3s ease;
  width: 100%;
  margin-top: 1rem;

  &:hover {
    background-color: ${theme.colors.error};
    color: ${theme.colors.background};
  }
`;

const ImageWrapper = styled.div`
  position: relative;
  width: 30px;
  height: 30px;
  overflow: hidden;
  transition: all 0.3s ease;

  ${RecordButton}:hover & {
    transform: scale(1.1);
  }
`;

const StyledImage = styled(Image)`
  transition: all 0.3s ease;

  ${RecordButton}:hover & {
    filter: brightness(1.2) contrast(1.2);
  }
`;

interface RecordButtonProps {
  isRecording: boolean;
  startRecording: () => void;
  stopRecording: () => void;
}

export const Record: React.FC<RecordButtonProps> = ({ isRecording, startRecording, stopRecording }) => (
  <RecordButton
    onMouseDown={startRecording}
    onMouseUp={stopRecording}
    onTouchStart={startRecording}
    onTouchEnd={stopRecording}
    isRecording={isRecording}
  >
    <ImageWrapper>
      <StyledImage alt="Walkie-talkie frequency" layout="fill" objectFit="contain" src="/walkie-talkie-frequency.svg" />
    </ImageWrapper>
    {isRecording ? "Transmitting..." : "Initiate Transmission"}
  </RecordButton>
);
