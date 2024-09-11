import styled from "styled-components";

interface Message {
  text: string;
  timestamp: number;
  user: {
    id: string;
    username: string;
  };
}

const MessageContainer = styled.div<{ isCurrentUser: boolean }>`
  background-color: ${(props) => (props.isCurrentUser ? "#004400" : "#222222")};
  border-radius: 8px;
  padding: 8px;
  margin-bottom: 8px;
`;

const Username = styled.span`
  font-weight: bold;
  margin-right: 8px;
`;

interface MessagesProps {
  messages: Message[];
  currentUser: string;
}

export const Messages: React.FC<MessagesProps> = ({ messages, currentUser }) => {
  return (
    <div>
      {messages.map((message, index) => (
        <MessageContainer key={index} isCurrentUser={message.user.username === currentUser}>
          <Username>{message.user.username}:</Username>
          {message.text}
        </MessageContainer>
      ))}
    </div>
  );
};
