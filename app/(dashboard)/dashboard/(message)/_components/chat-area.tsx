interface ChatAreaProps {
  messages: any[];
  typing: boolean;
  setTyping: (typing: boolean) => void;
  onOpenDetails: () => void;
}