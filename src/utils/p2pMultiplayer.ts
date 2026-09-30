import { Peer, DataConnection } from 'peerjs';
import { Square } from 'chess.js';
import { PieceColor, PieceType, TimeControl } from '../types/chess';

export const ROOM_CODE_PREFIX = 'CM-';
export const PEER_ID_PREFIX = 'chessmaster-p2p-';

const CODE_CHARS = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ'; // Avoid 0/O, 1/I

/**
 * Generates a clean 6-character room code like "CM-8F2K"
 */
export function generateRoomCode(): string {
  let result = '';
  for (let i = 0; i < 4; i++) {
    result += CODE_CHARS.charAt(Math.floor(Math.random() * CODE_CHARS.length));
  }
  return `${ROOM_CODE_PREFIX}${result}`;
}

/**
 * Cleans user-entered room code or pasted link.
 * Handles "cm-8f2k", "8F2K", or "https://chessmaster.app/?room=CM-8F2K".
 */
export function sanitizeRoomCode(raw: string): string {
  let cleaned = raw.trim();
  if (cleaned.includes('room=')) {
    const match = cleaned.match(/room=([A-Za-z0-9_-]+)/);
    if (match && match[1]) {
      cleaned = match[1];
    }
  }
  cleaned = cleaned.toUpperCase().replace(/[^A-Z0-9-]/g, '');
  if (!cleaned.startsWith(ROOM_CODE_PREFIX) && cleaned.length === 4) {
    cleaned = `${ROOM_CODE_PREFIX}${cleaned}`;
  }
  return cleaned;
}

export function getPeerIdFromRoomCode(code: string): string {
  return `${PEER_ID_PREFIX}${sanitizeRoomCode(code)}`;
}

export type MultiplayerMessageType =
  | 'init'
  | 'move'
  | 'sync_clock'
  | 'chat'
  | 'draw_offer'
  | 'draw_accept'
  | 'draw_decline'
  | 'resign'
  | 'rematch_offer'
  | 'rematch_accept'
  | 'ping'
  | 'pong';

export interface InitPayload {
  hostColor: PieceColor;
  guestColor: PieceColor;
  timeControl: TimeControl;
  initialFen: string;
  hostName: string;
}

export interface MovePayload {
  from: Square;
  to: Square;
  promotion?: PieceType;
  san: string;
  whiteTime: number;
  blackTime: number;
}

export interface ChatPayload {
  sender: string;
  text: string;
  timestamp: number;
}

export interface MultiplayerMessage<T = unknown> {
  type: MultiplayerMessageType;
  payload?: T;
}

export type ConnectionStatus =
  | 'idle'
  | 'initializing'
  | 'waiting_for_peer'
  | 'connecting'
  | 'connected'
  | 'disconnected'
  | 'error';

export interface P2PEvents {
  onStatusChange: (status: ConnectionStatus, message?: string) => void;
  onMessage: (message: MultiplayerMessage) => void;
  onError: (error: string) => void;
}

/**
 * Manager for peer-to-peer browser WebRTC multiplayer connections via PeerJS
 */
export class P2PMultiplayerManager {
  private peer: Peer | null = null;
  private connection: DataConnection | null = null;
  private roomCode: string | null = null;
  private isHost: boolean = false;
  private status: ConnectionStatus = 'idle';
  private events: P2PEvents;

  constructor(events: P2PEvents) {
    this.events = events;
  }

  private setStatus(status: ConnectionStatus, msg?: string) {
    this.status = status;
    this.events.onStatusChange(status, msg);
  }

  public getRoomCode(): string | null {
    return this.roomCode;
  }

  public getIsHost(): boolean {
    return this.isHost;
  }

  public getStatus(): ConnectionStatus {
    return this.status;
  }

