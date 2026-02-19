export interface Box {
  id: number;
  value: number;
  isOpened: boolean;
  isPlayerBox: boolean;
}

export interface GameState {
  boxes: Box[];
  playerBoxId: number | null;
  currentRound: number;
  gameStatus: 'initial' | 'selecting-player-box' | 'playing' | 'banker-offer' | 'game-over';
  currentOffer: number | null;
  boxesToOpenThisRound: number;
  boxesOpenedThisRound: number;
  finalWinnings: number | null;
  gameResult: 'deal' | 'no-deal' | null;
}

export type GameAction =
  | { type: 'START_GAME' }
  | { type: 'SELECT_PLAYER_BOX'; boxId: number }
  | { type: 'OPEN_BOX'; boxId: number }
  | { type: 'SHOW_BANKER_OFFER'; offer: number }
  | { type: 'ACCEPT_DEAL'; offer: number }
  | { type: 'REJECT_DEAL' }
  | { type: 'END_GAME'; winnings: number; result: 'deal' | 'no-deal' }
  | { type: 'RESET_GAME' };

export interface GameContextType {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
  getRemainingValues: () => number[];
  getOpenedValues: () => number[];
  canOpenBox: (boxId: number) => boolean;
}