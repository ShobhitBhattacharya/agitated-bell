export type OpeningPlaystyle =
  | 'Aggressive / Tactical'
  | 'Solid / Defensive'
  | 'Positional / Strategic'
  | 'Dynamic / Counterattacking';

export type OpeningVariation = {
  id: string;
  name: string;
  eco: string;
  playstyle: OpeningPlaystyle;
  playerBenefit: string;
  moves: string[];
};

export type StudyOpening = {
  id: string;
  name: string;
  eco: string;
  summary: string;
  keyIdeas: string[];
  sampleMoves: string[];
  bestLine: string[];
  playstyle: OpeningPlaystyle;
  playerBenefit: string;
  variations: OpeningVariation[];
};

export type StudyMatePattern = {
  id: string;
  name: string;
  motif: string;
  summary: string;
  keyMoves: string[];
  theme: string;
};

export type TheoryLessonCategory = 'opening' | 'checkmate-pattern';

export type AdaptiveTrainerPrompt = {
  type: 'f7-weakness' | 'queen-early' | 'development-lag';
  title: string;
  message: string;
  lessonId: string;
  suggestedPractice: string;
  count: number;
};

export type TheoryLesson = {
  id: string;
  category: TheoryLessonCategory;
  name: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  summary: string;
  objective: string;
  keyIdeas: string[];
  keyMoves: string[];
  theme: string;
  eco?: string;
  playstyle?: OpeningPlaystyle;
  playerBenefit?: string;
  variations?: OpeningVariation[];
};

