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
  {
    id: 'piece-tempo',
    title: 'The value of tempo and initiative in the opening',
    category: 'opening-principles',
    summary: 'A tempo is a single turn or move. Gaining tempi allows you to mobilize your forces before the opponent can coordinate their defense.',
    whyItMatters: 'Chess is a race against time. Wasting moves by moving the same piece repeatedly or capturing low-value pawns allows the opponent to establish an overwhelming attack.',
    keyIdeas: [
      'Do not move the same piece multiple times in the opening unless forced.',
      'Develop with threats to force the opponent to react and lose time.',
      'Gambits often surrender material deliberately to gain a decisive lead in tempi.',
    ],
    practicalExamples: [
      'The Morra Gambit against the Sicilian sacrifices a pawn with 2...dxc4 3. c3 dxc3 4. Nxc3 for rapid open diagonals and files.',
      'Developing a knight with Nf3 attacking an unprotected e5 pawn forces Black to respond defensively.',
    ],
    recommendedBooks: ['The Art of the Opening', 'Chess Fundamentals', 'My System'],
  },
  {
    id: 'space-advantage',
    title: 'Claiming and maintaining space',
    category: 'opening-principles',
    summary: 'Controlling territory beyond your fourth rank cramps the opponent’s army, depriving their pieces of natural squares.',
    whyItMatters: 'The player with more space can maneuver freely between flanks, while the cramped player suffers from piece congestion and communication breakdown.',
    keyIdeas: [
      'Advance central and wing pawns to push enemy pieces backward.',
      'When you have less space, trade pieces to alleviate cramping.',
      'Do not overextend your pawns, which can leave gaping holes behind them.',
    ],
    practicalExamples: [
      'The French Defense Advance Variation (1. e4 e6 2. d4 d5 3. e5) locks the center and clamps down on Black’s kingside.',
      'The King’s Indian Defense allows White space early, aiming to shatter the pawn chain later with ...f5 or ...c5.',
    ],
    recommendedBooks: ['Pawn Structure Chess', 'Judgement and Planning in Chess', 'Secrets of Modern Chess Strategy'],
  },
  {
    id: 'outpost-squares',
    title: 'Outpost squares for knights',
    category: 'positional-ideas',
    summary: 'An outpost is a square on the 4th, 5th, or 6th rank that cannot be attacked or driven away by an enemy pawn.',
    whyItMatters: 'Knights excel on outposts because their short-range power radiates across multiple key squares deep within enemy territory.',
    keyIdeas: [
      'Anchor your outpost with a friendly pawn so an enemy piece trade leaves a passed or protected pawn.',
      'Target squares weakened by the opponent’s pawn advances (holes).',
      'An outpost on the 6th rank is almost as powerful as a rook.',
    ],
    practicalExamples: [
      'In the Sicilian Sveshnikov, the d5 square is a permanent hole that White aims to occupy with a knight.',
      'A white knight anchored on e5 in the Queen’s Gambit exerts immense pressure against c6, d7, and f7.',
    ],
    recommendedBooks: ['My System', 'Simple Chess', 'The Amateur’s Mind'],
  },
  {
    id: 'open-files',
    title: 'Controlling open files and the 7th rank',
    category: 'positional-ideas',
    summary: 'Open files are the highways for rooks. Invading along an open file to reach the 7th rank is often a winning strategic milestone.',
    whyItMatters: 'A rook on the 7th rank attacks base pawns horizontally, confines the enemy king to the 8th rank, and creates deadly mating nets with another piece.',
    keyIdeas: [
      'Pawn trades create open files; claim them immediately with your rooks.',
      'Double rooks on an open file to prevent enemy blockades.',
      'The 7th rank is the blind swine rank when two rooks coordinate along it.',
    ],
    practicalExamples: [
      'Doubled rooks on the c-file in the English Opening penetrate to c7, paralyzing Black’s queenside.',
      'In rook endgames, seizing the only open file usually decides the game.',
    ],
    recommendedBooks: ['Logical Chess Move by Move', 'Capablanca’s Best Chess Endings', 'The Most Instructive Games of Chess Ever Played'],
  },
  {
    id: 'bishop-pair',
    title: 'The advantage of the bishop pair',
    category: 'positional-ideas',
    summary: 'Possessing both light- and dark-squared bishops against a bishop-knight or two knights provides total diagonal mastery.',
    whyItMatters: 'A single bishop is restricted to 32 squares, but the pair controls the entire 64-square geometry, particularly lethal in open positions without fixed pawn chains.',
    keyIdeas: [
      'Open the position with pawn breaks when you possess the bishop pair.',
      'Use the bishops to restrict and dominate enemy knights from a distance.',
      'Keep pawns on opposite colors of your active bishops to preserve diagonals.',
    ],
    practicalExamples: [
      'In the Italian Game Two Knights Defense, Black often accepts doubled pawns to gain the long-term bishop pair.',
      'In open endgames, the bishop pair easily outclasses two knights by cutting off king escape squares.',
    ],
    recommendedBooks: ['Secrets of Modern Chess Strategy', 'Mastering the Endgame', 'Chess Strategy for Club Players'],
  },
  {
    id: 'prophylaxis',
    title: 'Prophylactic thinking: Stop the opponent’s plan',
    category: 'positional-ideas',
    summary: 'Prophylaxis is the art of anticipating and neutralizing your opponent’s tactical threats and positional plans before they occur.',
    whyItMatters: 'Winning chess is not just about advancing your own agenda; it is about systematically destroying the opponent’s counterplay.',
    keyIdeas: [
      'Ask on every move: "What does my opponent want to play next?"',
      'Preemptively defend loose pieces and potential break squares.',
      'A quiet move like h3 or a3 can prevent pin motifs and maintain piece harmony.',
    ],
    practicalExamples: [
      'Petrosian and Karpov were legendary masters of prophylactic pawn moves that paralyzed aggressive opponents.',
      'Playing Kh1 in the King’s Indian avoids pins along the g1-a7 diagonal before launching ...f5.',
    ],
    recommendedBooks: ['My System', 'Positional Decision Making in Chess', 'Think Like a Grandmaster'],
  },
  {
    id: 'deflection-decoy',
    title: 'Deflection and decoy sacrifices',
    category: 'tactics',
    summary: 'Deflection forces an enemy piece away from a defensive post, while a decoy lures an enemy piece onto a vulnerable or mating square.',
    whyItMatters: 'Defenders can only guard what they can reach. Forcing a defending rook or queen off its key file or diagonal collapses the entire defensive fortress.',
    keyIdeas: [
      'Identify what critical task an enemy piece is performing (e.g. defending back rank).',
      'Sacrifice a lower-value piece to draw the defender away.',
      'Decoy the enemy king to an open square that allows a royal fork or checkmate.',
    ],
    practicalExamples: [
      'Sacrificing a queen on d8 to deflect a rook from guarding the back rank mate.',
      'Luring the king onto a dark square with a sacrifice to set up a fatal bishop skewer.',
    ],
    recommendedBooks: ['1001 Winning Chess Sacrifices and Combinations', 'Chess Tactics for Champions', 'The Complete Chess Workout'],
  },
  {
    id: 'overloaded-defender',
    title: 'Exploiting the overloaded defender',
    category: 'tactics',
    summary: 'An overloaded piece is one that is burdened with defending two or more independent targets simultaneously.',
    whyItMatters: 'When a piece has multiple duties, attacking one of those targets forces the defender to abandon the other, resulting in immediate material gain.',
    keyIdeas: [
      'Scan the board for pieces that protect both a piece and an important square.',
      'Strike the first defended piece; when it recaptures, capture the secondary prize.',
      'Queens are frequently overloaded because their mobility encourages multiple assignments.',
    ],
    practicalExamples: [
      'A queen defending both a knight on c3 and back-rank checkmate on e8.',
      'A bishop pinned to protecting a rook while simultaneously guarding against a knight fork.',
    ],
    recommendedBooks: ['Chess Tactics for Students', 'Modern Chess Strategy', 'Improve Your Chess Tactics'],
  },
  {
    id: 'interference',
    title: 'Interference: Severing defensive lines',
    category: 'tactics',
    summary: 'Interference involves placing a piece between two coordinating enemy pieces, cutting off their line of communication.',
    whyItMatters: 'Lines of defense (files, ranks, diagonals) require clear paths. Plunging a piece into the intersection forces a capture that severs the connection.',
    keyIdeas: [
      'Look for intersections where two defensive rays cross (e.g. a bishop diagonal and a rook file).',
      'Place a piece on the intersection square, often with check or counter-threat.',
      'Whichever enemy piece captures, the other piece’s line of defense is blocked.',
    ],
    practicalExamples: [
      'Placing a knight on d6 to sever a queen’s defense of a rook on b8 and checkmate on f7.',
      'Classic Novotny and Grimshaw tactical themes in puzzle compositions.',
    ],
    recommendedBooks: ['The Art of the Tactical Combination', 'Chess Tactics for Advanced Players', 'Understanding Chess Tactics'],
  },
  {
    id: 'zwischenzug',
    title: 'The Zwischenzug (In-between move)',
    category: 'tactics',
    summary: 'An unexpected intermediate check, threat, or capture inserted before the obvious or expected recapture in a combination.',
    whyItMatters: 'Most tactical oversights come from assuming the opponent must immediately recapture. A Zwischenzug completely alters the calculation tree.',
    keyIdeas: [
      'Always look for intermediate checks before recapturing a piece.',
      'An in-between move can create a new threat that forces an immediate retreat.',
      'Intermediate attacks on the queen often turn an equal trade into a decisive win.',
    ],
    practicalExamples: [
      'Instead of immediately recapturing a knight, playing a check that wins the queen.',
      'Playing ...Qh4+ before recapturing on d4 to disrupt the opponent’s castling rights.',
    ],
    recommendedBooks: ['Forcing Chess Moves', 'The Invisible Chess Move', 'Tactical Chess Training'],
  },
  {
    id: 'anastasia-mate',
    title: 'Anastasia’s Mate',
    category: 'checkmate-patterns',
    summary: 'A mating net where a knight on e7/e2 controls escape squares while a rook delivers the coup de grâce along the open file.',
    whyItMatters: 'This pattern frequently occurs against a castled king whose f-pawn and g-pawn have been stripped or blocked by friendly pieces.',
    keyIdeas: [
      'The knight seals the king’s escape squares on g8/g6 (or g1/g3).',
      'A sacrificial move (often Qxh7+) opens the h-file for the rook.',
      'The rook check down the h-file is fatal because the knight guards the only exits.',
    ],
    practicalExamples: [
      '1. Ne7+ Kh8 2. Qxh7+ Kxh7 3. Rh1# (classic Anastasia pattern).',
      'Frequent pattern in games featuring kingside rook lifts and knight sacrifices.',
    ],
    recommendedBooks: ['The Art of Checkmate', '1001 Deadly Checkmates', 'The Checkmate Pattern Manual'],
  },
  {
    id: 'arabian-mate',
    title: 'The Arabian Mate',
    category: 'checkmate-patterns',
    summary: 'A historic mating motif using only a knight and rook to corner and checkmate the enemy king.',
    whyItMatters: 'The knight on f6 (or c6/f3) guards the corner square while defending the rook that delivers checkmate directly adjacent to the king.',
    keyIdeas: [
      'The knight controls the critical escape squares (e.g. g8 and f7) from f6.',
      'The rook delivers mate on h8 or h7 with knight protection.',
      'One of the oldest documented mating patterns in chess history, dating back over a thousand years.',
    ],
    practicalExamples: [
      'Knight on f6, Rook slides to h7# against a King on h8.',
      'Decoying the king into the corner with a rook check and finishing with knight harmony.',
    ],
    recommendedBooks: ['The Art of Checkmate', 'Chess: 5334 Problems, Combinations and Games', 'The Checkmate Pattern Manual'],
  },
  {
    id: 'boden-mate',
    title: 'Boden’s Mate',
    category: 'checkmate-patterns',
    summary: 'Two bishops criss-crossing across intersecting diagonals deliver checkmate against a king obstructed by its own pieces.',
    whyItMatters: 'This aesthetic mate demonstrates the ferocious power of open bishop diagonals when the king’s flight squares are congested by friendly rooks or pawns.',
    keyIdeas: [
      'Two active bishops attack diagonally across the enemy king’s position.',
      'Friendly pieces (such as a queen or pawn) inadvertently block the king’s flight paths.',
      'Often preceded by a queen sacrifice on c6 or d7 to rip open the diagonals.',
    ],
    practicalExamples: [
      'Samuel Boden’s famous 1853 game: Queen sacrifice on c6 followed by Ba6#.',
      'Common against queenside castled kings where the c-file and d-file are partially blocked.',
    ],
    recommendedBooks: ['The Art of Checkmate', 'Checkmate: The Power of Bishop Combinations', 'The Mammoth Book of the World’s Greatest Chess Games'],
  },
  {
    id: 'king-activity',
    title: 'The King as an active attacking engine',
    category: 'endgame',
    summary: 'In the endgame, the king transforms from a timid target hiding in the corner into a ferocious, dominant attacking piece.',
    whyItMatters: 'Without queens on the board, the danger of checkmate diminishes drastically. A centralized king is worth approximately 4 points of material in an endgame.',
    keyIdeas: [
      'March your king immediately toward the center as soon as queens are traded.',
      'Use the king to escort passed pawns and blockade opponent passers.',
      'An active king can outflank a passive king to capture entire pawn chains.',
    ],
    practicalExamples: [
      'In king-and-pawn endings, the player whose king reaches the center first almost always wins.',
      'Karpov and Capablanca consistently converted microscopic advantages by activating their kings.',
    ],
    recommendedBooks: ['Endgame Strategy', 'Silman’s Complete Endgame Course', 'Dvoretsky’s Endgame Manual'],
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
  getKnowledgeTopicById('piece-tempo'),
  getKnowledgeTopicById('space-advantage'),
  getKnowledgeTopicById('minor-piece-activity'),
  getKnowledgeTopicById('weak-squares'),
  getKnowledgeTopicById('piece-coordination'),
  getKnowledgeTopicById('outpost-squares'),
  getKnowledgeTopicById('open-files'),
  getKnowledgeTopicById('bishop-pair'),
  getKnowledgeTopicById('prophylaxis'),
  getKnowledgeTopicById('forks'),
  getKnowledgeTopicById('pins'),
  getKnowledgeTopicById('skewers'),
  getKnowledgeTopicById('discovered-attack'),
  getKnowledgeTopicById('deflection-decoy'),
  getKnowledgeTopicById('overloaded-defender'),
  getKnowledgeTopicById('interference'),
  getKnowledgeTopicById('zwischenzug'),
  getKnowledgeTopicById('back-rank-mate'),
  getKnowledgeTopicById('batteries'),
  getKnowledgeTopicById('anastasia-mate'),
  getKnowledgeTopicById('arabian-mate'),
  getKnowledgeTopicById('boden-mate'),
  getKnowledgeTopicById('pawn-structure'),
  getKnowledgeTopicById('passed-pawns'),
  getKnowledgeTopicById('king-activity'),
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