  /**
   * Host starts a new game room
   */
  public hostGame(
    timeControl: TimeControl,
    colorChoice: 'w' | 'b' | 'random',
    initialFen: string,
    hostName: string = 'Host'
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      this.destroy();
      this.isHost = true;
      const code = generateRoomCode();
      this.roomCode = code;
      const peerId = getPeerIdFromRoomCode(code);

      this.setStatus('initializing', 'Connecting to multiplayer broker...');

      try {
        this.peer = new Peer(peerId, {
          debug: 1,
        });

        this.peer.on('open', () => {
          this.setStatus('waiting_for_peer', `Room created: ${code}`);
          resolve(code);
        });

        this.peer.on('connection', (conn) => {
          this.connection = conn;
          this.setupConnectionHandlers(conn);

          // Once data connection opens, send initial game configuration
          conn.on('open', () => {
            let hostColor: PieceColor = 'w';
            if (colorChoice === 'random') {
              hostColor = Math.random() < 0.5 ? 'w' : 'b';
            } else {
              hostColor = colorChoice;
            }
            const guestColor: PieceColor = hostColor === 'w' ? 'b' : 'w';

            const initMsg: MultiplayerMessage<InitPayload> = {
              type: 'init',
              payload: {
                hostColor,
                guestColor,
                timeControl,
                initialFen,
                hostName,
              },
            };
            this.send(initMsg);
            this.setStatus('connected', 'Opponent connected! Game starting...');
          });
        });

        this.peer.on('error', (err) => {
          console.error('Peer error:', err);
          this.setStatus('error', err.message || 'Connection error');
          this.events.onError(err.message || 'Multiplayer network error');
          reject(err);
        });

        this.peer.on('close', () => {
          this.setStatus('disconnected', 'Multiplayer connection closed.');
        });
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Failed to create room';
        this.setStatus('error', msg);
        reject(err);
      }
    });
  }

  /**
   * Guest joins an existing room by code
   */
  public joinGame(roomCodeInput: string, guestName: string = 'Guest'): Promise<void> {
    return new Promise((resolve, reject) => {
      this.destroy();
      this.isHost = false;
      const cleanCode = sanitizeRoomCode(roomCodeInput);
      this.roomCode = cleanCode;
      const targetPeerId = getPeerIdFromRoomCode(cleanCode);

      this.setStatus('connecting', `Joining room ${cleanCode}...`);

      try {
        // Guest creates an ephemeral peer
        this.peer = new Peer({
          debug: 1,
        });

        this.peer.on('open', () => {
          if (!this.peer) return;
          const conn = this.peer.connect(targetPeerId, {
            reliable: true,
          });
          this.connection = conn;
          this.setupConnectionHandlers(conn);

          conn.on('open', () => {
            this.setStatus('connected', 'Connected to room! Loading match...');
            // Say hello
            conn.send({
              type: 'chat',
              payload: {
                sender: guestName,
                text: 'Connected and ready to play! 👋',
                timestamp: Date.now(),
              },
            });
            resolve();
          });
        });

        this.peer.on('error', (err) => {
          console.error('Peer join error:', err);
          let userMsg = err.message || 'Could not connect to room.';
          if (err.type === 'peer-unavailable') {
            userMsg = `Room ${cleanCode} was not found or the host has disconnected.`;
          }
          this.setStatus('error', userMsg);
          this.events.onError(userMsg);
          reject(new Error(userMsg));
        });
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Failed to join room';
        this.setStatus('error', msg);
        reject(err);
      }
    });
  }

  private setupConnectionHandlers(conn: DataConnection) {
    conn.on('data', (data) => {
      if (typeof data === 'object' && data !== null && 'type' in data) {
        this.events.onMessage(data as MultiplayerMessage);
      }
    });

    conn.on('close', () => {
      this.setStatus('disconnected', 'Opponent disconnected.');
    });

    conn.on('error', (err) => {
      console.error('Data connection error:', err);
      this.setStatus('error', err.message || 'Data connection interrupted');
    });
  }

  /**
   * Send message to peer
   */
  public send(message: MultiplayerMessage): boolean {
    if (!this.connection || !this.connection.open) {
      console.warn('Cannot send message: peer connection is not open');
      return false;
    }
    try {
      this.connection.send(message);
      return true;
    } catch (err) {
      console.error('Failed to send peer message:', err);
      return false;
    }
  }

  /**
   * Clean up Peer and DataConnection
   */
  public destroy() {
    if (this.connection) {
      try {
        this.connection.close();
      } catch {
        // ignore
      }
      this.connection = null;
    }
    if (this.peer) {
      try {
        this.peer.destroy();
      } catch {
        // ignore
      }
      this.peer = null;
    }
    this.roomCode = null;
    this.status = 'idle';
  }
}