export const openingCatalog: StudyOpening[] = [
  // 1. Sicilian Defense (Dynamic / Counterattacking)
  {
    id: 'sicilian-defense',
    name: 'Sicilian Defense',
    eco: 'B20-B99',
    playstyle: 'Dynamic / Counterattacking',
    playerBenefit: 'Gives Black immediate asymmetrical counterplay against 1. e4, fighting for the center and queenside initiative.',
    summary: 'A counterattacking opening where Black challenges White in the center and creates asymmetry.',
    keyIdeas: ['Counterplay on c5', 'Asymmetrical structure', 'Dynamic queenside pressure'],
    sampleMoves: ['e4', 'c5'],
    bestLine: ['e4', 'c5', 'Nf3', 'd6', 'd4', 'cxd4', 'Nxd4', 'Nf6', 'Nc3', 'a6', 'Be3', 'e5', 'Nb3', 'Be6'],
    variations: [
      {
        id: 'sicilian-dragon',
        name: 'Sicilian Dragon',
        eco: 'B70-B79',
        playstyle: 'Aggressive / Tactical',
        playerBenefit: 'Fianchettoes the dark-squared bishop to create vicious long-diagonal counter-tactics in opposite-side castling battles.',
        moves: ['e4', 'c5', 'Nf3', 'd6', 'd4', 'cxd4', 'Nxd4', 'Nf6', 'Nc3', 'g6', 'Be3', 'Bg7', 'f3', 'O-O', 'Qd2', 'Nc6'],
      },
      {
        id: 'sicilian-alapin',
        name: 'Sicilian Alapin (2. c3)',
        eco: 'B22',
        playstyle: 'Positional / Strategic',
        playerBenefit: 'Neutralizes sharp Sicilian tactics by preparing an immediate classical d4 pawn center.',
        moves: ['e4', 'c5', 'c3', 'd5', 'exd5', 'Qxd5', 'd4', 'Nf6', 'Nf3', 'e6', 'Be2', 'Nc6'],
      },
      {
        id: 'closed-sicilian',
        name: 'Closed Sicilian',
        eco: 'B23-B26',
        playstyle: 'Positional / Strategic',
        playerBenefit: 'Keeps the center closed with 2. Nc3 and d3, building patient, risk-free kingside pressure.',
        moves: ['e4', 'c5', 'Nc3', 'Nc6', 'g3', 'g6', 'Bg2', 'Bg7', 'd3', 'd6', 'f4', 'e6'],
      },
    ],
  },

  // 2. Italian Game (Positional / Strategic)
  {
    id: 'italian-game',
    name: 'Italian Game',
    eco: 'C50-C59',
    playstyle: 'Positional / Strategic',
    playerBenefit: 'Rapid harmonious piece development and flexible center control without early structural weaknesses.',
    summary: 'One of the most straightforward openings with rapid development and kingside pressure.',
    keyIdeas: ['Bishop on c4', 'Rapid development', 'Fianchetto ideas'],
    sampleMoves: ['e4', 'e5', 'Nf3', 'Nc6', 'Bc4'],
    bestLine: ['e4', 'e5', 'Nf3', 'Nc6', 'Bc4', 'Bc5', 'c3', 'Nf6', 'd3', 'd6', 'O-O', 'O-O', 'Re1', 'a6'],
    variations: [
      {
        id: 'evans-gambit',
        name: 'Evans Gambit',
        eco: 'C51-C52',
        playstyle: 'Aggressive / Tactical',
        playerBenefit: 'Sacrifices a wing pawn (4. b4) to seize the center and rip open attacking diagonals against f7.',
        moves: ['e4', 'e5', 'Nf3', 'Nc6', 'Bc4', 'Bc5', 'b4', 'Bxb4', 'c3', 'Ba5', 'd4', 'exd4', 'O-O'],
      },
      {
        id: 'two-knights-defense',
        name: 'Two Knights Defense',
        eco: 'C55-C59',
        playstyle: 'Dynamic / Counterattacking',
        playerBenefit: 'Challenges White immediately with 3... Nf6, provoking wild tactical complications.',
        moves: ['e4', 'e5', 'Nf3', 'Nc6', 'Bc4', 'Nf6', 'd3', 'Bc5', 'c3', 'd6', 'Bb3', 'a6', 'Nbd2', 'O-O'],
      },
    ],
  },

  // 3. Ruy Lopez (Positional / Strategic)
  {
    id: 'ruy-lopez',
    name: 'Ruy Lopez',
    eco: 'C60-C99',
    playstyle: 'Positional / Strategic',
    playerBenefit: 'Imposes enduring positional pressure on Black\'s center and knights, laying groundwork for deep master strategy.',
    summary: 'One of the oldest and classical openings, putting immediate pressure on Black\'s central defender.',
    keyIdeas: ['Pressure on c6 knight', 'Pawn center d4', 'Flexible bishop maneuver Bb5-a4-b3'],
    sampleMoves: ['e4', 'e5', 'Nf3', 'Nc6', 'Bb5'],
    bestLine: ['e4', 'e5', 'Nf3', 'Nc6', 'Bb5', 'a6', 'Ba4', 'Nf6', 'O-O', 'Be7', 'Re1', 'b5', 'Bb3', 'd6', 'c3', 'O-O'],
    variations: [
      {
        id: 'berlin-defense',
        name: 'Berlin Defense',
        eco: 'C65-C67',
        playstyle: 'Solid / Defensive',
        playerBenefit: 'The impenetrable "Berlin Wall" endgame that eliminates White\'s king attacks and secures an ultra-solid draw or grind.',
        moves: ['e4', 'e5', 'Nf3', 'Nc6', 'Bb5', 'Nf6', 'O-O', 'Nxe4', 'd4', 'Nd6', 'Bxc6', 'dxc6', 'dxe5', 'Nf5', 'Qxd8+', 'Kxd8'],
      },
      {
        id: 'exchange-ruy-lopez',
        name: 'Ruy Lopez Exchange',
        eco: 'C68-C69',
        playstyle: 'Positional / Strategic',
        playerBenefit: 'Trades on c6 immediately to inflict doubled pawns on Black, playing for a clean kingside pawn majority endgame.',
        moves: ['e4', 'e5', 'Nf3', 'Nc6', 'Bb5', 'a6', 'Bxc6', 'dxc6', 'O-O', 'f6', 'd4', 'exd4', 'Nxd4', 'c5'],
      },
    ],
  },

  // 4. Queen's Gambit (Positional / Strategic)
  {
    id: 'queens-gambit',
    name: "Queen's Gambit",
    eco: 'D06-D69',
    playstyle: 'Positional / Strategic',
    playerBenefit: 'Classical queen\'s pawn mastery: dominates central squares and develops a crushing minority attack on the queenside.',
    summary: 'White offers a pawn to gain central control and long-term pressure on the queenside.',
    keyIdeas: ['Central tension', 'd4 and c4 setup', 'Queenside minority attack'],
    sampleMoves: ['d4', 'd5', 'c4'],
    bestLine: ['d4', 'd5', 'c4', 'e6', 'Nc3', 'Nf6', 'cxd5', 'exd5', 'Bg5', 'Be7', 'e3', 'O-O', 'Bd3', 'Nbd7'],
    variations: [
      {
        id: 'qga',
        name: "Queen's Gambit Accepted",
        eco: 'D20-D29',
        playstyle: 'Dynamic / Counterattacking',
        playerBenefit: 'Accepts the c4 pawn to immediately strike back with ...c5, playing for active piece freedom.',
        moves: ['d4', 'd5', 'c4', 'dxc4', 'Nf3', 'Nf6', 'e3', 'e6', 'Bxc4', 'c5', 'O-O', 'a6', 'Qe2', 'b5'],
      },
      {
        id: 'tarrasch-defense',
        name: 'Tarrasch Defense',
        eco: 'D32-D34',
        playstyle: 'Aggressive / Tactical',
        playerBenefit: 'Accepts an isolated queen\'s pawn (IQP) in exchange for free, open piece diagonals and rapid attacking development.',
        moves: ['d4', 'd5', 'c4', 'e6', 'Nc3', 'c5', 'cxd5', 'exd5', 'Nf3', 'Nc6', 'g3', 'Nf6'],
      },
    ],
  },

  // 5. French Defense (Solid / Defensive)
  {
    id: 'french-defense',
    name: 'French Defense',
    eco: 'C10-C14',
    playstyle: 'Solid / Defensive',
    playerBenefit: 'Forms a resilient pawn chain that blunts White\'s opening initiative, then systematically undermines White\'s d4 center with ...c5 and ...f6.',
    summary: 'Solid positional defense where Black accepts a cramped position to counterattack White\'s d4 pawn chain.',
    keyIdeas: ['Solid pawn chain', 'Counterattack with ...c5', 'Bad light-squared bishop challenge'],
    sampleMoves: ['e4', 'e6', 'd4', 'd5'],
    bestLine: ['e4', 'e6', 'd4', 'd5', 'Nc3', 'Nf6', 'Bg5', 'Be7', 'e5', 'Nfd7', 'Bxe7', 'Qxe7', 'f4', 'O-O'],
    variations: [
      {
        id: 'french-advance',
        name: 'French Advance Variation',
        eco: 'C02',
        playstyle: 'Positional / Strategic',
        playerBenefit: 'Closes the center with 3. e5, launching a strategic tug-of-war around White\'s d4 pawn base.',
        moves: ['e4', 'e6', 'd4', 'd5', 'e5', 'c5', 'c3', 'Nc6', 'Nf3', 'Qb6', 'a3', 'Nh6'],
      },
      {
        id: 'french-winawer',
        name: 'French Winawer Variation',
        eco: 'C15-C19',
        playstyle: 'Aggressive / Tactical',
        playerBenefit: 'Pins White\'s knight with 3... Bb4 and damages White\'s structure, leading to unbalanced, cutthroat battles.',
        moves: ['e4', 'e6', 'd4', 'd5', 'Nc3', 'Bb4', 'e5', 'c5', 'a3', 'Bxc3+', 'bxc3', 'Ne7'],
      },
    ],
  },

  // 6. Caro-Kann Defense (Solid / Defensive)
  {
    id: 'caro-kann-defense',
    name: 'Caro-Kann Defense',
    eco: 'B10-B19',
    playstyle: 'Solid / Defensive',
    playerBenefit: 'Rock-solid structure without the "bad bishop" dilemma of the French; guarantees a comfortable, resilient endgame.',
    summary: 'Extremely resilient defense supporting ...d5 with ...c6 without trapping Black\'s light-squared bishop.',
    keyIdeas: ['Active light-squared bishop', 'Solid pawn structure', 'Endgame resilience'],
    sampleMoves: ['e4', 'c6', 'd4', 'd5'],
    bestLine: ['e4', 'c6', 'd4', 'd5', 'Nc3', 'dxe4', 'Nxe4', 'Bf5', 'Ng3', 'Bg6', 'h4', 'h6', 'Nf3', 'Nd7'],
    variations: [
      {
        id: 'caro-kann-advance',
        name: 'Caro-Kann Advance Variation',
        eco: 'B12',
        playstyle: 'Dynamic / Counterattacking',
        playerBenefit: 'Black develops the bishop to f5 outside the pawn chain before locking the center, targeting White\'s pawn chain.',
        moves: ['e4', 'c6', 'd4', 'd5', 'e5', 'Bf5', 'Nf3', 'e6', 'Be2', 'c5', 'Be3', 'Qb6'],
      },
      {
        id: 'panov-botvinnik',
        name: 'Panov-Botvinnik Attack',
        eco: 'B13-B14',
        playstyle: 'Aggressive / Tactical',
        playerBenefit: 'White challenges the center with 4. c4, transforming the game into an active isolated queen pawn attacking setup.',
        moves: ['e4', 'c6', 'd4', 'd5', 'exd5', 'cxd5', 'c4', 'Nf6', 'Nc3', 'e6', 'Nf3', 'Be7'],
      },
    ],
  },

  // 7. King's Indian Defense (Aggressive / Tactical)
  {
    id: 'kings-indian-defense',
    name: "King's Indian Defense",
    eco: 'E60-E99',
    playstyle: 'Aggressive / Tactical',
    playerBenefit: 'Invites White to establish a massive pawn center, only to counter-attack with an unstoppable sacrificial kingside mating storm.',
    summary: 'Black fianchettoes the kingside bishop and prepares a dynamic kingside counterattack.',
    keyIdeas: ['Fianchetto', 'Hypermodern defense', 'Central break d5'],
    sampleMoves: ['d4', 'Nf6', 'c4', 'g6'],
    bestLine: ['d4', 'Nf6', 'c4', 'g6', 'Nc3', 'Bg7', 'e4', 'd6', 'Nf3', 'O-O', 'Be2', 'e5', 'O-O', 'Nc6'],
    variations: [
      {
        id: 'kid-samisch',
        name: "King's Indian Sämisch",
        eco: 'E80-E89',
        playstyle: 'Positional / Strategic',
        playerBenefit: 'White solidifies e4 with 5. f3 and castles queenside, preparing a pawn storm against Black\'s king.',
        moves: ['d4', 'Nf6', 'c4', 'g6', 'Nc3', 'Bg7', 'e4', 'd6', 'f3', 'O-O', 'Be3', 'e5', 'd5', 'c6'],
      },
    ],
  },

  // 8. London System (Solid / Defensive)
  {
    id: 'london-system',
    name: 'London System',
    eco: 'D02',
    playstyle: 'Solid / Defensive',
    playerBenefit: 'Universal, blunder-free pyramid setup (d4, Bf4, e3, c3) playable against virtually any defense.',
    summary: 'Reliable, universal setup with d4, Nf3, and early Bf4 outside the pawn chain before playing e3.',
    keyIdeas: ['Bishop outside the pawn chain', 'Solid pyramid pawn structure', 'Harmonious development'],
    sampleMoves: ['d4', 'd5', 'Nf3', 'Nf6', 'Bf4'],
    bestLine: ['d4', 'd5', 'Nf3', 'Nf6', 'Bf4', 'c5', 'e3', 'Nc6', 'c3', 'Qb6', 'Qb3', 'c4', 'Qc2', 'Bf5'],
    variations: [
      {
        id: 'jobava-london',
        name: 'Jobava London System',
        eco: 'D00',
        playstyle: 'Aggressive / Tactical',
        playerBenefit: 'Plays an early Nc3 and Bf4, threatening Nb5 intrusions and rapid kingside castling attacks.',
        moves: ['d4', 'd5', 'Nc3', 'Nf6', 'Bf4', 'c5', 'e3', 'cxd4', 'exd4', 'a6', 'Nf3', 'Bg4'],
      },
    ],
  },

  // 9. English Opening (Positional / Strategic)
  {
    id: 'english-opening',
    name: 'English Opening',
    eco: 'A10-A39',
    playstyle: 'Positional / Strategic',
    playerBenefit: 'Controls d5 from the flank with 1. c4, keeping pawn structures flexible and avoiding early forced tactical clashes.',
    summary: 'Flank opening playing c4 on move 1 to control d5 and establish flexible positional pressure.',
    keyIdeas: ['Flank control of d5', 'Kingside fianchetto Bg2', 'Reversed Sicilian structures'],
    sampleMoves: ['c4', 'e5', 'Nc3', 'Nf6'],
    bestLine: ['c4', 'e5', 'Nc3', 'Nf6', 'Nf3', 'Nc6', 'g3', 'd5', 'cxd5', 'Nxd5', 'Bg2', 'Nb6'],
    variations: [
      {
        id: 'symmetrical-english',
        name: 'Symmetrical English',
        eco: 'A30-A39',
        playstyle: 'Solid / Defensive',
        playerBenefit: 'Mirroring setup with 1... c5, leading to deep, nuanced positional maneuvering.',
        moves: ['c4', 'c5', 'Nc3', 'Nc6', 'g3', 'g6', 'Bg2', 'Bg7', 'Nf3', 'Nf6', 'O-O', 'O-O'],
      },
    ],
  },

  // 10. Grünfeld Defense (Dynamic / Counterattacking)
  {
    id: 'grunfeld-defense',
    name: 'Grünfeld Defense',
    eco: 'D80-D99',
    playstyle: 'Dynamic / Counterattacking',
    playerBenefit: 'Cedes the classical center on move 3 only to shatter it with piece activity, bishop diagonals, and queenside pawn breaks.',
    summary: 'Hypermodern counter-punch inviting White to build a giant pawn center, which Black immediately strikes with ...d5 and ...c5.',
    keyIdeas: ['Inviting central expansion', 'Kingside fianchetto Bg7', 'Undermining with ...c5'],
    sampleMoves: ['d4', 'Nf6', 'c4', 'g6', 'Nc3', 'd5'],
    bestLine: ['d4', 'Nf6', 'c4', 'g6', 'Nc3', 'd5', 'cxd5', 'Nxd5', 'e4', 'Nxc3', 'bxc3', 'Bg7', 'Bc4', 'c5'],
    variations: [
      {
        id: 'grunfeld-russian',
        name: 'Grünfeld Russian System',
        eco: 'D96-D99',
        playstyle: 'Positional / Strategic',
        playerBenefit: 'White uses 5. Qb3 to exert queen pressure on c4 and d5, avoiding the sharp central exchange sacrifice lines.',
        moves: ['d4', 'Nf6', 'c4', 'g6', 'Nc3', 'd5', 'Nf3', 'Bg7', 'Qb3', 'dxc4', 'Qxc4', 'O-O'],
      },
    ],
  },

  // 11. Slav Defense (Solid / Defensive)
  {
    id: 'slav-defense',
    name: 'Slav Defense',
    eco: 'D10-D19',
    playstyle: 'Solid / Defensive',
    playerBenefit: 'The most solid defense against 1. d4, creating a concrete central pawn wedge while developing the c8-bishop freely.',
    summary: 'Solid and enduring defense against the Queen\'s Gambit, bolstering d5 with ...c6 while preserving the c8-bishop\'s diagonal.',
    keyIdeas: ['Rock-solid d5 reinforcement', 'Free light-squared bishop', 'Queenside counterplay'],
    sampleMoves: ['d4', 'd5', 'c4', 'c6'],
    bestLine: ['d4', 'd5', 'c4', 'c6', 'Nf3', 'Nf6', 'Nc3', 'dxc4', 'a4', 'Bf5', 'e3', 'e6', 'Bxc4', 'Bb4'],
    variations: [
      {
        id: 'semi-slav',
        name: 'Semi-Slav Defense',
        eco: 'D43-D49',
        playstyle: 'Dynamic / Counterattacking',
        playerBenefit: 'Plays both ...c6 and ...e6, creating complex tactical counter-strikes like the Meran and Botvinnik variations.',
        moves: ['d4', 'd5', 'c4', 'c6', 'Nf3', 'Nf6', 'Nc3', 'e6', 'e3', 'Nbd7', 'Bd3', 'dxc4', 'Bxc4', 'b5'],
      },
    ],
  },

  // 12. Nimzo-Indian Defense (Positional / Strategic)
  {
    id: 'nimzo-indian-defense',
    name: 'Nimzo-Indian Defense',
    eco: 'E20-E59',
    playstyle: 'Positional / Strategic',
    playerBenefit: 'Pins the c3-knight with ...Bb4 to control e4 and ruin White\'s pawn structure with doubled pawns.',
    summary: 'Hypermodern defense where Black pins White\'s c3 knight with ...Bb4 to disrupt White\'s pawn center.',
    keyIdeas: ['Pinning the c3 knight', 'Inflicting doubled c-pawns on White', 'Control of e4'],
    sampleMoves: ['d4', 'Nf6', 'c4', 'e6', 'Nc3', 'Bb4'],
    bestLine: ['d4', 'Nf6', 'c4', 'e6', 'Nc3', 'Bb4', 'e3', 'O-O', 'Bd3', 'd5', 'Nf3', 'c5', 'O-O', 'Nc6'],
    variations: [
      {
        id: 'nimzo-classical',
        name: 'Nimzo-Indian Classical (4. Qc2)',
        eco: 'E32-E39',
        playstyle: 'Positional / Strategic',
        playerBenefit: 'Prevents doubled pawns with 4. Qc2 and keeps the bishop pair for a long strategic squeeze.',
        moves: ['d4', 'Nf6', 'c4', 'e6', 'Nc3', 'Bb4', 'Qc2', 'O-O', 'a3', 'Bxc3+', 'Qxc3', 'b6'],
      },
    ],
  },

  // 13. Scotch Game (Aggressive / Tactical)
  {
    id: 'scotch-game',
    name: 'Scotch Game',
    eco: 'C45',
    playstyle: 'Aggressive / Tactical',
    playerBenefit: 'Blows open the center with 3. d4, giving fast piece development and open attacking files for direct players.',
    summary: 'Direct central confrontation on move 3 aiming to blow open the center and achieve rapid piece activity.',
    keyIdeas: ['Early d4 central blast', 'Active minor piece development', 'Open center lines'],
    sampleMoves: ['e4', 'e5', 'Nf3', 'Nc6', 'd4'],
    bestLine: ['e4', 'e5', 'Nf3', 'Nc6', 'd4', 'exd4', 'Nxd4', 'Bc5', 'Be3', 'Qf6', 'c3', 'Nge7', 'Bc4', 'O-O'],
    variations: [
      {
        id: 'scotch-mieses',
        name: 'Scotch Mieses Variation',
        eco: 'C45',
        playstyle: 'Dynamic / Counterattacking',
        playerBenefit: 'Black plays 4... Nf6, provoking an immediate central clash with e5 and queen pins.',
        moves: ['e4', 'e5', 'Nf3', 'Nc6', 'd4', 'exd4', 'Nxd4', 'Nf6', 'Nxc6', 'bxc6', 'e5', 'Qe7', 'Qe2', 'Nd5'],
      },
    ],
  },

  // 14. King's Gambit (Aggressive / Tactical)
  {
    id: 'kings-gambit',
    name: "King's Gambit",
    eco: 'C30-C39',
    playstyle: 'Aggressive / Tactical',
    playerBenefit: 'Sacrifices the f-pawn on move 2 (2. f4) to dismantle Black\'s center and blast open the f-file for ferocious romantic attacking chess.',
    summary: 'Romantic, highly tactical opening offering White\'s f-pawn on move 2 to dismantle Black\'s center and seize the open f-file.',
    keyIdeas: ['Sacrifice on f4', 'Open f-file for kingside attack', 'Fast Bc4 and d4 pawn center'],
    sampleMoves: ['e4', 'e5', 'f4'],
    bestLine: ['e4', 'e5', 'f4', 'exf4', 'Nf3', 'g5', 'h4', 'g4', 'Ne5', 'Nf6', 'd4', 'd6', 'Nd3', 'Nxe4'],
    variations: [
      {
        id: 'kings-gambit-declined',
        name: "King's Gambit Declined",
        eco: 'C30',
        playstyle: 'Positional / Strategic',
        playerBenefit: 'Declines the gambit pawn with 2... Bc5, exploiting White\'s weakened king diagonal a7-g1.',
        moves: ['e4', 'e5', 'f4', 'Bc5', 'Nf3', 'd6', 'c3', 'Nf6', 'd4', 'exd4', 'cxd4', 'Bb6'],
      },
      {
        id: 'falkbeer-counter-gambit',
        name: 'Falkbeer Counter-Gambit',
        eco: 'C31-C32',
        playstyle: 'Dynamic / Counterattacking',
        playerBenefit: 'Counters White\'s gambit with an immediate central counter-strike 2... d5, wrestling the initiative.',
        moves: ['e4', 'e5', 'f4', 'd5', 'exd5', 'e4', 'd3', 'Nf6', 'dxe4', 'Nxe4', 'Nf3', 'Bc5'],
      },
    ],
  },

  // 15. Scandinavian Defense (Dynamic / Counterattacking)
  {
    id: 'scandinavian-defense',
    name: 'Scandinavian Defense',
    eco: 'B01',
    playstyle: 'Dynamic / Counterattacking',
    playerBenefit: 'Immediately challenges 1. e4 on move 1, opening up the d-file and avoiding all of White\'s prepared opening theory.',
    summary: 'Black immediately challenges White\'s e4 pawn on move 1, forcing an open center and rapid development.',
    keyIdeas: ['Immediate central confrontation', 'Queen retreat to a5/d6', 'Open center lines'],
    sampleMoves: ['e4', 'd5', 'exd5', 'Qxd5'],
    bestLine: ['e4', 'd5', 'exd5', 'Qxd5', 'Nc3', 'Qa5', 'd4', 'Nf6', 'Nf3', 'c6', 'Bc4', 'Bf5'],
    variations: [
      {
        id: 'scandinavian-modern',
        name: 'Scandinavian Modern (2... Nf6)',
        eco: 'B01',
        playstyle: 'Dynamic / Counterattacking',
        playerBenefit: 'Recaptures the d5 pawn with a knight rather than the queen, avoiding early knight harassment.',
        moves: ['e4', 'd5', 'exd5', 'Nf6', 'd4', 'Nxd5', 'Nf3', 'g6', 'Be2', 'Bg7', 'O-O', 'O-O'],
      },
    ],
  },

  // 16. Dutch Defense (Aggressive / Tactical)
  {
    id: 'dutch-defense',
    name: 'Dutch Defense',
    eco: 'A80-A99',
    playstyle: 'Aggressive / Tactical',
    playerBenefit: 'Fights for the e4 square from move 1 with 1... f5, generating immediate asymmetrical imbalances and kingside attacking lines.',
    summary: 'Aggressive asymmetrical response to 1. d4, staking an immediate claim on the e4 square with 1... f5.',
    keyIdeas: ['Control of e4 from move 1', 'Kingside attacking chances with Stonewall or Leningrad', 'Asymmetrical struggle'],
    sampleMoves: ['d4', 'f5'],
    bestLine: ['d4', 'f5', 'g3', 'Nf6', 'Bg2', 'e6', 'Nf3', 'd5', 'O-O', 'Bd6', 'c4', 'c6'],
    variations: [
      {
        id: 'leningrad-dutch',
        name: 'Leningrad Dutch',
        eco: 'A86-A89',
        playstyle: 'Dynamic / Counterattacking',
        playerBenefit: 'Combines the Dutch f5 thrust with a Kingside fianchetto (Bg7), launching sharp dynamic piece pressure.',
        moves: ['d4', 'f5', 'g3', 'Nf6', 'Bg2', 'g6', 'Nf3', 'Bg7', 'O-O', 'O-O', 'c4', 'd6'],
      },
    ],
  },

  // 17. Modern Benoni (Dynamic / Counterattacking)
  {
    id: 'modern-benoni',
    name: 'Modern Benoni',
    eco: 'A60-A79',
    playstyle: 'Dynamic / Counterattacking',
    playerBenefit: 'Cedes space in the center in exchange for an active queenside pawn majority and a monster dark-squared bishop.',
    summary: 'Dynamic fighting defense giving White a central space advantage in exchange for a queenside pawn majority and active piece counterplay.',
    keyIdeas: ['Queenside pawn majority', 'Dark-squared bishop along a1-h8', 'Dynamic imbalances'],
    sampleMoves: ['d4', 'Nf6', 'c4', 'c5'],
    bestLine: ['d4', 'Nf6', 'c4', 'c5', 'd5', 'e6', 'Nc3', 'exd5', 'cxd5', 'd6', 'e4', 'g6', 'Nf3', 'Bg7'],
    variations: [
      {
        id: 'benoni-fianchetto',
        name: 'Benoni Fianchetto Variation',
        eco: 'A62-A64',
        playstyle: 'Positional / Strategic',
        playerBenefit: 'White fianchettoes the light bishop to g2, blunting Black\'s tactical threats and controlling the center safely.',
        moves: ['d4', 'Nf6', 'c4', 'c5', 'd5', 'e6', 'Nc3', 'exd5', 'cxd5', 'd6', 'Nf3', 'g6', 'g3', 'Bg7', 'Bg2', 'O-O'],
      },
    ],
  },

  // 18. Vienna Game (Aggressive / Tactical)
  {
    id: 'vienna-game',
    name: 'Vienna Game',
    eco: 'C25-C29',
    playstyle: 'Aggressive / Tactical',
    playerBenefit: 'Controls d5 with 2. Nc3 before striking with f4, leading to deadly kingside sacrifices and rapid piece mobilization.',
    summary: 'Dynamic opening keeping options open by playing Nc3 before deciding on f4 or rapid kingside expansion.',
    keyIdeas: ['Flexible 2. Nc3 development', 'Vienna Gambit with f4', 'Kingside attacking chances'],
    sampleMoves: ['e4', 'e5', 'Nc3'],
    bestLine: ['e4', 'e5', 'Nc3', 'Nf6', 'f4', 'd5', 'fxe5', 'Nxe4', 'Qf3', 'Nc6', 'Bb5', 'Nxc3'],
    variations: [
      {
        id: 'vienna-gambit-accepted',
        name: 'Vienna Gambit Accepted',
        eco: 'C29',
        playstyle: 'Aggressive / Tactical',
        playerBenefit: 'White unleashes the deadly knight sacrifice on f7 (Hamppe-Allgaier motif) tearing the black king apart.',
        moves: ['e4', 'e5', 'Nc3', 'Nc6', 'f4', 'exf4', 'Nf3', 'g5', 'h4', 'g4', 'Ng5', 'h6', 'Nxf7'],
      },
    ],
  },
];

