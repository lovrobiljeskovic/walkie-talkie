"use client";

import { useState, useEffect, useRef } from "react";
import io, { Socket } from "socket.io-client";
import styled from "styled-components";
import { Status } from "./components/Status";
import { Messages } from "./components/MessageList";
import { MessageInput } from "./components/MessageInput";
import { Record } from "./components/RecordButton";
import { DebugLog } from "./components/DebugLog";

interface Message {
  text: string;
  timestamp: number;
  user: {
    id: string;
    username: string;
  };
}

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 1rem;
  background-color: #0c0c0c;
  color: #00ff00;
  font-family: "Courier New", Courier, monospace;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 1rem;
  text-transform: uppercase;
  text-align: center;
  color: #00ff00;
  text-shadow: 0 0 10px #00ff00;
`;

const AudioIndicator = styled.p<{ isReceiving: boolean }>`
  color: #00ff00;
  visibility: ${(props) => (props.isReceiving ? "visible" : "hidden")};
  text-align: center;
  font-weight: bold;
`;

const LoginForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
`;

const Input = styled.input`
  background-color: #1a1a1a;
  color: #00ff00;
  border: 1px solid #00ff00;
  padding: 0.5rem;
  font-family: inherit;
`;

const Button = styled.button`
  background-color: #00ff00;
  color: #0c0c0c;
  border: none;
  padding: 0.5rem 1rem;
  cursor: pointer;
  font-family: inherit;
  font-weight: bold;

  &:hover {
    background-color: #00cc00;
  }
`;

