
export interface MatchPrediction {
  id: string;
  homeTeam: string;
  awayTeam: string;
  league: string;
  time: string;
  customBet: {
    market1: string;
    market2: string;
    description: string;
  };
  probability: number;
  insight: string;
}

export interface BetSlip {
  id: string;
  date: string;
  matches: MatchPrediction[];
  totalOddsEstimate: string;
  reliability: 'Baixa' | 'Média' | 'Alta';
}

export enum AppState {
  IDLE = 'idle',
  LOADING = 'loading',
  SUCCESS = 'success',
  ERROR = 'error'
}