const matePatternCatalog: StudyMatePattern[] = [
  {
    id: 'fools-mate',
    name: "Fool's Mate",
    motif: 'Checkmate with queen and bishop on f7',
    summary: 'The fastest possible checkmate in chess, using the queen and bishop to attack the f7 square.',
    keyMoves: ['f3', 'e5', 'g4', 'Qh4#'],
    theme: 'Fastest mate',
  },
  {
    id: 'scholars-mate',
    name: "Scholar's Mate",
    motif: 'Queen and bishop battery on f7',
    summary: 'A classic pattern where the queen and bishop combine to deliver mate on f7.',
    keyMoves: ['e4', 'e5', 'Bc4', 'Nc6', 'Qh5', 'Nf6', 'Qxf7#'],
    theme: 'Queen battery',
  },
  {
    id: 'legal-mate',
    name: "Legal's Mate",
    motif: 'Knight and queen combination',
    summary: 'A known mating pattern built on tactical ideas with the queen and knight.',
    keyMoves: ['e4', 'e5', 'Nf3', 'd6', 'Bc4', 'h6', 'Nc3', 'c6', 'Nxe5', 'dxe5', 'Qh5', 'Nf6', 'Qxf7#'],
    theme: 'Knight support',
  },
  {
    id: 'smothered-mate',
    name: 'Smothered Mate',
    motif: 'Queen and knight restrict the king',
    summary: 'The king is trapped by friendly pieces and cannot move because the escape squares are controlled.',
    keyMoves: ['e4', 'e5', 'Nf3', 'd6', 'd4', 'Bg4', 'dxe5', 'Bxf3', 'Qd2', 'Bxc6', 'Qxf3', 'Nc6'],
    theme: 'King trapped',
  },
];

