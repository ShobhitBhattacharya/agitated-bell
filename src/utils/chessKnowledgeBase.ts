export type KnowledgeCategory =
  | 'opening-principles'
  | 'positional-ideas'
  | 'tactics'
  | 'endgame'
  | 'checkmate-patterns';

export type KnowledgeTopic = {
  id: string;
  title: string;
  category: KnowledgeCategory;
  summary: string;
  whyItMatters: string;
  keyIdeas: string[];
  practicalExamples: string[];
  recommendedBooks: string[];
};

export const chessKnowledgeBase: KnowledgeTopic[] = [
  {
    id: 'develop-first',
    title: 'Develop before you attack',
    category: 'opening-principles',
    summary: 'Early development is the foundation of good chess. A piece that is developed is more useful than a pawn that is advanced but unprotected.',
    whyItMatters:
      'The side that develops faster usually gains space, king safety, and tactical options. Moving too many pawns early can create weaknesses and reduce coordination.',
    keyIdeas: [
      'Bring knights and bishops out before launching a major attack.',
      'Castle early when the center is open or your king is in danger.',
      'Avoid making unnecessary pawn moves in the opening unless they create a concrete advantage.',
    ],
    practicalExamples: [
      'In the Italian Game, developing the bishop to c4 and the knight to f3 is more purposeful than moving the queen out early.',
      'In the Sicilian, Black often counters with ...c5 to contest the center rather than moving pawns that weaken the kingside.',
    ],
    recommendedBooks: ['My System', 'Chess Fundamentals', 'Silman Complete Endgame Course'],
  },
  {
    id: 'central-control',
    title: 'Control the center',
    category: 'opening-principles',
    summary: 'The center is the most important battlefield because pieces can move to and from it with greater flexibility.',
    whyItMatters:
      'Pieces in the center attack more squares, support more pieces, and influence both wings. Controlling the center usually leads to better piece activity and stronger plans.',
    keyIdeas: [
      'Occupy or influence the central squares d4, e4, d5, e5.',
      'Use central pawns as anchors for your pieces.',
      'Break the center only when you understand the resulting imbalances.',
    ],
    practicalExamples: [
      'The Queen\'s Gambit creates central tension by playing c4 and d4, then uses cxd5 or c4-c5 to challenge the center.',
      'The Sicilian Defense accepts an asymmetrical center but aims to undermine White\'s central dominance later.',
    ],
    recommendedBooks: ['Logical Chess Move by Move', 'Reassess Your Chess', 'The Complete Manual of Positional Chess'],
  },
  {
    id: 'king-safety',
    title: 'King safety before tactical spectacle',
    category: 'opening-principles',
    summary: 'An attack is only good if your king is secure. Many games are lost by tactical greed rather than by the opponent\'s brilliance.',
    whyItMatters:
      'A king that remains in the center without castling often becomes vulnerable to open files, back-rank weaknesses, and mating nets.',
    keyIdeas: [
      'Castle early in most practical positions.',
      'Do not play too many attacking moves if your king is still in the middle.',
      'Keep the pieces defended around the king.',
    ],
    practicalExamples: [
      'Fool\'s Mate is a classic example of unsafe king development: f3 and g4 weaken the king before castling.',
      'Scholar\'s Mate succeeds because the queen and bishop work together against the weak f7 square.',
    ],
    recommendedBooks: ['Chess Fundamentals', 'The Amateur\'s Mind', 'The Art of Attack in Chess'],
  },
  {
    id: 'minor-piece-activity',
    title: 'Active minor pieces are often stronger than a passed pawn',
    category: 'positional-ideas',
    summary: 'Knights and bishops are often more powerful when they control important squares and create threats than when they sit on the rim.',
    whyItMatters:
      'A minor piece that is centralized and active can generate pressure that is harder to neutralize than a static pawn advantage.',
    keyIdeas: [
      'Centralize knights and place bishops on long diagonals.',
      'Use minor pieces to support major tactical motifs.',
      'Avoid leaving powerful pieces trapped behind your own pawns.',
    ],
    practicalExamples: [
      'A knight on e5 or c5 often deserves more credit than a small pawn advance elsewhere.',
      'A bishop on g2 or c4 can pressure the king or central weaknesses without needing a material exchange.',
    ],
    recommendedBooks: ['The Complete Book of Chess Strategy', 'Positional Chess Handbook', 'The Middle Game in Chess'],
  },
  {
    id: 'weak-squares',
    title: 'Weak squares explain long-term plans',
    category: 'positional-ideas',
    summary: 'Weak squares are permanent liabilities that become targets for occupation or attack. They are often more important than a single pawn in a theoretical line.',
    whyItMatters:
      'A weak square can become a permanent outpost for the opponent\'s pieces. If you can create a strong square, you often gain long-term strategic advantage.',
    keyIdeas: [
      'Avoid creating holes for the opponent to occupy.',
      'Use pawn chains to support important squares.',
      'Strong pieces benefit from outposts in the enemy camp.',
    ],
    practicalExamples: [
      'd5 and f7 are classic strategic weak points in many openings.',
      'A knight placed on e5 often attacks d7 and f7 while being hard to remove.',
    ],
    recommendedBooks: ['Dynamic Chess Strategy', 'Secrets of Modern Chess Strategy', 'My System'],
  },
  {
    id: 'piece-coordination',
    title: 'Coordinated pieces are stronger than scattered ones',
    category: 'positional-ideas',
    summary: 'A well-coordinated army creates threats while preserving harmony. Disconnected pieces often fail to support each other.',
    whyItMatters:
      'The strongest chess positions are not just about material; they are about geometry. If your pieces work together, you can generate threats with minimal force.',
    keyIdeas: [
      'Keep pieces protected and connected.',
      'Do not leave rooks, bishops, and knights in isolated lanes.',
      'Every move should improve the position of at least one piece.',
    ],
    practicalExamples: [
      'The queen-and-bishop battery against f7 is effective because the pieces support each other.',
      'A rook behind a passed pawn is better than a rook stuck on the side with no coordination.',
    ],
    recommendedBooks: ['Logical Chess Move by Move', 'The Art of Positional Play', 'Chess Strategy for Club Players'],
  },
  {
    id: 'forks',
    title: 'The fork creates multiple threats at once',
    category: 'tactics',
    summary: 'A fork attacks two or more targets simultaneously, often forcing material loss or checkmate.',
    whyItMatters:
      'Forks are among the most common tactical motifs because they combine pressure and forcing moves. A fork compels the defender to choose between multiple losses.',
    keyIdeas: [
      'Knights are famous for forks because of their L-shape movement.',
      'A fork often wins a queen if the king is not defended properly.',
      'Look for pieces that attack both the king and a high-value target.',
    ],
    practicalExamples: [
      'Knight forks on d5 or f7 are common tactical motifs.',
      'A queen and rook can fork king and rook in the same move in practical games.',
    ],
    recommendedBooks: ['Chess Tactics for Students', '1001 Chess Tactics', 'The Complete Book of Chess Tactics'],
  },
  {
    id: 'pins',
    title: 'The pin is a positional and tactical weapon',
    category: 'tactics',
    summary: 'A pin restricts a piece because moving it would expose a more valuable piece behind it.',
    whyItMatters:
      'Pins are powerful because they can force the opponent to keep a piece in place even when it wants to move. They create tactical and strategic threats over time.',
    keyIdeas: [
      'Pins are strongest when the pinned piece is the king or queen.',
      'A bishop or rook can pin the king or defender to a square.',
      'A pin can be temporary, but it still matters even when it is not immediate.',
    ],
    practicalExamples: [
      'A bishop on c4 pinning the f7 square is a classic strategic motif in openings.',
      'A rook pin to the king can create a discovered attack or even a checkmate pattern later.',
    ],
    recommendedBooks: ['The Art of Attack in Chess', 'Chess Tactics for Students', 'The Tactical Chess Training Manual'],
  },
  {
    id: 'skewers',
    title: 'The skewer is the reverse of the pin',
    category: 'tactics',
    summary: 'A skewer attacks a valuable piece in front of another, forcing the front piece to move and exposing the next one.',
    whyItMatters:
      'A skewer is often winning because it exploits the idea of piece value and mobility under pressure, especially in doubled pieces and back-rank situations.',
    keyIdeas: [
      'Look for rooks, bishops, and queens along a file or diagonal.',
      'A skewer can win a queen or force a key defensive move.',
      'The more valuable piece is usually the one behind the first one to move.',
    ],
    practicalExamples: [
      'A rook skewer on the 7th rank can win a queen or force a move that lets mate occur.',
      'A bishop may skewer king and rook along the diagonal in open positions.',
    ],
    recommendedBooks: ['The Chess Tactics Workbook', 'Chess Tactics for Students', 'The Art of Attack in Chess'],
  },
  {
    id: 'discovered-attack',
    title: 'Discovered attacks exploit hidden lines',
    category: 'tactics',
    summary: 'A discovered attack occurs when moving one piece reveals an attack by another piece along a line.',
    whyItMatters:
      'This motif can produce a double threat: one piece moves, while another piece suddenly creates a direct attack. It is a common tactical mechanism in many games.',
    keyIdeas: [
      'Check whether moving a rook or bishop opens a line for the queen or bishop.',
      'Look for pieces where the discovered attack also creates a fork or check.',
      'A quiet move can be tactical if it opens a hidden line.',
    ],
    practicalExamples: [
      'The queen often becomes active after moving a blocking piece away from a central line.',
      'A knight jump can open a bishop or rook line that results in a tactical win.',
    ],
    recommendedBooks: ['Silman\'s Endgame Course', 'Chess Tactics for Champions', 'The Complete Book of Chess Tactics'],
  },
  {
    id: 'back-rank-mate',
    title: 'Back-rank mating patterns',
    category: 'checkmate-patterns',
    summary: 'A king trapped on the back rank with no escape squares is a classic mating pattern.',
    whyItMatters:
      'Back-rank mates teach the importance of king safety, piece coordination, and the devastating effect of a rook or queen on the open file.',
    keyIdeas: [
      'A king stuck on the back rank can be mated by a rook or queen if squares are blocked.',
      'A rook on the seventh rank can create a mate net with minimal material.',
      'Back-rank mates often occur in endgames with reduced material.',
    ],
    practicalExamples: [
      'A rook on the 7th rank and a king trapped on the 1st or 8th rank is a common mating mechanism.',
      'The queen can deliver mate by taking away escape squares while checking from a distance.',
    ],
    recommendedBooks: ['The Art of Checkmate', 'The Complete Manual of Chess Checkmates', 'Fundamental Chess Endings'],
  },
  {
    id: 'batteries',
    title: 'The battery is a coordinated attack',
    category: 'checkmate-patterns',
    summary: 'A battery occurs when two pieces align on the same line to reinforce a threat, often leading to a tactical finish.',
    whyItMatters:
      'The queen and bishop battery on the diagonal to f7 is a classic way to exploit a weak square. This is why understanding piece alignment matters so much.',
    keyIdeas: [
      'Two pieces on the same line can create a threat beyond the strength of each one alone.',
      'Batteries are especially powerful when the opponent has a weak point like f7 or c7.',
      'The battery often forces a defensive response that leaves a king vulnerable.',
    ],
    practicalExamples: [
      'Scholar\'s Mate is a textbook example of the queen-bishop battery.',
      'Rook and queen lines on the seventh rank often create highly tactical mating combinations.',
    ],
    recommendedBooks: ['The Art of Attack in Chess', 'Chess Tactics for Students', 'The Complete Manual of Chess Checkmates'],
  },
  {
    id: 'pawn-structure',
    title: 'Pawns define the shape of the game',
    category: 'endgame',
    summary: 'Pawns determine the structure, space, and long-term plans. Good structure is often more valuable than temporary tactics.',
    whyItMatters:
      'Pawn structure lays the foundation for whether you have a strong or weak center, vulnerable squares, and a passed pawn. Endgames are often decided by how the pawns are arranged.',
    keyIdeas: [
      'Avoid creating isolated or doubled pawns unless you gain a concrete strategic goal.',
      'Passed pawns become powerful in the endgame.',
      'Backward pawns and holes can become permanent weaknesses.',
    ],
    practicalExamples: [
      'The Caro-Kann and French Defense often create asymmetrical pawn structures that influence strategic plans.',
      'A passed pawn on the sixth rank is often enough to win if the king can support it.',
    ],
    recommendedBooks: ['Pawn Structure Chess', 'The Complete Book of Chess Strategy', 'Fundamental Chess Endings'],
  },
  {
    id: 'passed-pawns',
    title: 'Passed pawns are the engine of endgames',
    category: 'endgame',
    summary: 'A passed pawn is a pawn with no opposing pawn in front of it to stop its advance. These are often decisive.',
    whyItMatters:
      'Passed pawns are central in endgames because they create a simple race for promotion and often require careful king support and timing.',
    keyIdeas: [
      'A passed pawn is powerful when the king can help it promote.',
      'The farther advanced the pawn, the more dangerous it becomes.',
      'The king often becomes the most important piece for support and blockade.',
    ],
    practicalExamples: [
      'The king race with a passed pawn is often easier to win than a more complicated endgame.',
      'Connected passed pawns are especially strong because they support each other.',
    ],
    recommendedBooks: ['Silman\'s Complete Endgame Course', 'Fundamental Chess Endings', 'Practical Endgame Lessons'],
  },
];

