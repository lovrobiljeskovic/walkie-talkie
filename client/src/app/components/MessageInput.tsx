import styled from "styled-components";

const Form = styled.form`
  display: flex;
  margin-top: 1rem;
`;

const Input = styled.input`
  flex-grow: 1;
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

interface MessageInputProps {
  inputMessage: string;
  setInputMessage: (message: string) => void;
  sendMessage: (e: React.FormEvent) => void;
}

export const MessageInput: React.FC<MessageInputProps> = ({ inputMessage, setInputMessage, sendMessage }) => {
  return (
    <Form onSubmit={sendMessage}>
      <Input
        type="text"
        value={inputMessage}
        onChange={(e) => setInputMessage(e.target.value)}
        placeholder="Enter a message"
      />
      <Button type="submit">Send</Button>
    </Form>
  );
};