export const theoryLessons: TheoryLesson[] = [
  {
    id: 'scholars-mate',
    category: 'checkmate-pattern',
    name: "Scholar's Mate",
    difficulty: 'Beginner',
    summary: 'Use the queen and bishop together to attack the vulnerable f7 square.',
    objective: 'Deliver a fast checkmate using the queen-bishop battery.',
    keyIdeas: ['Develop the bishop to c4', 'Push the queen to h5', 'Exploit the f7 weakness'],
    keyMoves: ['e4', 'e5', 'Bc4', 'Nc6', 'Qh5', 'Nf6', 'Qxf7#'],
    theme: 'Queen battery',
  },
  {
    id: 'fools-mate',
    category: 'checkmate-pattern',
    name: "Fool's Mate",
    difficulty: 'Beginner',
    summary: 'The fastest possible checkmate happens when the kingside is left unguarded.',
    objective: 'Defend your king before the queen and bishop finish the attack.',
    keyIdeas: ['Do not move the f-pawn early', 'Protect the vulnerable f7 square', 'Use development before attacking'],
    keyMoves: ['f3', 'e5', 'g4', 'Qh4#'],
    theme: 'Fastest mate',
  },
  ...openingCatalog.map((opening) => ({
    id: opening.id,
    category: 'opening' as TheoryLessonCategory,
    name: opening.name,
    difficulty: (['italian-game', 'london-system', 'scotch-game', 'scandinavian-defense'].includes(opening.id)
      ? 'Beginner'
      : ['kings-indian-defense', 'nimzo-indian-defense', 'modern-benoni', 'grunfeld-defense', 'kings-gambit'].includes(opening.id)
      ? 'Advanced'
      : 'Intermediate') as 'Beginner' | 'Intermediate' | 'Advanced',
    summary: opening.summary,
    objective: opening.playerBenefit,
    keyIdeas: opening.keyIdeas,
    keyMoves: opening.bestLine,
    theme: opening.playstyle,
    eco: opening.eco,
    playstyle: opening.playstyle,
    playerBenefit: opening.playerBenefit,
    variations: opening.variations,
  })),
];

