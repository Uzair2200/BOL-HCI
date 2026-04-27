import { createContext, useContext, useState } from "react";

interface MicContextType {
  isRecording: boolean;
  setIsRecording: (value: boolean) => void;
}

const MicContext = createContext<MicContextType | null>(null);

export function MicProvider({ children }: { children: React.ReactNode }) {
  const [isRecording, setIsRecording] = useState(false);

  return (
    <MicContext.Provider value={{ isRecording, setIsRecording }}>
      {children}
    </MicContext.Provider>
  );
}

export function useMic() {
  const context = useContext(MicContext);
  if (!context) throw new Error("useMic must be used within MicProvider");
  return context;
}
