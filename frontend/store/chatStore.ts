import { create } from 'zustand';

export interface TopProtocol {
  name: string;
  tvl: number;
  category: string;
}

export interface OpportunityItem {
  protocol: string;
  asset: string;
  apy: number;
  tvl: number;
}

export interface Message {
  role: 'user' | 'model';
  content: string;
}

interface ChatState {
  isOpen: boolean;
  messages: Message[];
  contextString: string;
  toggleChat: () => void;
  openChat: () => void;
  closeChat: () => void;
  addMessage: (message: Message) => void;
  setContextData: (protocols: TopProtocol[], opportunities: OpportunityItem[], walletContext?: string) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  isOpen: false,
  messages: [],
  contextString: "",
  toggleChat: () => set((state) => ({ isOpen: !state.isOpen })),
  openChat: () => set({ isOpen: true }),
  closeChat: () => set({ isOpen: false }),
  addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
  setContextData: (protocols, opportunities, walletContext?: string) => {
    // Single pass context builder (O(n))
    let contextBuilder = "ACTIVE SCREEN DATA (Mantle Atlas Dashboard):\n\n--- TOP ECOSYSTEM PROTOCOLS ---\n";
    
    if (walletContext) {
      contextBuilder = `USER WALLET INFO: ${walletContext}\n\n` + contextBuilder;
    }
    
    for (let i = 0; i < protocols.length; i++) {
        const p = protocols[i];
        contextBuilder += `${i + 1}. ${p.name} (${p.category}) - TVL: $${(p.tvl / 1_000_000).toFixed(2)}M\n`;
    }

    contextBuilder += "\n--- ALPHA STRATEGIES (TOP OPPORTUNITIES) ---\n";
    for (let i = 0; i < opportunities.length; i++) {
        const o = opportunities[i];
        contextBuilder += `${i + 1}. ${o.protocol} (${o.asset}) - APY: ${o.apy.toFixed(2)}%, TVL: $${(o.tvl / 1_000_000).toFixed(2)}M\n`;
    }

    set({ contextString: contextBuilder });
  }
}));