export const normalizeMove = (move: string) => move.trim().toLowerCase().replace(/\s+/g, ' ');

export const matchSequence = (moveList: string[], pattern: string[]) => {
  if (pattern.length === 0) return true;
  if (moveList.length < pattern.length) return false;

  for (let i = 0; i < pattern.length; i++) {
    if (normalizeMove(moveList[i]) !== normalizeMove(pattern[i])) {
      return false;
    }
  }

  return true;
};

export const formatMoveSequence = (moves: string[]): string => {
  const parts: string[] = [];
  for (let i = 0; i < moves.length; i += 2) {
    const moveNum = Math.floor(i / 2) + 1;
    const whiteMove = moves[i];
    const blackMove = moves[i + 1];
    if (blackMove) {
      parts.push(`${moveNum}. ${whiteMove} ${blackMove}`);
    } else {
      parts.push(`${moveNum}. ${whiteMove}`);
    }
  }
  return parts.join(' ');
};

export const detectOpeningFromMoves = (moves: string[]) => {
  const normalizedMoves = moves.map(normalizeMove);
  let bestMatch: StudyOpening | null = null;

  for (const opening of openingCatalog) {
    if (matchSequence(normalizedMoves, opening.sampleMoves)) {
      if (!bestMatch || opening.sampleMoves.length > bestMatch.sampleMoves.length) {
        bestMatch = opening;
      }
    }
  }

  return bestMatch;
};

