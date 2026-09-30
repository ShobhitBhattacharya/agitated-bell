import React, { useState, useEffect } from 'react';
import {
  Users,
  Copy,
  Check,
  Loader2,
  X,
  Swords,
  Timer,
  Link,
  Shield,
  AlertCircle,
  Radio,
} from 'lucide-react';
import { PieceColor, TimeControl } from '../types/chess';
import { TIME_CONTROL_PRESETS } from './GameSettingsModal';
import {
  P2PMultiplayerManager,
  sanitizeRoomCode,
  ConnectionStatus,
  MultiplayerMessage,
  InitPayload,
} from '../utils/p2pMultiplayer';

interface MultiplayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGameReady: (data: {
    manager: P2PMultiplayerManager;
    playerColor: PieceColor;
    timeControl: TimeControl;
    opponentName: string;
    isHost: boolean;
  }) => void;
  initialRoomCode?: string;
}

export const MultiplayerModal: React.FC<MultiplayerModalProps> = ({
  isOpen,
  onClose,
  onGameReady,
  initialRoomCode,
}) => {
  const [tab, setTab] = useState<'host' | 'join'>(initialRoomCode ? 'join' : 'host');
  const [manager, setManager] = useState<P2PMultiplayerManager | null>(null);

  // Host settings
  const [selectedTimeControl, setSelectedTimeControl] = useState<TimeControl>(TIME_CONTROL_PRESETS[3]); // Rapid 10 min
  const [hostColorChoice, setHostColorChoice] = useState<'w' | 'b' | 'random'>('random');
  const [hostName, setHostName] = useState<string>('Host');
  const [generatedRoomCode, setGeneratedRoomCode] = useState<string | null>(null);

  // Join settings
  const [joinInput, setJoinInput] = useState<string>(initialRoomCode || '');
  const [guestName, setGuestName] = useState<string>('Friend');

  // Status & feedback
  const [status, setStatus] = useState<ConnectionStatus>('idle');
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);

  // Synchronize initialRoomCode prop
  useEffect(() => {
    if (initialRoomCode) {
      setJoinInput(sanitizeRoomCode(initialRoomCode));
      setTab('join');
    }
  }, [initialRoomCode]);

  // Clean up manager on unmount or close
  const cleanup = () => {
    if (manager) {
      manager.destroy();
      setManager(null);
    }
    setGeneratedRoomCode(null);
    setStatus('idle');
    setStatusMessage('');
    setErrorMessage(null);
  };

  const handleClose = () => {
    cleanup();
    onClose();
  };

  // Host Game Handler
  const handleHostGame = async () => {
    cleanup();
    setErrorMessage(null);

    const newManager = new P2PMultiplayerManager({
      onStatusChange: (s, msg) => {
        setStatus(s);
        if (msg) setStatusMessage(msg);
      },
      onMessage: (msg: MultiplayerMessage) => {
        // Handled in main app once game begins
      },
      onError: (err) => {
        setErrorMessage(err);
      },
    });

    setManager(newManager);

    try {
      const code = await newManager.hostGame(
        selectedTimeControl,
        hostColorChoice,
        'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
        hostName
      );
      setGeneratedRoomCode(code);

      // Listen for peer connection open and initialization
      newManager['events'].onStatusChange = (s, msg) => {
        setStatus(s);
        if (msg) setStatusMessage(msg);
        if (s === 'connected') {
          // Determine assigned host color
          let hostColor: PieceColor = 'w';
          if (hostColorChoice === 'random') {
            hostColor = Math.random() < 0.5 ? 'w' : 'b';
          } else {
            hostColor = hostColorChoice;
          }
          onGameReady({
            manager: newManager,
            playerColor: hostColor,
            timeControl: selectedTimeControl,
            opponentName: 'Friend',
            isHost: true,
          });
          onClose();
        }
      };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to host game';
      setErrorMessage(msg);
    }
  };

  // Join Game Handler
  const handleJoinGame = async () => {
    cleanup();
    setErrorMessage(null);
    const cleanCode = sanitizeRoomCode(joinInput);
    if (!cleanCode || cleanCode.length < 5) {
      setErrorMessage('Please enter a valid 6-character room code (e.g. CM-8F2K).');
      return;
    }

    let resolvedInit: InitPayload | null = null;

    const newManager = new P2PMultiplayerManager({
      onStatusChange: (s, msg) => {
        setStatus(s);
        if (msg) setStatusMessage(msg);
      },
      onMessage: (msg: MultiplayerMessage) => {
        if (msg.type === 'init') {
          resolvedInit = msg.payload as InitPayload;
          onGameReady({
            manager: newManager,
            playerColor: resolvedInit.guestColor,
            timeControl: resolvedInit.timeControl,
            opponentName: resolvedInit.hostName || 'Host',
            isHost: false,
          });
          onClose();
        }
      },
      onError: (err) => {
        setErrorMessage(err);
      },
    });

    setManager(newManager);

    try {
      await newManager.joinGame(cleanCode, guestName);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Could not connect to room.';
      setErrorMessage(msg);
    }
  };

  const inviteLink = generatedRoomCode
    ? `${window.location.origin}${window.location.pathname}?room=${generatedRoomCode}`
    : '';

  const handleCopyLink = () => {
    if (!inviteLink) return;
    navigator.clipboard.writeText(inviteLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopyCode = () => {
    if (!generatedRoomCode) return;
    navigator.clipboard.writeText(generatedRoomCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 animate-pop-in font-['Plus_Jakarta_Sans',sans-serif]">
      <div className="bg-[#24211d] border border-[#3d3831] rounded-2xl p-5 sm:p-6 shadow-2xl max-w-lg w-full space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-[#312e2b]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#81b64c]/20 border border-[#81b64c]/40 flex items-center justify-center text-[#81b64c]">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-white tracking-tight flex items-center gap-2">
                Play with a Friend
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#312e2b] text-[#81b64c] border border-[#81b64c]/30 uppercase">
                  P2P WebRTC
                </span>
              </h2>
              <p className="text-[11px] text-neutral-400">Direct peer-to-peer connection • Zero lag</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="text-neutral-400 hover:text-white p-1 rounded-md transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Selector */}
        {!generatedRoomCode && status !== 'connecting' && (
          <div className="grid grid-cols-2 gap-1.5 p-1 bg-[#1a1917] rounded-xl border border-[#312e2b]">
            <button
              type="button"
              onClick={() => {
                setTab('host');
                setErrorMessage(null);
              }}
              className={`py-2 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                tab === 'host'
                  ? 'bg-[#81b64c] text-white shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Radio className="w-3.5 h-3.5" />
              <span>Create Match Room</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setTab('join');
                setErrorMessage(null);
              }}
              className={`py-2 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                tab === 'join'
                  ? 'bg-[#81b64c] text-white shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Link className="w-3.5 h-3.5" />
              <span>Join Room with Code</span>
            </button>
          </div>
        )}

        {/* Error Banner */}
        {errorMessage && (
          <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-600/40 text-xs text-rose-300 flex items-start gap-2 animate-shake">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <div className="leading-snug">{errorMessage}</div>
          </div>
        )}

        {/* Host Mode */}
        {tab === 'host' && (
          <div className="space-y-4">
            {!generatedRoomCode ? (
              <>
                {/* Time Control Options */}
                <div>
                  <label className="block text-xs font-bold text-neutral-300 mb-2">
                    Select Time Control:
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {TIME_CONTROL_PRESETS.map((tc) => {
                      const isSelected = selectedTimeControl.label === tc.label;
                      return (
                        <button
                          key={tc.label}
                          type="button"
                          onClick={() => setSelectedTimeControl(tc)}
                          className={`p-2 rounded-lg border text-left transition ${
                            isSelected
                              ? 'bg-[#81b64c]/20 border-[#81b64c] text-white font-bold'
                              : 'bg-[#1e1c19] border-[#312e2b] text-neutral-400 hover:text-white'
                          }`}
                        >
                          <span className="block text-xs">{tc.label}</span>
                          <span className="block text-[10px] text-neutral-400 opacity-80">
                            {tc.category}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Color Choice */}
                <div>
                  <label className="block text-xs font-bold text-neutral-300 mb-2">
                    Your Starting Color:
                  </label>
                  <div className="grid grid-cols-3 gap-2 text-xs font-semibold">
                    <button
                      type="button"
                      onClick={() => setHostColorChoice('w')}
                      className={`p-2 rounded-lg border transition ${
                        hostColorChoice === 'w'
                          ? 'bg-neutral-200 text-neutral-900 border-white font-bold'
                          : 'bg-[#1e1c19] border-[#312e2b] text-neutral-400'
                      }`}
                    >
                      White ♔
                    </button>
                    <button
                      type="button"
                      onClick={() => setHostColorChoice('random')}
                      className={`p-2 rounded-lg border transition ${
                        hostColorChoice === 'random'
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 font-bold'
                          : 'bg-[#1e1c19] border-[#312e2b] text-neutral-400'
                      }`}
                    >
                      Random 🎲
                    </button>
                    <button
                      type="button"
                      onClick={() => setHostColorChoice('b')}
                      className={`p-2 rounded-lg border transition ${
                        hostColorChoice === 'b'
                          ? 'bg-neutral-800 text-white border-neutral-600 font-bold'
                          : 'bg-[#1e1c19] border-[#312e2b] text-neutral-400'
                      }`}
                    >
                      Black ♚
                    </button>
                  </div>
                </div>

                {/* Host Name */}
                <div>
                  <label className="block text-xs font-semibold text-neutral-400 mb-1">
                    Your Display Name:
                  </label>
                  <input
                    type="text"
                    value={hostName}
                    onChange={(e) => setHostName(e.target.value)}
                    maxLength={16}
                    placeholder="Enter your name"
                    className="w-full px-3 py-2 rounded-lg bg-[#1a1917] border border-[#312e2b] text-white text-xs focus:outline-hidden focus:border-[#81b64c]"
                  />
                </div>

                {/* Action button */}
                <button
                  type="button"
                  onClick={handleHostGame}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#81b64c] hover:bg-[#92c957] text-white text-xs font-extrabold flex items-center justify-center gap-2 transition shadow-md"
                >
                  <Radio className="w-4 h-4" />
                  <span>Generate Match Room & Code</span>
                </button>
              </>
            ) : (
              /* Waiting for opponent screen */
              <div className="space-y-4 py-2 text-center animate-fade-in">
                <div className="w-12 h-12 rounded-full bg-[#81b64c]/20 border border-[#81b64c]/40 mx-auto flex items-center justify-center text-[#81b64c]">
                  <Loader2 className="w-6 h-6 animate-spin" />
                </div>

                <div>
                  <h3 className="text-sm font-bold text-white">Room Ready! Waiting for Friend...</h3>
                  <p className="text-xs text-neutral-400 mt-1">
                    Share this 6-character room code or invite link with your friend to connect.
                  </p>
                </div>

                {/* Code display */}
                <div className="flex items-center justify-center gap-3">
                  <div className="px-5 py-2.5 rounded-xl bg-[#141311] border-2 border-[#81b64c]/50 font-mono text-xl font-extrabold text-white tracking-widest">
                    {generatedRoomCode}
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyCode}
                    className="p-2.5 rounded-xl bg-[#312e2b] hover:bg-[#3d3a34] text-neutral-200 transition"
                    title="Copy Room Code"
                  >
                    {copiedCode ? <Check className="w-5 h-5 text-emerald-400" /> : <Copy className="w-5 h-5" />}
                  </button>
                </div>

                {/* Copy Link button */}
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="w-full py-2 px-3 rounded-lg border border-[#3b4334] bg-[#222720] hover:bg-[#2b3228] text-xs font-bold text-[#dce2d4] flex items-center justify-center gap-2 transition shadow-xs"
                >
                  <Link className="w-3.5 h-3.5 text-[#81b64c]" />
                  <span>{copiedLink ? 'Invite Link Copied!' : 'Copy Direct Invite Link'}</span>
                </button>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={cleanup}
                    className="text-xs text-neutral-400 hover:text-white underline transition"
                  >
                    Cancel Matchmaking
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Join Mode */}
        {tab === 'join' && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-neutral-300 mb-1.5">
                Room Code or Link:
              </label>
              <input
                type="text"
                value={joinInput}
                onChange={(e) => setJoinInput(e.target.value)}
                placeholder="e.g. CM-8F2K or paste invite link"
                className="w-full px-3 py-2.5 rounded-xl bg-[#1a1917] border border-[#312e2b] text-white font-mono text-sm uppercase tracking-wider focus:outline-hidden focus:border-[#81b64c]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-400 mb-1">
                Your Display Name:
              </label>
              <input
                type="text"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                maxLength={16}
                placeholder="Enter your name"
                className="w-full px-3 py-2 rounded-lg bg-[#1a1917] border border-[#312e2b] text-white text-xs focus:outline-hidden focus:border-[#81b64c]"
              />
            </div>

            {status === 'connecting' && (
              <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-500/40 text-xs text-amber-200 flex items-center gap-2.5">
                <Loader2 className="w-4 h-4 animate-spin text-amber-400 shrink-0" />
                <span>{statusMessage || 'Establishing WebRTC connection with host...'}</span>
              </div>
            )}

            <button
              type="button"
              disabled={status === 'connecting'}
              onClick={handleJoinGame}
              className={`w-full py-2.5 px-4 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 transition shadow-md ${
                status === 'connecting'
                  ? 'bg-[#2a2824] text-neutral-500 cursor-not-allowed'
                  : 'bg-[#81b64c] hover:bg-[#92c957] text-white cursor-pointer'
              }`}
            >
              {status === 'connecting' ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Connecting...</span>
                </>
              ) : (
                <>
                  <Swords className="w-4 h-4" />
                  <span>Join Match</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
