import { describe, it, expect } from 'vitest';
import {
  generateRoomCode,
  sanitizeRoomCode,
  getPeerIdFromRoomCode,
  ROOM_CODE_PREFIX,
  PEER_ID_PREFIX,
  MultiplayerMessage,
  InitPayload,
  MovePayload,
} from '../utils/p2pMultiplayer';

describe('P2P Multiplayer WebRTC Protocol & Helpers', () => {
  it('generates 6-character room codes with CM- prefix', () => {
    const code = generateRoomCode();
    expect(code).toMatch(/^CM-[2-9A-HJ-NP-Z]{4}$/);
    expect(code.length).toBe(7); // CM- + 4 chars = 7 chars
    expect(code.startsWith(ROOM_CODE_PREFIX)).toBe(true);
  });

  it('generates unique random room codes', () => {
    const set = new Set<string>();
    for (let i = 0; i < 50; i++) {
      set.add(generateRoomCode());
    }
    expect(set.size).toBe(50);
  });

  it('sanitizes user room codes and pasted URLs', () => {
    // lowercase to uppercase
    expect(sanitizeRoomCode('cm-8f2k')).toBe('CM-8F2K');
    // raw 4-character code without prefix
    expect(sanitizeRoomCode('8f2k')).toBe('CM-8F2K');
    // with spaces
    expect(sanitizeRoomCode('  cm-8f2k  ')).toBe('CM-8F2K');
    // from full URL
    expect(sanitizeRoomCode('https://chessmaster.app/?room=CM-9X4M')).toBe('CM-9X4M');
    expect(sanitizeRoomCode('http://localhost:3000/?room=cm-ab23')).toBe('CM-AB23');
  });

  it('maps room code to namespaced peer ID', () => {
    const code = 'CM-8F2K';
    const peerId = getPeerIdFromRoomCode(code);
    expect(peerId).toBe('chessmaster-p2p-CM-8F2K');
    expect(peerId.startsWith(PEER_ID_PREFIX)).toBe(true);
  });

  it('formats init payload conforming to protocol', () => {
    const initPayload: InitPayload = {
      hostColor: 'w',
      guestColor: 'b',
      timeControl: { id: 'blitz-3-0', label: 'Blitz 3+0', initialSeconds: 180, incrementSeconds: 0, category: 'Blitz' },
      initialFen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
      hostName: 'Grandmaster Alice',
    };

    const message: MultiplayerMessage<InitPayload> = {
      type: 'init',
      payload: initPayload,
    };

    expect(message.type).toBe('init');
    expect(message.payload?.hostColor).toBe('w');
    expect(message.payload?.guestColor).toBe('b');
    expect(message.payload?.timeControl.initialSeconds).toBe(180);
  });

  it('formats move payload with clock times', () => {
    const movePayload: MovePayload = {
      from: 'e2',
      to: 'e4',
      san: 'e4',
      whiteTime: 178,
      blackTime: 180,
    };

    const message: MultiplayerMessage<MovePayload> = {
      type: 'move',
      payload: movePayload,
    };

    expect(message.type).toBe('move');
    expect(message.payload?.from).toBe('e2');
    expect(message.payload?.to).toBe('e4');
    expect(message.payload?.whiteTime).toBe(178);
  });
});