export interface DetectedOpeningInfo {
  opening: StudyOpening;
  playstyle: OpeningPlaystyle;
  playerBenefit: string;
  bestLine: string[];
  nextBestMove: string | null;
  activeVariation: OpeningVariation | null;
  candidateVariations: OpeningVariation[];
  matchedPlies: number;
  isFollowingBestLine: boolean;
}

export const detectOpeningWithVariations = (moves: string[]): DetectedOpeningInfo | null => {
  const opening = detectOpeningFromMoves(moves);
  if (!opening) return null;

  const normalizedMoves = moves.map(normalizeMove);

  // Check how many moves match bestLine from start
  let bestLineMatchedPlies = 0;
  for (let i = 0; i < normalizedMoves.length && i < opening.bestLine.length; i++) {
    if (normalizedMoves[i] === normalizeMove(opening.bestLine[i])) {
      bestLineMatchedPlies = i + 1;
    } else {
      break;
    }
  }
  const isFollowingBestLine = bestLineMatchedPlies === normalizedMoves.length;

  // Check if any variation matches
  let activeVariation: OpeningVariation | null = null;
  for (const v of opening.variations) {
    let varMatchedPlies = 0;
    for (let i = 0; i < normalizedMoves.length && i < v.moves.length; i++) {
      if (normalizedMoves[i] === normalizeMove(v.moves[i])) {
        varMatchedPlies = i + 1;
      } else {
        break;
      }
    }
    if (varMatchedPlies === normalizedMoves.length && normalizedMoves.length >= opening.sampleMoves.length) {
      activeVariation = v;
      break;
    }
  }

  let nextBestMove: string | null = null;
  if (activeVariation && activeVariation.moves.length > normalizedMoves.length) {
    nextBestMove = activeVariation.moves[normalizedMoves.length];
  } else if (isFollowingBestLine && opening.bestLine.length > normalizedMoves.length) {
    nextBestMove = opening.bestLine[normalizedMoves.length];
  } else if (opening.bestLine.length > normalizedMoves.length) {
    nextBestMove = opening.bestLine[normalizedMoves.length];
  }

  return {
    opening,
    playstyle: activeVariation ? activeVariation.playstyle : opening.playstyle,
    playerBenefit: activeVariation ? activeVariation.playerBenefit : opening.playerBenefit,
    bestLine: opening.bestLine,
    nextBestMove,
    activeVariation,
    candidateVariations: opening.variations,
    matchedPlies: isFollowingBestLine ? bestLineMatchedPlies : normalizedMoves.length,
    isFollowingBestLine,
  };
};