export default function Home() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isReceivingAudio, setIsReceivingAudio] = useState(false);
  const [debugLog, setDebugLog] = useState<string[]>([]);
  const [connectionStatus, setConnectionStatus] = useState("Disconnected");
  const [serverStatus, setServerStatus] = useState("Unknown");
  const [audioPermission, setAudioPermission] = useState<boolean | null>(null);
  const [username, setUsername] = useState("");
  const [isJoined, setIsJoined] = useState(false);

  // Refs for audio handling
  const audioContextRef = useRef<AudioContext | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioQueueRef = useRef<{ blob: Blob; user: { id: string; username: string } }[]>([]);
  const isPlayingRef = useRef(false);

  // Function to add debug logs
  const addDebugLog = (message: string) => {
    setDebugLog((prev) => [...prev, `${new Date().toISOString()}: ${message}`]);
    console.log(message);
  };

  // Function to set up audio context and request permissions
  const setupAudio = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      setAudioPermission(true);
      addDebugLog("Audio permission granted and AudioContext created");
    } catch (error) {
      setAudioPermission(false);
      addDebugLog(`Failed to get audio permission: ${error}`);
    }
  };

  // Effect to initialize socket connection and set up audio
  useEffect(() => {
    const newSocket = io("http://localhost:5000", {
      transports: ["websocket"],
      upgrade: false,
    });

    // Set up socket event listeners
    newSocket.on("connect", () => {
      setConnectionStatus("Connected");
      addDebugLog(`Socket connected with ID: ${newSocket.id}`);
    });

    newSocket.on("disconnect", (reason) => {
      setConnectionStatus("Disconnected");
      addDebugLog(`Socket disconnected. Reason: ${reason}`);
    });

    newSocket.on("connect_error", (error) => {
      setConnectionStatus("Error");
      addDebugLog(`Connection error: ${error.message}`);
    });

    newSocket.on("userJoined", (user) => {
      addDebugLog(`User joined: ${user.username}`);
    });

    newSocket.on("userLeft", (user) => {
      addDebugLog(`User left: ${user.username}`);
    });

    setSocket(newSocket);
    addDebugLog("Socket connection initialized");

    setupAudio();

    // Cleanup function
    return () => {
      newSocket.close();
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      }
      addDebugLog("Socket connection closed and audio stream stopped");
    };
  }, []);

  // Effect to handle incoming messages and voice data
  useEffect(() => {
    if (!socket) return;

    socket.on("message", (message: Message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
      addDebugLog(`Received message from ${message.user.username}: ${message.text}`);
    });

    socket.on("voice", async ({ audioData, user }) => {
      addDebugLog(`Received audio data from ${user.username} of size: ${audioData.byteLength} bytes`);
      setIsReceivingAudio(true);
      const blob = new Blob([audioData], { type: "audio/webm;codecs=opus" });
      audioQueueRef.current.push({ blob, user });
      addDebugLog(`Added audio blob to queue from ${user.username}. Queue size: ${audioQueueRef.current.length}`);
      playNextAudio();
    });

    return () => {
      socket.off("message");
      socket.off("voice");
    };
  }, [socket]);

  // Function to play the next audio in the queue
  const playNextAudio = async () => {
    if (isPlayingRef.current || audioQueueRef.current.length === 0) {
      setIsReceivingAudio(false);
      return;
    }

    isPlayingRef.current = true;

    try {
      const { blob, user } = audioQueueRef.current.shift()!;
      const arrayBuffer = await blob.arrayBuffer();
      const audioBuffer = await audioContextRef.current!.decodeAudioData(arrayBuffer);
      const source = audioContextRef.current!.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioContextRef.current!.destination);

      source.onended = () => {
        isPlayingRef.current = false;
        addDebugLog(`Finished playing audio chunk from ${user.username}`);
        playNextAudio();
      };

      source.start();
      addDebugLog(`Started playing audio chunk from ${user.username}`);
    } catch (error) {
      addDebugLog(`Error playing audio: ${error}`);
      isPlayingRef.current = false;
      playNextAudio();
    }
  };

  // Function to handle user joining the chat
  const joinChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (username && socket) {
      socket.emit("join", username);
      setIsJoined(true);
      addDebugLog(`Joined chat as ${username}`);
    }
  };

  // Function to send a text message
  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputMessage && socket && isJoined) {
      const message: Message = { text: inputMessage, timestamp: Date.now(), user: { id: socket.id!, username } };
      socket.emit("message", message);
      setInputMessage("");
      addDebugLog(`Sent message: ${inputMessage}`);
    }
  };

  // Function to send audio data
  const sendAudioData = async (audioBlob: Blob) => {
    try {
      const arrayBuffer = await audioBlob.arrayBuffer();
      addDebugLog(`Sending audio data of size: ${arrayBuffer.byteLength} bytes`);
      socket!.emit("voice", arrayBuffer);
      addDebugLog("Audio data sent successfully");
    } catch (error) {
      addDebugLog(`Error sending audio data: ${error}`);
    }
  };

  // Function to start audio recording
  const startRecording = async () => {
    if (!mediaStreamRef.current) {
      addDebugLog("No media stream available");
      return;
    }

    mediaRecorderRef.current = new MediaRecorder(mediaStreamRef.current, {
      mimeType: "audio/webm;codecs=opus",
    });

    mediaRecorderRef.current.ondataavailable = (event) => {
      if (event.data.size > 0) {
        audioChunksRef.current.push(event.data);
        addDebugLog(`Recorded audio chunk of size: ${event.data.size} bytes`);
      }
    };

    mediaRecorderRef.current.onstop = () => {
      const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm;codecs=opus" });
      audioChunksRef.current = [];
      sendAudioData(audioBlob);
    };

    mediaRecorderRef.current.start(20);
    setIsRecording(true);
    addDebugLog("Started recording");
  };

  // Function to stop audio recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      addDebugLog("Stopped recording");
    }
  };

  // Function to test server connection
  const testServer = async () => {
    try {
      const response = await fetch("http://localhost:5000/test");
      const data = await response.json();
      setServerStatus(data.message);
      addDebugLog(`Server status: ${data.message}`);
    } catch (error) {
      setServerStatus("Error");
      addDebugLog(`Failed to reach server: ${error}`);
    }
  };

  // Render different views based on application state
  if (audioPermission === null) {
    return (
      <Container>
        <Title>Walkie-Talkie App</Title>
        <p>Please grant microphone access to use this application.</p>
      </Container>
    );
  }

  if (audioPermission === false) {
    return (
      <Container>
        <Title>Walkie-Talkie App</Title>
        <p>Microphone access is required to use this application. Please refresh and grant permission.</p>
      </Container>
    );
  }

  if (!isJoined) {
    return (
      <Container>
        <Title>Walkie-Talkie App</Title>
        <LoginForm onSubmit={joinChat}>
          <Input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
            required
          />
          <Button type="submit">Join</Button>
        </LoginForm>
      </Container>
    );
  }

  return (
    <Container>
      <Title>Walkie-Talkie App</Title>
      <Status connectionStatus={connectionStatus} serverStatus={serverStatus} onTestServer={testServer} />
      <Messages messages={messages} currentUser={username} />
      <MessageInput inputMessage={inputMessage} setInputMessage={setInputMessage} sendMessage={sendMessage} />
      <Record isRecording={isRecording} startRecording={startRecording} stopRecording={stopRecording} />
      <AudioIndicator isReceiving={isReceivingAudio}>Incoming Transmission...</AudioIndicator>
      <DebugLog debugLog={debugLog} />
    </Container>
  );
}
