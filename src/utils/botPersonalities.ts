import { AiDifficulty } from '../types/chess';

export type BotPersonalityId = 'mikhail' | 'elena' | 'viktor' | 'magnus';

export interface BotPersonality {
  id: BotPersonalityId;
  name: string;
  title: string;
  rating: number;
  difficulty: AiDifficulty;
  avatar: string;
  colorBorder: string;
  colorBadge: string;
  style: string;
  bio: string;
  openings: string[];
  quotes: {
    start: string[];
    onBlunder: string[];
    onCheck: string[];
    onCaptureQueen: string[];
    onPlayerGreatMove: string[];
    onWin: string[];
    onLoss: string[];
    onDraw: string[];
  };
}

export const BOT_PERSONALITIES: Record<BotPersonalityId, BotPersonality> = {
  mikhail: {
    id: 'mikhail',
    name: 'Mikhail',
    title: 'THE TAL DISCIPLE',
    rating: 1100,
    difficulty: 'easy',
    avatar: '🦁',
    colorBorder: 'border-amber-600/60',
    colorBadge: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    style: 'Hyper-Aggressive & Sacrificial',
    bio: 'Believes safety is boring. Loves king-side pawn storms, piece sacrifices, and tactical chaos.',
    openings: ["King's Gambit", 'Sicilian Dragon', 'Evans Gambit'],
    quotes: {
      start: [
        'You must take your opponent into a deep dark forest where 2+2=5 and the path out is only wide enough for one.',
        'Careful with your king! I have no intention of letting you castle in peace.',
        'Pieces are made for attacking! Let the fireworks begin!',
      ],
      onBlunder: [
        'A free piece? You shouldn’t tempt a tactical predator!',
        'I love open lines! Thank you for the generous gift.',
        'A crack in your shield! Now my pieces pour in!',
      ],
      onCheck: [
        'Check! Your king has nowhere safe to run!',
        'Feel the heat? The attack is catching fire!',
      ],
      onCaptureQueen: [
        'Your Queen has fallen! The king hunt is in its final act!',
      ],
      onPlayerGreatMove: [
        'Whoa! Incredible counter-punch! That shook my attack!',
        'Bold defense! You are not backing down easily!',
      ],
      onWin: [
        'Checkmate in the center of the board! What a thrill!',
        'An explosive finish! Never give an inch in attack.',
      ],
      onLoss: [
        'Splendid defense! You weathered my wild storm and punished my overextension.',
        'Touché! A masterclass in soaking up pressure and striking back.',
      ],
      onDraw: [
        'A wild, blood-soaked perpetual check! My heart is still pounding.',
      ],
    },
  },

  elena: {
    id: 'elena',
    name: 'Elena',
    title: 'THE STRATEGIST',
    rating: 1500,
    difficulty: 'medium',
    avatar: '🦉',
    colorBorder: 'border-emerald-600/60',
    colorBadge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    style: 'Solid & Classical Prophylaxis',
    bio: 'A disciple of classical chess. Controls central squares, builds fortress pawn structures, and denies counterplay.',
    openings: ["Queen's Gambit", 'Caro-Kann Defense', 'Italian Game'],
    quotes: {
      start: [
        'A good position requires no fireworks. It simply denies you every comfortable square.',
        'Let us test your opening discipline. Control the center, safeguard your king.',
        'Patience and prophylaxis. Every move has a purpose.',
      ],
      onBlunder: [
        'Your pawn structure has been compromised beyond repair.',
        'A tactical lapse. In positional chess, precision is everything.',
        'That piece was overworked. A positional concession.',
      ],
      onCheck: [
        'Check. Your king is displaced to an uncomfortable diagonal.',
        'Check. Harmonious coordination from my pieces.',
      ],
      onCaptureQueen: [
        'With the queens off the board, positional superiority converts cleanly.',
      ],
      onPlayerGreatMove: [
        'Very clean technique. You understand prophylactic thinking.',
        'Deep positional move. You are giving me a genuine challenge.',
      ],
      onWin: [
        'Position completely dominated. Classical harmony triumphs.',
        'Good game. Systematic pressure left no saving chances.',
      ],
      onLoss: [
        'Your play was cleaner than mine today. Excellent positional judgment.',
        'Very well played. You outmaneuvered me with great poise.',
      ],
      onDraw: [
        'Symmetrical equilibrium. A textbook peaceful outcome.',
      ],
    },
  },

  viktor: {
    id: 'viktor',
    name: 'Viktor',
    title: 'THE ENDGAME GRINDER',
    rating: 1800,
    difficulty: 'hard',
    avatar: '🐺',
    colorBorder: 'border-sky-600/60',
    colorBadge: 'bg-sky-500/20 text-sky-300 border-sky-500/40',
    style: 'Merciless Technical Conversion',
    bio: 'Trades queens into technical rook or pawn endgames, creates outside passers, and grinds opponents down relentlessly.',
    openings: ['Ruy Lopez', 'Slav Defense', 'Catalan Opening'],
    quotes: {
      start: [
        'Survive the middlegame if you can, but the endgame belongs to me.',
        'Let us trade off the vanity pieces and see who truly understands chess.',
        'Precision in the technical phase decides everything.',
      ],
      onBlunder: [
        'In technical endgames, a single lost tempo spells doom.',
        'That weakness cannot be defended now. The conversion begins.',
        'You surrendered the key square. My king will march in.',
      ],
      onCheck: [
        'Check! Active king cutting off all your escape routes.',
        'Check. The pawn race is already mathematically decided.',
      ],
      onCaptureQueen: [
        'Queens exchanged. Now we play real chess in the endgame.',
      ],
      onPlayerGreatMove: [
        'Sharp calculation! You found the only saving resource.',
        'Impressive endgame technique. You are making me work for every inch.',
      ],
      onWin: [
        'The passed pawns march forward. Technic wins again.',
        'Flawless technical liquidation. Thank you for the match.',
      ],
      onLoss: [
        'Incredible defensive technique! You calculated the pawn race better than me.',
        'Superb counterplay. You punished my greedy pawn grab.',
      ],
      onDraw: [
        'Drawn fortress! Flawless defensive precision on your part.',
      ],
    },
  },

  magnus: {
    id: 'magnus',
    name: 'Magnus Bot',
    title: 'THE UNIVERSAL CHAMPION',
    rating: 2400,
    difficulty: 'master',
    avatar: '👑',
    colorBorder: 'border-amber-400/80',
    colorBadge: 'bg-amber-400/20 text-amber-200 border-amber-400/50',
    style: 'Uncompromising Masterclass',
    bio: 'Intuitive, relentless, and encyclopedic. Squeezes microscopic advantages out of dry positions or delivers brilliant sacrifices.',
    openings: ['Sicilian Defense', 'King’s Indian Defense', 'English Opening', 'Ruy Lopez'],
    quotes: {
      start: [
        'Play whatever opening you like. I will find a way to squeeze an edge.',
        'Let’s have a great match. Don’t blink!',
        'No easy draws today. Every single piece will be tested.',
      ],
      onBlunder: [
        'I didn’t expect that mistake from you. The position is completely lost now.',
        'A decisive inaccuracy. Master-level punishment activated.',
        'You left the back rank vulnerable. Fatal mistake.',
      ],
      onCheck: [
        'Check. No breathing room.',
        'Check! The vise is tightening.',
      ],
      onCaptureQueen: [
        'Total domination across every file.',
      ],
      onPlayerGreatMove: [
        'Now THAT is a world-class move! Respect.',
        'Brilliant! You are playing like a true titled master today.',
      ],
      onWin: [
        'Good game! Squeezed out every drop of advantage.',
        'Clinical finish. Thanks for the battle!',
      ],
      onLoss: [
        'Phenomenal performance! You legitimately beat me. Outstanding play!',
        'Brilliant preparation and execution. Hats off to you!',
      ],
      onDraw: [
        'Hard-fought draw against world-class defense. Well earned!',
      ],
    },
  },
};

export const BOT_LIST = Object.values(BOT_PERSONALITIES);

export function getBotById(id?: string): BotPersonality {
  if (!id) return BOT_PERSONALITIES.elena;
  return BOT_PERSONALITIES[id as BotPersonalityId] || BOT_PERSONALITIES.elena;
}

export function getRandomBanter(quotes: string[]): string {
  if (!quotes || quotes.length === 0) return '';
  return quotes[Math.floor(Math.random() * quotes.length)];
}