export const getOpeningsByPlaystyle = (playstyle: OpeningPlaystyle | 'All'): StudyOpening[] => {
  if (playstyle === 'All') return openingCatalog;
  return openingCatalog.filter((o) => o.playstyle === playstyle);
};

export const getOpeningVariations = (openingId: string): OpeningVariation[] => {
  const opening = openingCatalog.find((o) => o.id === openingId);
  return opening?.variations ?? [];
};

export const getOpeningById = (id: string): StudyOpening | null => {
  return openingCatalog.find((o) => o.id === id) ?? null;
};

export const detectMatePatternFromMoves = (moves: string[]) => {
  const normalizedMoves = moves.map(normalizeMove);

  for (const pattern of matePatternCatalog) {
    if (matchSequence(normalizedMoves, pattern.keyMoves)) {
      return pattern;
    }
  }

  return null;
};

export const getTheoryLessonsByCategory = (category: TheoryLessonCategory) =>
  theoryLessons.filter((lesson) => lesson.category === category);

export const getTheoryLessonById = (id: string) =>
  theoryLessons.find((lesson) => lesson.id === id) ?? null;

export const getLessonProgress = (lesson: TheoryLesson, moves: string[]) => {
  const normalizedMoves = moves.map(normalizeMove);
  let matched = 0;

  for (let i = 0; i < lesson.keyMoves.length; i++) {
    const expected = normalizeMove(lesson.keyMoves[i]);
    const actual = normalizedMoves[i];

    if (actual === expected) {
      matched += 1;
    } else {
      break;
    }
  }

  return matched;
};