export const getKnowledgeTopicsByCategory = (category: KnowledgeCategory) =>
  chessKnowledgeBase.filter((topic) => topic.category === category);

export const getKnowledgeTopicById = (id: string) =>
  chessKnowledgeBase.find((topic) => topic.id === id) ?? null;

export const getStudyRoadmap = () => [
  getKnowledgeTopicById('develop-first'),
  getKnowledgeTopicById('central-control'),
  getKnowledgeTopicById('king-safety'),
  getKnowledgeTopicById('minor-piece-activity'),
  getKnowledgeTopicById('weak-squares'),
  getKnowledgeTopicById('piece-coordination'),
  getKnowledgeTopicById('forks'),
  getKnowledgeTopicById('pins'),
  getKnowledgeTopicById('skewers'),
  getKnowledgeTopicById('discovered-attack'),
  getKnowledgeTopicById('back-rank-mate'),
  getKnowledgeTopicById('batteries'),
  getKnowledgeTopicById('pawn-structure'),
  getKnowledgeTopicById('passed-pawns'),
].filter((topic): topic is NonNullable<typeof topic> => Boolean(topic));

export const getNextStudyTopic = (currentId: string) => {
  const roadmap = getStudyRoadmap();
  const currentIndex = roadmap.findIndex((topic) => topic.id === currentId);
  return currentIndex >= 0 ? roadmap[currentIndex + 1] ?? null : roadmap[0] ?? null;
};

export const getStudyProgress = (completedTopicIds: string[]) => {
  const roadmap = getStudyRoadmap();
  const completed = new Set(completedTopicIds);
  const completedCount = roadmap.filter((topic) => completed.has(topic.id)).length;

  return {
    completed: completedCount,
    total: roadmap.length,
    percent: Math.round((completedCount / roadmap.length) * 100),
  };
};

export const getStudyStreak = (completedTopicIds: string[]) =>
  completedTopicIds.filter((id, index, ids) => ids.indexOf(id) === index).length;