export const getLessonTargetMove = (lesson: TheoryLesson) => lesson.keyMoves[lesson.keyMoves.length - 1] ?? null;

export const createLessonPositionFEN = (lesson: TheoryLesson) => {
  const fenMap: Record<string, string> = {
    'scholars-mate': 'r1bqkb1r/pppp1ppp/2n2n2/4p2Q/2B1P3/8/PPPP1PPP/RNB1K1NR w KQkq - 0 6',
    'fools-mate': 'rnbqkbnr/pppp1ppp/8/4p3/8/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2',
    'sicilian-defense': 'rnbqkbnr/1p1ppppp/p1n5/8/3P4/5N2/PPP1PPPP/RNBQKB1R w KQkq - 0 3',
    'queens-gambit': 'rnbqkbnr/ppp1pppp/8/3p4/2P5/8/PP1PPPPP/RNBQKBNR w KQkq - 0 2',
    'italian-game': 'r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 0 3',
    'kings-indian-defense': 'rnbqkb1r/pppppppp/5n2/8/2P5/8/PP1PPPPP/RNBQKBNR w KQkq - 0 2',
  };

  return fenMap[lesson.id] ?? 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
};

export const detectRecurringMistakes = (moves: string[]): AdaptiveTrainerPrompt[] => {
  const normalized = moves.map(normalizeMove);
  const mistakes: AdaptiveTrainerPrompt[] = [];

  const queenEarlyCount = normalized.slice(0, 8).filter((move) => /^[q]/.test(move)).length;
  if (queenEarlyCount >= 1) {
    mistakes.push({
      type: 'queen-early',
      title: 'You are moving the queen out too early',
      message: 'Early queen sorties often create tactical vulnerabilities and give your opponent time to attack your king.',
      lessonId: 'scholars-mate',
      suggestedPractice: 'Develop minor pieces first and keep the queen for a tactical finish.',
      count: queenEarlyCount,
    });
  }

  const f7WeaknessSignals = normalized.filter(
    (move) => move === 'f3' || move === 'g4' || move.startsWith('qh4') || move.includes('qxf7')
  );
  if (f7WeaknessSignals.length >= 2) {
    mistakes.push({
      type: 'f7-weakness',
      title: 'You keep leaving the f7 square weak',
      message: 'The f7 square is a classic target. Repeated early pawn moves and queen checks often make it easier for the opponent to attack.',
      lessonId: 'fools-mate',
      suggestedPractice: 'Protect the king and avoid weakening the f7 square before development is complete.',
      count: f7WeaknessSignals.length,
    });
  }

  const developmentLag = normalized.slice(0, 8).filter((move) => !/^(e4|e5|d4|d5|c4|c5|nf3|nc3|bc4|bb5|f3|g4)$/.test(move));
  if (developmentLag.length >= 2) {
    mistakes.push({
      type: 'development-lag',
      title: 'Your development is lagging behind',
      message: 'A slow opening often turns into tactical trouble. Try to develop pieces and castle before chasing long-term threats.',
      lessonId: 'italian-game',
      suggestedPractice: 'Develop your knights and bishops before making extra pawn moves.',
      count: developmentLag.length,
    });
  }

  return mistakes;
};

export const getAdaptiveTrainerPrompt = (moves: string[]) => {
  const mistakes = detectRecurringMistakes(moves);
  if (mistakes.length === 0) return null;

  const severityOrder: Record<string, number> = {
    'f7-weakness': 3,
    'queen-early': 2,
    'development-lag': 1,
  };

  const bestMatch = mistakes.sort((a, b) => {
    const severityDelta = (severityOrder[b.type] ?? 0) - (severityOrder[a.type] ?? 0);
    if (severityDelta !== 0) return severityDelta;
    return b.count - a.count;
  })[0];

  return bestMatch;
};
