export const difficulties = ['Easy', 'Medium', 'Hard', 'Adaptive'];

export const categories = [
  { id: 'quantitative', name: 'Quantitative Aptitude', subtopics: ['Algebra', 'Arithmetic', 'Geometry'] },
  { id: 'logical', name: 'Logical Reasoning', subtopics: ['Puzzles', 'Series', 'Deductions'] },
  { id: 'verbal', name: 'Verbal Ability', subtopics: ['Grammar', 'Comprehension', 'Vocab'] },
  { id: 'fullmock', name: 'Full Mock Test', subtopics: ['Mixed topics', 'Standard pattern'] },
];

export const data = [
  {//Quantitative Aptitude Questions

    question: "A train running at the speed of 60 km/hr crosses a pole in 9 seconds. What is the length of the train?",
    option1: "120 metres",
    option2: "180 metres",
    option3: "324 metres",
    option4: "150 metres",
    ans: 4,
    explanation: "Speed = \\( 60 \\times \\frac{5}{18} \\) m/sec = \\( \\frac{50}{3} \\) m/sec.<br>Length of the train = (Speed × Time) = \\( \\frac{50}{3} \\times 9 \\) m = 150 m."
  },
  {
    question: "A and B can do a work in 8 days, B and C can do the same work in 12 days. A, B, and C together can finish it in 6 days. A and C together will do it in:",
    option1: "4 days",
    option2: "6 days",
    option3: "8 days",
    option4: "12 days",
    ans: 3,
    explanation: "Work done by (A + B + C) in 1 day = \\( \\frac{1}{6} \\).<br>Work done by (A + B) in 1 day = \\( \\frac{1}{8} \\).<br>Work done by (B + C) in 1 day = \\( \\frac{1}{12} \\).<br>Therefore, Work done by A in 1 day = (A+B+C)'s - (B+C)'s = \\( \\frac{1}{6} - \\frac{1}{12} = \\frac{1}{12} \\).<br>Work done by C in 1 day = (A+B+C)'s - (A+B)'s = \\( \\frac{1}{6} - \\frac{1}{8} = \\frac{1}{24} \\).<br>Work done by (A + C) in 1 day = \\( \\frac{1}{12} + \\frac{1}{24} = \\frac{3}{24} = \\frac{1}{8} \\).<br>So, A and C together will do the work in 8 days."
  },
  {
    question: "A pump can fill a tank with water in 2 hours. Because of a leak, it took 2 1/3 hours to fill the tank. The leak can drain all the water of the tank in:",
    option1: "7 hours",
    option2: "8 hours",
    option3: "14 hours",
    option4: "12 hours",
    ans: 3,
    explanation: "Work done by the pump in 1 hour = \\( \\frac{1}{2} \\).<br>Work done by (Pump - Leak) in 1 hour = \\( \\frac{3}{7} \\) (since \\( 2 \\frac{1}{3} = \\frac{7}{3} \\) hours).<br>Work done by the leak in 1 hour = \\( \\frac{1}{2} - \\frac{3}{7} = \\frac{1}{14} \\).<br>Therefore, the leak will empty the tank in 14 hours."
  },
  {
    question: "Two numbers are in the ratio 15:11. If their H.C.F. is 13, find the numbers.",
    option1: "195 and 143",
    option2: "190 and 140",
    option3: "185 and 163",
    option4: "155 and 115",
    ans: 1,
    explanation: "Let the numbers be 15x and 11x.<br>Since H.C.F. is x, and given H.C.F is 13, we have x = 13.<br>The numbers are \\( 15 \\times 13 = 195 \\) and \\( 11 \\times 13 = 143 \\)."
  },
  {
    question: "A sum of money at simple interest amounts to Rs. 815 in 3 years and to Rs. 854 in 4 years. The sum is:",
    option1: "Rs. 650",
    option2: "Rs. 690",
    option3: "Rs. 698",
    option4: "Rs. 700",
    ans: 3,
    explanation: "Simple Interest (S.I.) for 1 year = Rs. (854 - 815) = Rs. 39.<br>S.I. for 3 years = Rs. \\( 39 \\times 3 \\) = Rs. 117.<br>Principal = Amount after 3 years - S.I. for 3 years = Rs. 815 - 117 = Rs. 698."
  },
  {
    question: "What percentage of numbers from 1 to 70 have 1 or 9 in the unit's digit?",
    option1: "1",
    option2: "14",
    option3: "20",
    option4: "21",
    ans: 3,
    explanation: "Numbers with 1 in unit's digit: 1, 11, 21, 31, 41, 51, 61 (Total 7).<br>Numbers with 9 in unit's digit: 9, 19, 29, 39, 49, 59, 69 (Total 7).<br>Total such numbers = 14.<br>Percentage = \\( \\frac{14}{70} \\times 100 = 20\\% \\)."
  },
  {
     question: "In a 100 m race, A can beat B by 25 m and B can beat C by 4 m. In the same race, A can beat C by:",
     option1: "21 m",
     option2: "26 m",
     option3: "28 m",
     option4: "29 m",
     ans: 3,
     explanation: "When A covers 100m, B covers 75m.<br>When B covers 100m, C covers 96m.<br>When B covers 75m, C covers \\( \\frac{96}{100} \\times 75 = 72 \\)m.<br>Therefore, when A covers 100m, C covers 72m.<br>A beats C by \\( 100 - 72 = 28 \\)m."
  },
  {//Logical Reasoning Questions
    question: "If all Zips are Zaps and some Zaps are Zops, which conclusion is definitely true?",
    option1: "All Zips are Zops",
    option2: "Some Zops are Zips",
    option3: "Some Zaps are Zips",
    option4: "No Zip is a Zop",
    ans: 3,
    explanation: "1. All Zips are Zaps (Inner circle Zip, Outer circle Zap).<br>2. Some Zaps are Zops (Zops circle intersects Zap circle).<br>We do not know if Zops intersects Zips. However, since all Zips are inside Zaps, the part of Zap that is a Zip confirms that 'Some Zaps are Zips' is logically necessary."
  },
  {
    question: "Look at this series: 2, 1, (1/2), (1/4), ... What number should come next?",
    option1: "(1/3)",
    option2: "(1/8)",
    option3: "(2/8)",
    option4: "(1/16)",
    ans: 2,
    explanation: "This is a simple division series; each number is one-half of the previous number.<br>\\( \\frac{1}{4} \\div 2 = \\frac{1}{8} \\)."
  },
  {
    question: "Pointing to a photograph of a boy Suresh said, 'He is the son of the only son of my mother.' How is Suresh related to that boy?",
    option1: "Brother",
    option2: "Uncle",
    option3: "Cousin",
    option4: "Father",
    ans: 4,
    explanation: "The boy is the son of the 'only son of my mother'.<br>The 'only son of my mother' is Suresh himself.<br>Therefore, the boy is the son of Suresh.<br>Suresh is the Father of the boy."
  },
  {
    question: "In a certain code language, 'COMPUTER' is written as 'RFUVQNPC'. How will 'MEDICINE' be written in that code?",
    option1: "MFEDJJOE",
    option2: "EOJDEJFM",
    option3: "MFEJDJOE",
    option4: "EOJDJEFM",
    ans: 4,
    explanation: "The letters of the word are written in reverse order and each letter is moved one step forward (next alphabet).<br>Reverse of MEDICINE = ENICIDEM.<br>Move +1: E->F, N->O, I->J, C->D, I->J, D->E, E->F, M->N. <br>Wait, let's re-check the pattern logic of COMPUTER -> RFUVQNPC.<br>R(Last) -> R, E->F, T->U... Correct. It is reverse order, then +1 (immediate next letter), but keeping the first and last same? No, purely reverse then +1 logic.<br>Let's check: C->D? No, C becomes C at end? No. <br>Actually: Reverse the word: RETUPMOC. Then +1 to first (R)?? No. <br>Correct Logic: Reverse the word logic is often simpler. <br>Let's try: C(first) -> C(last). O(2nd) -> N(2nd last, -1). <br>Let's stick to a simpler standard logic used in these tests: <br>Explanation: The logic is: Reverse the word, then subtract/add 1. <br>Let's look at Option 4: EOJDJEFM. Reverse of MEDICINE is ENICIDEM. <br>E -> E (Same?), N->O (+1), I->J(+1), C->D(+1), I->J(+1), D->E(+1), E->F(+1), M->M(Same). <br>Therefore, first and last letters remain same, others +1 in reverse order."
  },
  {
    question: "Statement: The prices of petrol and diesel in the domestic market have remained unchanged for the past few months. <br>Assumption I: The crude oil prices in the international market have gone up. <br>Assumption II: The crude oil prices in the international market have remained stable.",
    option1: "Only assumption I is implicit",
    option2: "Only assumption II is implicit",
    option3: "Either I or II is implicit",
    option4: "Neither I nor II is implicit",
    ans: 3,
    explanation: "Domestic prices generally stay unchanged if the international prices are stable (II), OR if the government/companies decide to absorb the shock despite a rise (I). Since we don't know the policy, either the prices didn't change (stable market) or they rose but weren't passed on. Hence, Either I or II."
  },
{//Verbal Ability Questions
    question: "Find the synonym of the word: 'CANDID'",
    option1: "Apparent",
    option2: "Explicit",
    option3: "Frank",
    option4: "Bright",
    ans: 3,
    explanation: "Candid means truthful and straightforward; frank. 'Explicit' is close but 'Frank' captures the personality trait better."
  },
  {
    question: "Spot the error: 'He is one of the / tallest boy / in the class.'",
    option1: "He is one of the",
    option2: "tallest boy",
    option3: "in the class",
    option4: "No Error",
    ans: 2,
    explanation: "The correct phrase should be 'one of the tallest boys'. When using 'one of the', the noun following it must be plural."
  },
  {
    question: "Choose the correct preposition: 'The cat jumped ___ the table.'",
    option1: "in",
    option2: "upon",
    option3: "on",
    option4: "into",
    ans: 2,
    explanation: "'Upon' is used to denote movement onto a surface. 'On' usually suggests resting position. 'Jumped upon' captures the motion best."
  },
  {
    question: "Antonym of: 'ARTIFICIAL'",
    option1: "Red",
    option2: "Natural",
    option3: "Truthful",
    option4: "Solid",
    ans: 2,
    explanation: "Artificial means made by humans rather than occurring naturally. The direct opposite is Natural."
  },
  {
    question: "Rearrange the parts: <br>(P) The collector said that <br>(Q) the supply of water <br>(R) for irrigation <br>(S) dams should be released",
    option1: "PQRS",
    option2: "PSRQ",
    option3: "SPRQ",
    option4: "PQSR",
    ans: 4,
    explanation: "Correct order: The collector said that (P) the supply of water (Q) from the dams should be released (S) for irrigation (R). Or P-Q-S-R makes the most grammatical sense."
  },
  // --- QUANTITATIVE APTITUDE (Probability & Permutations) ---
  {
    question: "From a pack of 52 cards, two cards are drawn together at random. What is the probability of both the cards being kings?",
    option1: "1/15",
    option2: "1/221",
    option3: "25/57",
    option4: "35/256",
    ans: 2,
    explanation: "Total outcomes = Number of ways to choose 2 cards from 52 = \\( ^{52}C_2 = \\frac{52 \\times 51}{2 \\times 1} = 1326 \\).<br>Favorable outcomes = Choosing 2 kings from 4 kings = \\( ^4C_2 = \\frac{4 \\times 3}{2 \\times 1} = 6 \\).<br>Probability = \\( \\frac{6}{1326} = \\frac{1}{221} \\)."
  },
  {
    question: "In how many different ways can the letters of the word 'CORPORATION' be arranged so that the vowels always come together?",
    option1: "810",
    option2: "1440",
    option3: "50400",
    option4: "5760",
    ans: 3,
    explanation: "The word is CORPORATION. Total letters = 11.<br>Vowels = O, O, A, I, O (5 vowels). Consonants = C, R, P, R, T, N (6 consonants).<br>Treat the 5 vowels as 1 single unit. Total units = 6 consonants + 1 vowel unit = 7 units.<br>These 7 units can be arranged in \\( \\frac{7!}{2!} \\) ways (since R is repeated twice).<br>Inside the vowel unit (O, O, A, I, O), the 5 vowels can be arranged in \\( \\frac{5!}{3!} \\) ways (since O is repeated 3 times).<br>Total ways = \\( \\frac{7!}{2!} \\times \\frac{5!}{3!} = 2520 \\times 20 = 50400 \\)."
  },
  {
    question: "A bag contains 6 white and 4 black balls. 2 balls are drawn at random. Find the probability that they are of the same colour.",
    option1: "1/2",
    option2: "7/15",
    option3: "8/15",
    option4: "1/9",
    ans: 2,
    explanation: "Total balls = 10. Ways to draw 2 = \\( ^{10}C_2 = 45 \\).<br>Case 1 (Both White): \\( ^6C_2 = 15 \\).<br>Case 2 (Both Black): \\( ^4C_2 = 6 \\).<br>Total favorable = 15 + 6 = 21.<br>Probability = \\( \\frac{21}{45} = \\frac{7}{15} \\)."
  },
  {
    question: "Tickets numbered 1 to 20 are mixed up and then a ticket is drawn at random. What is the probability that the ticket drawn has a number which is a multiple of 3 or 5?",
    option1: "1/2",
    option2: "2/5",
    option3: "8/15",
    option4: "9/20",
    ans: 4,
    explanation: "Total outcomes = 20.<br>Multiples of 3: {3, 6, 9, 12, 15, 18} (6 numbers).<br>Multiples of 5: {5, 10, 15, 20} (4 numbers).<br>Common (Multiple of 15): {15} (1 number).<br>Favorable outcomes = n(3) + n(5) - n(Common) = 6 + 4 - 1 = 9.<br>Probability = \\( \\frac{9}{20} \\)."
  },

  // --- QUANTITATIVE APTITUDE (Boats, Streams & Mixtures) ---
  {
    question: "A boat can travel with a speed of 13 km/hr in still water. If the speed of the stream is 4 km/hr, find the time taken by the boat to go 68 km downstream.",
    option1: "2 hours",
    option2: "3 hours",
    option3: "4 hours",
    option4: "5 hours",
    ans: 3,
    explanation: "Speed downstream = Speed of boat + Speed of stream = 13 + 4 = 17 km/hr.<br>Distance = 68 km.<br>Time = \\( \\frac{\\text{Distance}}{\\text{Speed}} = \\frac{68}{17} = 4 \\) hours."
  },
  {
    question: "A man swims downstream 72 km and upstream 45 km taking 9 hours each time. What is the speed of the stream?",
    option1: "1.5 km/hr",
    option2: "2 km/hr",
    option3: "2.5 km/hr",
    option4: "3 km/hr",
    ans: 1,
    explanation: "Downstream speed (u) = \\( \\frac{72}{9} = 8 \\) km/hr.<br>Upstream speed (v) = \\( \\frac{45}{9} = 5 \\) km/hr.<br>Speed of stream = \\( \\frac{1}{2}(u - v) = \\frac{1}{2}(8 - 5) = 1.5 \\) km/hr."
  },
  {
    question: "In what ratio must rice at Rs. 9.30 per kg be mixed with rice at Rs. 10.80 per kg so that the mixture be worth Rs. 10 per kg?",
    option1: "3:7",
    option2: "6:5",
    option3: "8:7",
    option4: "4:3",
    ans: 3,
    explanation: "By the rule of alligation:<br>Cost of cheap (9.30) &nbsp;&nbsp;&nbsp;&nbsp; Cost of dear (10.80)<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Mean Price (10.00)<br>d - m = 10.80 - 10 = 0.80<br>m - c = 10 - 9.30 = 0.70<br>Ratio = 0.80 : 0.70 = 8 : 7."
  },
  
  // --- LOGICAL REASONING (Direction, Blood Relations, Seating) ---
  {
    question: "A man walks 5 km toward south and then turns to the right. After walking 3 km he turns to the left and walks 5 km. Now in which direction is he from the starting place?",
    option1: "West",
    option2: "South",
    option3: "North-East",
    option4: "South-West",
    ans: 4,
    explanation: "1. Walks South 5km.<br>2. Turns Right (which is West) and walks 3km.<br>3. Turns Left (which is South again) and walks 5km.<br>Final position is South and West of the starting point. So, South-West."
  },
  {
    question: "Find the odd one out: 3, 5, 11, 14, 17, 21",
    option1: "21",
    option2: "17",
    option3: "14",
    option4: "3",
    ans: 3,
    explanation: "3, 5, 11, 17 are all prime numbers.<br>14 and 21 are not prime.<br>However, looking closer at the series logic: Alternating primes? No. <br>Simple logic: 3, 5, 11, 17 are Prime. 14 and 21 are composite. But usually there is only one odd man out.<br>Let's check differences: 5-3=2, 11-5=6, 14-11=3, 17-14=3... Irregular.<br>Standard Answer key logic: 14 is the only even number in the series."
  },
  {
    question: "Statements: All huts are bungalows. All bungalows are churches.<br>Conclusion I: Some churches are huts.<br>Conclusion II: Some churches are bungalows.",
    option1: "Only I follows",
    option2: "Only II follows",
    option3: "Neither I nor II follows",
    option4: "Both I and II follow",
    ans: 4,
    explanation: "If All A are B, and All B are C, then All A are C.<br>Diagram: Inner(Huts) -> Middle(Bungalows) -> Outer(Churches).<br>Since Huts are inside Churches, some Churches are definitely Huts (I follows).<br>Since Bungalows are inside Churches, some Churches are Bungalows (II follows)."
  },
  {
    question: "Pointing to a lady, a man said, 'The son of her only brother is the brother of my wife.' How is the lady related to the man?",
    option1: "Mother-in-law",
    option2: "Sister of father-in-law",
    option3: "Grandmother",
    option4: "Sister-in-law",
    ans: 2,
    explanation: "My wife's brother = My brother-in-law.<br>The son of (lady's only brother) = My brother-in-law.<br>So, the lady's brother is the father of my brother-in-law (and thus father of my wife).<br>So the lady's brother is my Father-in-law.<br>Therefore, the lady is the Sister of my Father-in-law."
  },
  {
    question: "Six friends A, B, C, D, E and F are sitting in a circle facing the center. E is to the left of D. C is between A and B. F is between E and A. Who is to the left of B?",
    option1: "C",
    option2: "D",
    option3: "E",
    option4: "F",
    ans: 2,
    explanation: "Arrangement (Clockwise starting from D): D, E, F, A, C, B.<br>Let's check constraints:<br>1. E is left of D (Correct).<br>2. C is between A and B (Correct).<br>3. F is between E and A (Correct).<br>Who is left of B? In a circle facing center, left of B is D."
  },

  // --- VERBAL ABILITY ---
  {
    question: "Choose the correct spelling:",
    option1: "Enterpreneur",
    option2: "Entrepreneur",
    option3: "Entreprneur",
    option4: "Enterprenuer",
    ans: 2,
    explanation: "The correct spelling is 'Entrepreneur'."
  },
  {
    question: "Idiom/Phrase: 'To keep the wolf from the door' means:",
    option1: "To avoid starvation",
    option2: "To guard against enemies",
    option3: "To be very cautious",
    option4: "To keep wild animals away",
    ans: 1,
    explanation: "It is an old idiom meaning to have enough money to be able to buy food and avoid hunger/starvation."
  },
  {
    question: "One word substitution: 'A person who does not believe in the existence of God'",
    option1: "Theist",
    option2: "Heretic",
    option3: "Atheist",
    option4: "Fanatic",
    ans: 3,
    explanation: "Atheist is one who disbelieves in God. (Theist believes, Heretic holds unorthodox opinions)."
  },
  {
    question: "Select the pair which has the same relationship: LIGHT : BLIND",
    option1: "SPEECH : DUMB",
    option2: "LANGUAGE : DEAF",
    option3: "TONGUE : SOUND",
    option4: "VOICE : VIBRATION",
    ans: 1,
    explanation: "Lack of Light is related to Blind (cannot see light). Lack of Speech is related to Dumb (cannot speak)."
  },
  {
    question: "Fill in the blank: The building was so old that it was ____ to collapse.",
    option1: "imminent",
    option2: "eminent",
    option3: "liable",
    option4: "destined",
    ans: 3,
    explanation: "Liable means 'likely to do something' (often used for negative events like collapsing). Imminent means 'about to happen' but usually used as 'Collapse was imminent', not 'It was imminent to collapse'."
  },

  // --- DATA SUFFICIENCY (Crucial for MNCs) ---
  {
    question: "What is the value of x? <br>Statement I: x + y = 10 <br>Statement II: x - y = 4",
    option1: "I alone is sufficient",
    option2: "II alone is sufficient",
    option3: "Both I and II are sufficient",
    option4: "Neither is sufficient",
    ans: 3,
    explanation: "From I: x = 10 - y (Infinite solutions). Not sufficient.<br>From II: x = 4 + y (Infinite solutions). Not sufficient.<br>Combining I & II: Adding equations gives 2x = 14 => x=7. Unique solution found.<br>Thus, Both are required."
  },
  {
    question: "Is z odd? <br>Statement I: 3z is odd. <br>Statement II: z + 2 is odd.",
    option1: "Either I or II is sufficient",
    option2: "Only I is sufficient",
    option3: "Only II is sufficient",
    option4: "Both are needed",
    ans: 1,
    explanation: "From I: If 3z is odd, z must be odd (since odd × odd = odd). Sufficient.<br>From II: If z + 2 is odd, z must be odd (since odd + even = odd). Sufficient.<br>So, Either statement alone is sufficient."
  },
  {
    question: "How is A related to B? <br>Statement I: A is the sister of C. <br>Statement II: C is the mother of B.",
    option1: "I alone is sufficient",
    option2: "II alone is sufficient",
    option3: "Both I and II are needed",
    option4: "Cannot be determined",
    ans: 3,
    explanation: "From I: A is C's sister. No mention of B.<br>From II: C is B's mother. No mention of A.<br>Combined: A is sister of C, and C is mother of B. So A is the Aunt (Mother's sister) of B.<br>Both are required."
  },
  // --- MENSURATION (Area & Volume) ---
  {
    question: "The length of the longest pole that can be placed in a room 12 m long, 9 m broad and 8 m high is:",
    option1: "15 m",
    option2: "16 m",
    option3: "17 m",
    option4: "18 m",
    ans: 3,
    explanation: "The longest pole is the diagonal of the cuboid.<br>Formula = \\( \\sqrt{l^2 + b^2 + h^2} \\).<br>Calculation = \\( \\sqrt{12^2 + 9^2 + 8^2} = \\sqrt{144 + 81 + 64} = \\sqrt{289} = 17 \\) m."
  },
  {
    question: "The capacity of a tank of dimensions (8 m × 6 m × 2.5 m) is:",
    option1: "120 litres",
    option2: "1200 litres",
    option3: "12000 litres",
    option4: "120000 litres",
    ans: 4,
    explanation: "Volume = \\( 8 \\times 6 \\times 2.5 = 120 \\) cubic meters.<br>Since 1 cubic meter = 1000 litres,<br>Capacity = \\( 120 \\times 1000 = 120000 \\) litres."
  },
  {
    question: "The ratio between the length and the breadth of a rectangular park is 3:2. If a man cycling along the boundary of the park at the speed of 12 km/hr completes one round in 8 minutes, then the area of the park (in sq. m) is:",
    option1: "15360",
    option2: "153600",
    option3: "30720",
    option4: "307200",
    ans: 2,
    explanation: "Perimeter = Distance covered in 8 min = \\( \\text{Speed} \\times \\text{Time} \\).<br>Speed = \\( 12 \\times \\frac{5}{18} = \\frac{10}{3} \\) m/sec.<br>Time = \\( 8 \\times 60 = 480 \\) sec.<br>Perimeter = \\( \\frac{10}{3} \\times 480 = 1600 \\) m.<br>2(3x + 2x) = 1600 => 10x = 1600 => x = 160.<br>Length = 480 m, Breadth = 320 m.<br>Area = \\( 480 \\times 320 = 153600 \\) sq. m."
  },
  {
    question: "If the radius of a circle is decreased by 50%, its area is reduced by:",
    option1: "25%",
    option2: "50%",
    option3: "75%",
    option4: "None of these",
    ans: 3,
    explanation: "Let original radius = r. Original Area = \\( \\pi r^2 \\).<br>New radius = 50% of r = \\( \\frac{r}{2} \\).<br>New Area = \\( \\pi (\\frac{r}{2})^2 = \\frac{\\pi r^2}{4} \\).<br>Decrease in area = \\( \\pi r^2 - \\frac{\\pi r^2}{4} = \\frac{3\\pi r^2}{4} \\).<br>Percentage decrease = \\( \\frac{3/4}{1} \\times 100 = 75\\% \\)."
  },

  // --- NUMBER SYSTEMS ---
  {
    question: "Which of the following numbers is exactly divisible by 24?",
    option1: "35718",
    option2: "63810",
    option3: "537804",
    option4: "3125736",
    ans: 4,
    explanation: "24 = 3 × 8. The number must be divisible by both 3 and 8.<br>Divisibility by 8: Last 3 digits must be divisible by 8.<br>Option 4 (736) is divisible by 8 (736/8 = 92).<br>Divisibility by 3: Sum of digits must be divisible by 3.<br>Option 4 Sum: 3+1+2+5+7+3+6 = 27 (Divisible by 3).<br>Therefore, 3125736 is divisible by 24."
  },
  {
    question: "The difference between a two-digit number and the number obtained by interchanging the positions of its digits is 36. What is the difference between the two digits of that number?",
    option1: "3",
    option2: "4",
    option3: "9",
    option4: "Cannot be determined",
    ans: 2,
    explanation: "Let the number be \\( 10x + y \\).<br>Interchanged number = \\( 10y + x \\).<br>Difference = \\( (10x + y) - (10y + x) = 9x - 9y = 9(x - y) \\).<br>Given that \\( 9(x - y) = 36 \\).<br>Therefore, \\( x - y = 4 \\)."
  },
  {
    question: "Find the remainder when \\( 2^{31} \\) is divided by 5.",
    option1: "1",
    option2: "2",
    option3: "3",
    option4: "4",
    ans: 3,
    explanation: "Pattern of unit digit of powers of 2: 2, 4, 8, 6, 2... (Cycle of 4).<br>Power 31 divided by 4 gives remainder 3.<br>So, unit digit of \\( 2^{31} \\) is same as \\( 2^3 \\) which is 8.<br>When a number ending in 8 is divided by 5, the remainder is 3."
  },
  {
    question: "The sum of first 45 natural numbers is:",
    option1: "1035",
    option2: "1280",
    option3: "2070",
    option4: "2140",
    ans: 1,
    explanation: "Sum of first n natural numbers = \\( \\frac{n(n+1)}{2} \\).<br>Here n = 45.<br>Sum = \\( \\frac{45 \\times 46}{2} = 45 \\times 23 = 1035 \\)."
  },

  // --- CALENDARS & CLOCKS ---
  {
    question: "What was the day of the week on 15th August, 1947?",
    option1: "Friday",
    option2: "Saturday",
    option3: "Thursday",
    option4: "Wednesday",
    ans: 1,
    explanation: "Count odd days:<br>1600 years = 0 odd days.<br>300 years (1601-1900) = 1 odd day.<br>46 years (1901-1946) = 11 leap + 35 ordinary = (11×2 + 35×1) = 57 days = 1 odd day.<br>Days in 1947 (Jan 1 to Aug 15) = 31+28+31+30+31+30+31+15 = 227 days = 3 odd days.<br>Total odd days = 1 + 1 + 3 = 5.<br>5 corresponds to Friday."
  },
  {
    question: "At what time between 4 and 5 o'clock will the hands of a watch point in opposite directions?",
    option1: "45 min. past 4",
    option2: "40 min. past 4",
    option3: "50 4/11 min. past 4",
    option4: "54 6/11 min. past 4",
    ans: 4,
    explanation: "At 4 o'clock, the hands are 20 min spaces apart.<br>To be in opposite directions, they must be 30 min spaces apart.<br>So, the minute hand must gain (20 + 30) = 50 min spaces.<br>Time = \\( 50 \\times \\frac{12}{11} \\) min past 4.<br>\\( \\frac{600}{11} = 54 \\frac{6}{11} \\) min past 4."
  },
  {
    question: "The angle between the minute hand and the hour hand of a clock when the time is 8:30 is:",
    option1: "80°",
    option2: "75°",
    option3: "60°",
    option4: "105°",
    ans: 2,
    explanation: "Formula: Angle \\( \\theta = |\\frac{11}{2}m - 30h| \\).<br>Here h=8, m=30.<br>\\( \\theta = |\\frac{11}{2}(30) - 30(8)| = |165 - 240| = |-75| = 75^{\\circ} \\)."
  },

  // --- LOGICAL & PUZZLES ---
  {
    question: "Statement: 'You are hereby appointed as a programmer with a probation period of one year and your confirmation will be at the end of the period provided your performance is satisfactory.' - A line in an appointment letter.<br>Assumption I: The performance of an individual generally is not known at the time of appointment offer.<br>Assumption II: Generally an individual tries to prove his worth in the probation period.",
    option1: "Only assumption I is implicit",
    option2: "Only assumption II is implicit",
    option3: "Both I and II are implicit",
    option4: "Neither I nor II is implicit",
    ans: 3,
    explanation: "The employer sets a probation period because they don't fully know the candidate's performance yet (Assumption I). The employer also expects the candidate to work hard to get confirmed, which justifies setting the condition (Assumption II). Both are implicit."
  },
  {
    question: "Insert the missing number: 7, 26, 63, 124, 215, 342, ?",
    option1: "391",
    option2: "421",
    option3: "481",
    option4: "511",
    ans: 4,
    explanation: "The series follows the pattern \\( n^3 - 1 \\).<br>\\( 2^3 - 1 = 7 \\)<br>\\( 3^3 - 1 = 26 \\)<br>...<br>\\( 7^3 - 1 = 342 \\)<br>Next is \\( 8^3 - 1 = 512 - 1 = 511 \\)."
  },
  {
    question: "Five girls are sitting on a bench to be photographed. Seema is to the left of Rani and to the right of Bindu. Mary is to the right of Rani. Reeta is between Rani and Mary. Who is sitting immediate right to Reeta?",
    option1: "Bindu",
    option2: "Rani",
    option3: "Mary",
    option4: "Seema",
    ans: 3,
    explanation: "Arrangement logic:<br>1. Seema is left of Rani, right of Bindu -> Bindu, Seema, Rani.<br>2. Mary is right of Rani.<br>3. Reeta is between Rani and Mary -> Rani, Reeta, Mary.<br>Combined: Bindu, Seema, Rani, Reeta, Mary.<br>Immediate right of Reeta is Mary."
  },

  // --- ENGLISH (Sentence Correction) ---
  {
    question: "Choose the correct sentence.",
    option1: "The police is coming.",
    option2: "The police are coming.",
    option3: "The police has been coming.",
    option4: "The polices are coming.",
    ans: 2,
    explanation: "'Police' is a collective noun that is treated as plural in English grammar when referring to the force or officers. Hence 'are' is correct."
  },
  {
    question: "Synonym of 'ABATE'",
    option1: "Aggravate",
    option2: "Decrease",
    option3: "Surface",
    option4: "Improve",
    ans: 2,
    explanation: "Abate means to become less intense or widespread; to reduce or decrease. Aggravate is the antonym."
  },
  {
    question: "Find the error: 'I prefer / coffee / than / tea.'",
    option1: "I prefer",
    option2: "coffee",
    option3: "than",
    option4: "tea",
    ans: 3,
    explanation: "The verb 'prefer' is always followed by the preposition 'to', not 'than'. Correct sentence: 'I prefer coffee to tea.'"
  },
  {
     question: "Choose the word which matches the definition: 'A cure for all diseases'",
     option1: "Laxative",
     option2: "Panacea",
     option3: "Antidote",
     option4: "Purgative",
     ans: 2,
     explanation: "Panacea is a solution or remedy for all difficulties or diseases."
  },
  {
    question: "If A = 1, FAT = 27, then FAITH = ?",
    option1: "44",
    option2: "42",
    option3: "41",
    option4: "40",
    ans: 1,
    explanation: "A=1, B=2, ... Z=26.<br>FAT = 6 + 1 + 20 = 27.<br>FAITH = 6 (F) + 1 (A) + 9 (I) + 20 (T) + 8 (H) = 44."
  },
  // --- PROFIT AND LOSS ---
  {
    question: "A shopkeeper cheats to the extent of 10% while buying as well as selling by using false weights. His total gain is:",
    option1: "20%",
    option2: "21%",
    option3: "22.22%",
    option4: "None of these",
    ans: 2,
    explanation: "Standard Formula for this specific fraud case: \\( \\text{Gain} \\% = \\left( \\frac{(100 + \\text{gain})(100 + \\text{gain})}{100} \\right) - 100 \\).<br>Alternatively, use the successive percentage formula: \\( A + B + \\frac{AB}{100} \\).<br>Here A=10, B=10.<br>Gain = \\( 10 + 10 + \\frac{10 \\times 10}{100} = 20 + 1 = 21\\% \\)."
  },
  {
    question: "If the cost price of 12 pens is equal to the selling price of 8 pens, the gain percent is:",
    option1: "25%",
    option2: "33.33%",
    option3: "50%",
    option4: "66.66%",
    ans: 3,
    explanation: "Let Cost Price (CP) of 1 pen = Rs. 1.<br>CP of 8 pens = Rs. 8.<br>Selling Price (SP) of 8 pens = CP of 12 pens = Rs. 12.<br>Gain = SP - CP = 12 - 8 = 4.<br>Gain % = \\( \\frac{\\text{Gain}}{\\text{CP}} \\times 100 = \\frac{4}{8} \\times 100 = 50\\% \\)."
  },
  {
    question: "A man sells two articles for Rs. 9900 each. On one he gains 10% and on the other he loses 10%. What is his overall gain or loss percent?",
    option1: "No gain, no loss",
    option2: "1% gain",
    option3: "1% loss",
    option4: "0.5% loss",
    ans: 3,
    explanation: "When two articles are sold at the same price, one at x% gain and the other at x% loss, there is always a LOSS.<br>Loss % = \\( \\frac{x^2}{100} \\).<br>Here x = 10.<br>Loss % = \\( \\frac{10^2}{100} = \\frac{100}{100} = 1\\% \\) loss."
  },
  {
    question: "By selling an article for Rs. 100, a man gains Rs. 15. Then his gain percent is:",
    option1: "15%",
    option2: "12.5%",
    option3: "17.65%",
    option4: "15.5%",
    ans: 3,
    explanation: "Selling Price (SP) = 100. Gain = 15.<br>Cost Price (CP) = SP - Gain = 100 - 15 = 85.<br>Gain % = \\( \\frac{15}{85} \\times 100 = \\frac{3}{17} \\times 100 \\approx 17.65\\% \\)."
  },
  {
    question: "The single discount equivalent to two successive discounts of 20% and 15% is:",
    option1: "35%",
    option2: "32%",
    option3: "34%",
    option4: "30%",
    ans: 2,
    explanation: "Formula: \\( x + y - \\frac{xy}{100} \\).<br>Here x=20, y=15.<br>Discount = \\( 20 + 15 - \\frac{20 \\times 15}{100} = 35 - 3 = 32\\% \\)."
  },

  // --- SIMPLE & COMPOUND INTEREST ---
  {
    question: "A sum of money doubles itself at compound interest in 15 years. In how many years will it become 8 times itself?",
    option1: "30 years",
    option2: "45 years",
    option3: "50 years",
    option4: "60 years",
    ans: 2,
    explanation: "If sum becomes \\( x \\) times in \\( n \\) years, it becomes \\( x^m \\) times in \\( m \\times n \\) years.<br>Here, doubles (2 times) in 15 years.<br>We want 8 times, which is \\( 2^3 \\).<br>So, time = \\( 3 \\times 15 = 45 \\) years."
  },
  {
    question: "The difference between simple and compound interest on a certain sum of money for 2 years at 4% per annum is Rs. 1. The sum is:",
    option1: "Rs. 600",
    option2: "Rs. 625",
    option3: "Rs. 560",
    option4: "Rs. 650",
    ans: 2,
    explanation: "For 2 years, Difference = \\( \\frac{P \\times R^2}{100^2} \\).<br>Here Diff = 1, R = 4.<br>1 = \\( \\frac{P \\times 16}{10000} \\).<br>P = \\( \\frac{10000}{16} = 625 \\)."
  },
  {
    question: "A sum of Rs. 12,500 amounts to Rs. 15,500 in 4 years at the rate of simple interest. What is the rate of interest?",
    option1: "3%",
    option2: "4%",
    option3: "5%",
    option4: "6%",
    ans: 4,
    explanation: "Simple Interest = Amount - Principal = 15500 - 12500 = Rs. 3000.<br>Formula: SI = \\( \\frac{P \\times R \\times T}{100} \\).<br>3000 = \\( \\frac{12500 \\times R \\times 4}{100} \\).<br>3000 = 500R.<br>R = 6%."
  },

  // --- PARTNERSHIPS ---
  {
    question: "A and B started a business investing Rs. 85,000 and Rs. 15,000 respectively. In what ratio the profit earned after 2 years be divided between A and B?",
    option1: "3:4",
    option2: "3:5",
    option3: "15:23",
    option4: "17:3",
    ans: 4,
    explanation: "Ratio of Profit = Ratio of Investment × Time.<br>Since time is same (2 years) for both, Profit Ratio = Investment Ratio.<br>Ratio = 85000 : 15000 = 85 : 15.<br>Divide by 5 -> 17 : 3."
  },
  {
    question: "A, B and C enter into a partnership. A invests 3 times as much as B invests and B invests two-third of what C invests. At the end of the year, the profit earned is Rs. 6600. What is the share of B?",
    option1: "Rs. 1200",
    option2: "Rs. 1500",
    option3: "Rs. 1800",
    option4: "Rs. 2100",
    ans: 1,
    explanation: "Let C's investment = x.<br>Then B = \\( \\frac{2}{3}x \\).<br>A = 3 × B = \\( 3 \\times \\frac{2}{3}x = 2x \\).<br>Ratio A : B : C = \\( 2x : \\frac{2}{3}x : x \\) = \\( 6 : 2 : 3 \\).<br>Total ratio sum = 6+2+3 = 11.<br>B's share = \\( \\frac{2}{11} \\times 6600 = 2 \\times 600 = 1200 \\)."
  },

  // --- LOGICAL REASONING (Analogy & Coding) ---
  {
    question: "Odometer is to Mileage as Compass is to ...",
    option1: "Speed",
    option2: "Hiking",
    option3: "Needle",
    option4: "Direction",
    ans: 4,
    explanation: "An Odometer is an instrument used to measure Mileage (distance). A Compass is an instrument used to determine Direction."
  },
  {
    question: "Marathon is to Race as Hibernation is to ...",
    option1: "Winter",
    option2: "Bear",
    option3: "Dream",
    option4: "Sleep",
    ans: 4,
    explanation: "A Marathon is a long type of Race. Hibernation is a long period of Sleep."
  },
  {
    question: "In a certain code, '786' means 'study very hard', '958' means 'hard work pays' and '645' means 'study and work'. Which of the following is the code for 'very'?",
    option1: "8",
    option2: "6",
    option3: "7",
    option4: "5",
    ans: 3,
    explanation: "1) 786 = study very hard<br>2) 958 = hard work pays<br>3) 645 = study and work<br>From 1 & 2, common word is 'hard' and common digit is '8'. So 8 = hard.<br>From 1 & 3, common word is 'study' and common digit is '6'. So 6 = study.<br>In statement 1, remaining word is 'very' and remaining digit is '7'."
  },
  {
    question: "Identify the next number in the series: 10, 18, 28, 40, 54, 70, ?",
    option1: "85",
    option2: "86",
    option3: "87",
    option4: "88",
    ans: 4,
    explanation: "Differences between numbers:<br>18 - 10 = 8<br>28 - 18 = 10<br>40 - 28 = 12<br>54 - 40 = 14<br>70 - 54 = 16<br>The difference increases by 2. Next difference should be 18.<br>Next number = 70 + 18 = 88."
  },
  
  // --- VERBAL ABILITY ---
  {
    question: "Select the pair that expresses a relationship similar to SCISSORS : CLOTH",
    option1: "Axe : Wood",
    option2: "Stone : Grinder",
    option3: "Knife : Stone",
    option4: "Gun : Hunt",
    ans: 1,
    explanation: "Scissors are used to cut Cloth. An Axe is used to cut Wood."
  },
  {
    question: "Choose the word opposite in meaning to 'OBSCURE'",
    option1: "Implicit",
    option2: "Obnoxious",
    option3: "Explicit",
    option4: "Pedantic",
    ans: 3,
    explanation: "Obscure means unclear or hidden. Explicit means stated clearly and in detail, leaving no room for confusion."
  },
  {
    question: "Fill in the blank: 'He gives everyone the class of a noble person, but his actions are ________.'",
    option1: "ignoble",
    option2: "significant",
    option3: "prejudiced",
    option4: "impeccable",
    ans: 1,
    explanation: "The sentence suggests a contrast ('but'). Noble means high moral character. The opposite of noble is Ignoble."
  },
  {
    question: "Find the correctly spelt word.",
    option1: "Comitte",
    option2: "Commitee",
    option3: "Committee",
    option4: "Comiitee",
    ans: 3,
    explanation: "Committee is one of the most frequently asked spelling questions. It has double M, double T, and double E."
  },
  {
     question: "Sentence Order: <br>(A) Can I have <br>(B) some more <br>(C) please <br>(D) rice",
     option1: "ABCD",
     option2: "ABDC",
     option3: "ADBC",
     option4: "ADCB",
     ans: 2,
     explanation: "Correct order: 'Can I have (A) some more (B) rice (D) please (C)'. Structure: Request + Quantity + Object + Politeness."
  },
  {
     question: "Find the odd one out: Car, Bicycle, Motorcycle, Jeep",
     option1: "Car",
     option2: "Bicycle",
     option3: "Motorcycle",
     option4: "Jeep",
     ans: 2,
     explanation: "Car, Motorcycle, and Jeep all require fuel (petrol/diesel) to run. Bicycle is the only one that runs on human power."
  },
  // --- PROBLEMS ON AGES ---
  {
    question: "Father is aged three times more than his son Ronit. After 8 years, he would be two and a half times of Ronit's age. After further 8 years, how many times would he be of Ronit's age?",
    option1: "2 times",
    option2: "2.5 times",
    option3: "2.75 times",
    option4: "3 times",
    ans: 1,
    explanation: "Let Ronit's present age be x.<br>Father's present age = x + 3x = 4x.<br>After 8 years:<br>(4x + 8) = 2.5(x + 8)<br>4x + 8 = 2.5x + 20<br>1.5x = 12 => x = 8.<br>Ronit's age = 8, Father's age = 32.<br>After further 8 years (Total 16 years from now):<br>Ronit = 8 + 16 = 24.<br>Father = 32 + 16 = 48.<br>Ratio = 48/24 = 2 times."
  },
  {
    question: "The sum of ages of 5 children born at the intervals of 3 years each is 50 years. What is the age of the youngest child?",
    option1: "4 years",
    option2: "8 years",
    option3: "10 years",
    option4: "None of these",
    ans: 1,
    explanation: "Let the ages be x, (x+3), (x+6), (x+9), (x+12).<br>Sum = 5x + 30 = 50.<br>5x = 20.<br>x = 4 years."
  },
  {
    question: "A father said to his son, 'I was as old as you are at the present at the time of your birth'. If the father's age is 38 years now, the son's age five years back was:",
    option1: "14 years",
    option2: "19 years",
    option3: "33 years",
    option4: "38 years",
    ans: 1,
    explanation: "Let son's present age be x.<br>Father's age at son's birth = (38 - x).<br>Given: (38 - x) = x.<br>2x = 38 => x = 19.<br>Son's age 5 years back = 19 - 5 = 14 years."
  },
  {
    question: "Present ages of Sameer and Anand are in the ratio of 5 : 4 respectively. Three years hence, the ratio of their ages will become 11 : 9 respectively. What is Anand's present age in years?",
    option1: "24",
    option2: "27",
    option3: "40",
    option4: "Cannot be determined",
    ans: 1,
    explanation: "Let ages be 5x and 4x.<br>After 3 years: \\( \\frac{5x + 3}{4x + 3} = \\frac{11}{9} \\).<br>9(5x + 3) = 11(4x + 3)<br>45x + 27 = 44x + 33<br>x = 6.<br>Anand's present age = 4x = 24 years."
  },
  {
    question: "A man is 24 years older than his son. In two years, his age will be twice the age of his son. The present age of the son is:",
    option1: "14 years",
    option2: "18 years",
    option3: "20 years",
    option4: "22 years",
    ans: 4,
    explanation: "Let son's age = x. Father's age = x + 24.<br>In 2 years:<br>(x + 24) + 2 = 2(x + 2)<br>x + 26 = 2x + 4<br>x = 22."
  },

  // --- AVERAGES ---
  {
    question: "The average weight of 8 persons increases by 2.5 kg when a new person comes in place of one of them weighing 65 kg. What might be the weight of the new person?",
    option1: "76 kg",
    option2: "76.5 kg",
    option3: "85 kg",
    option4: "Data inadequate",
    ans: 3,
    explanation: "Total weight increased = \\( 8 \\times 2.5 = 20 \\) kg.<br>Weight of new person = Weight of removed person + Total increase.<br>Weight = 65 + 20 = 85 kg."
  },
  {
    question: "The average of 20 numbers is zero. Of them, at the most, how many may be greater than zero?",
    option1: "0",
    option2: "1",
    option3: "10",
    option4: "19",
    ans: 4,
    explanation: "Average is 0 means Sum is 0.<br>It is possible to have 19 positive numbers and 1 huge negative number such that their sum cancels out.<br>So, at most 19 numbers can be greater than zero."
  },
  {
    question: "A batsman makes a score of 87 runs in the 17th inning and thus increases his average by 3. Find his average after 17th inning.",
    option1: "36",
    option2: "37",
    option3: "38",
    option4: "39",
    ans: 4,
    explanation: "Let average after 16 innings = x.<br>Total score after 16 innings = 16x.<br>17th inning equation: \\( 16x + 87 = 17(x + 3) \\).<br>16x + 87 = 17x + 51.<br>x = 36.<br>Average after 17th inning = x + 3 = 39."
  },
  {
    question: "The average of first 5 multiples of 3 is:",
    option1: "3",
    option2: "9",
    option3: "12",
    option4: "15",
    ans: 2,
    explanation: "Numbers: 3, 6, 9, 12, 15.<br>Since they are in AP (Arithmetic Progression), Average is the middle term.<br>Average = 9."
  },

  // --- PIPES AND CISTERNS ---
  {
    question: "Three pipes A, B and C can fill a tank from empty to full in 30 minutes, 20 minutes, and 10 minutes respectively. When the tank is empty, all the three pipes are opened. A, B and C discharge chemical solutions P, Q and R respectively. What is the proportion of the solution R in the liquid in the tank after 3 minutes?",
    option1: "5/11",
    option2: "6/11",
    option3: "7/11",
    option4: "8/11",
    ans: 2,
    explanation: "Part filled by A in 1 min = 1/30.<br>Part filled by B in 1 min = 1/20.<br>Part filled by C in 1 min = 1/10.<br>Total in 1 min = 1/30 + 1/20 + 1/10 = (2+3+6)/60 = 11/60.<br>Contribution of C (Solution R) is 6/60.<br>Proportion of R = \\( \\frac{6/60}{11/60} = \\frac{6}{11} \\)."
  },
  {
    question: "A pump can fill a tank with water in 2 hours. Because of a leak, it took 2.5 hours to fill the tank. The leak can drain all the water of the tank in:",
    option1: "8 hours",
    option2: "10 hours",
    option3: "12 hours",
    option4: "14 hours",
    ans: 2,
    explanation: "Fill rate = 1/2.<br>Fill + Leak rate = 1/2.5 = 2/5.<br>Leak rate = Fill - (Fill+Leak) = 1/2 - 2/5 = (5-4)/10 = 1/10.<br>So, Leak empties the tank in 10 hours."
  },
  {
    question: "Two pipes A and B can fill a tank in 15 minutes and 20 minutes respectively. Both pipes are opened together but after 4 minutes, pipe A is turned off. What is the total time required to fill the tank?",
    option1: "10 min 20 sec",
    option2: "11 min 45 sec",
    option3: "12 min 30 sec",
    option4: "14 min 40 sec",
    ans: 4,
    explanation: "Work done by (A+B) in 4 min = \\( 4 \\times (\\frac{1}{15} + \\frac{1}{20}) = 4 \\times \\frac{7}{60} = \\frac{7}{15} \\).<br>Remaining work = \\( 1 - \\frac{7}{15} = \\frac{8}{15} \\).<br>Time for B to finish remaining = \\( \\frac{8}{15} \\times 20 = \\frac{32}{3} = 10 \\frac{2}{3} \\) min.<br>Total time = 4 min + 10 min 40 sec = 14 min 40 sec."
  },
  {
    question: "A tank is filled by three pipes with uniform flow. The first two pipes operating simultaneously fill the tank in the same time during which the tank is filled by the third pipe alone. The second pipe fills the tank 5 hours faster than the first pipe and 4 hours slower than the third pipe. The time required by the first pipe is:",
    option1: "6 hours",
    option2: "10 hours",
    option3: "15 hours",
    option4: "30 hours",
    ans: 3,
    explanation: "Let time taken by 3rd pipe = x.<br>Then 2nd pipe = x + 4.<br>1st pipe = (x + 4) + 5 = x + 9.<br>Condition: Rate(1) + Rate(2) = Rate(3)<br>\\( \\frac{1}{x+9} + \\frac{1}{x+4} = \\frac{1}{x} \\).<br>Solving this quadratic equation gives x = 6.<br>Time for 1st pipe = x + 9 = 15 hours."
  },

  // --- LOGICAL REASONING (Statement & Argument) ---
  {
    question: "Statement: Should India encourage exports, when most things are insufficient for internal use itself?<br>Argument I: Yes. We have to earn foreign exchange to pay for our imports.<br>Argument II: No. Even selective encouragement would lead to shortages.",
    option1: "Only argument I is strong",
    option2: "Only argument II is strong",
    option3: "Either I or II is strong",
    option4: "Both I and II are strong",
    ans: 1,
    explanation: "Argument I is strong because foreign exchange is essential for the economy to import vital goods (like oil/tech). Argument II is weak because 'selective encouragement' implies surplus goods, which wouldn't necessarily lead to shortages."
  },
  {
    question: "Statement: Should all the drugs patented and manufactured in Western countries be first tried out on a sample basis before giving license for sale to general public in India?<br>Argument I: Yes. Many such drugs require different doses and duration for Indian population and hence it is necessary.<br>Argument II: No. This is just an excuse to delay the introduction of latest quality medicines.",
    option1: "Only argument I is strong",
    option2: "Only argument II is strong",
    option3: "Neither I nor II is strong",
    option4: "Both I and II are strong",
    ans: 1,
    explanation: "Argument I is strong as it focuses on health safety and genetic/environmental differences. Argument II is vague and emotional."
  },
  {
    question: "Arrange the words in a meaningful logical order: <br>1. Poverty <br>2. Population <br>3. Death <br>4. Unemployment <br>5. Disease",
    option1: "2, 3, 4, 5, 1",
    option2: "3, 4, 2, 5, 1",
    option3: "2, 4, 1, 5, 3",
    option4: "1, 2, 3, 4, 5",
    ans: 3,
    explanation: "Logical Flow: Population(2) increases -> Leads to Unemployment(4) -> Leads to Poverty(1) -> Leads to Disease(5) -> Leads to Death(3)."
  },
  {
    question: "Choose the number which is different from others in the group.",
    option1: "12",
    option2: "25",
    option3: "37",
    option4: "49",
    ans: 3,
    explanation: "12, 25, 49 are composite numbers. 37 is a prime number. (Also, 25 and 49 are perfect squares, but 12 isn't, so Prime vs Composite is the stronger classification here)."
  },
  {
     question: "Syllogism:<br>Statements: Some actors are singers. All the singers are dancers.<br>Conclusion I: Some actors are dancers.<br>Conclusion II: No singer is actor.",
     option1: "Only I follows",
     option2: "Only II follows",
     option3: "Either I or II follows",
     option4: "Neither I nor II follows",
     ans: 1,
     explanation: "Since some actors are singers, and all singers are dancers, those actors who are singers must also be dancers. So I follows. II is negative and contradicts the first statement, so it doesn't follow."
  },
  {
    question: "Statement: Use 'Riya' cold cream for fair complexion - an advertisement.<br>Assumption I: People like to use cold cream for fair complexion.<br>Assumption II: People are easily fooled.",
    option1: "Only assumption I is implicit",
    option2: "Only assumption II is implicit",
    option3: "Both I and II are implicit",
    option4: "Neither I nor II is implicit",
    ans: 1,
    explanation: "Advertisements are created based on what people desire. If people didn't want fair complexion or didn't use creams for it, the ad wouldn't exist. Assumption II is subjective and cynical."
  },
  // --- TIME AND DISTANCE (Advanced) ---
  {
    question: "Two trains 140 m and 160 m long run at the speed of 60 km/hr and 40 km/hr respectively in opposite directions on parallel tracks. The time which they take to cross each other, is:",
    option1: "9 seconds",
    option2: "9.6 seconds",
    option3: "10.8 seconds",
    option4: "12 seconds",
    ans: 3,
    explanation: "Relative Speed = \\( 60 + 40 = 100 \\) km/hr = \\( 100 \\times \\frac{5}{18} = \\frac{250}{9} \\) m/sec.<br>Total Distance = Length of Train A + Train B = 140 + 160 = 300 m.<br>Time = \\( \\frac{\\text{Distance}}{\\text{Speed}} = \\frac{300}{250/9} = \\frac{300 \\times 9}{250} = 10.8 \\) seconds."
  },
  {
    question: "A man covers a certain distance at X km/hr and an equal distance at Y km/hr. The average speed during the whole journey is:",
    option1: "(X+Y)/2",
    option2: "(2XY)/(X+Y)",
    option3: "2(X+Y)/XY",
    option4: "(X+Y)/XY",
    ans: 2,
    explanation: "This is the standard formula for Average Speed when distances are equal (Harmonic Mean).<br>Average Speed = \\( \\frac{2XY}{X+Y} \\) km/hr."
  },
  {
    question: "Walking at 3/4 of his normal speed, Mike is 16 minutes late in reaching his office. The usual time taken by him to cover the distance between his home and office is:",
    option1: "42 minutes",
    option2: "48 minutes",
    option3: "60 minutes",
    option4: "62 minutes",
    ans: 2,
    explanation: "New speed = 3/4 of usual speed.<br>New time = 4/3 of usual time.<br>Difference = \\( \\frac{4}{3}T - T = \\frac{1}{3}T \\).<br>Given difference = 16 mins.<br>So, \\( \\frac{1}{3}T = 16 \\implies T = 48 \\) minutes."
  },
  {
    question: "Excluding stoppages, the speed of a bus is 54 kmph and including stoppages, it is 45 kmph. For how many minutes does the bus stop per hour?",
    option1: "9",
    option2: "10",
    option3: "12",
    option4: "20",
    ans: 2,
    explanation: "Due to stoppages, it covers 9 km less in one hour.<br>Time taken to cover 9 km at original speed (54 kmph) = \\( \\frac{9}{54} \\times 60 \\) min = \\( \\frac{1}{6} \\times 60 = 10 \\) min."
  },

  // --- CODING AND DECODING ---
  {
    question: "If ROSE is coded as 6821, CHAIR is coded as 73456 and PREACH is coded as 961473, what will be the code for SEARCH?",
    option1: "246173",
    option2: "214673",
    option3: "214763",
    option4: "216473",
    ans: 2,
    explanation: "Direct Letter Coding (Look up the letters in the given words):<br>S is in ROSE (3rd letter) -> 2<br>E is in ROSE (4th letter) -> 1<br>A is in CHAIR (3rd letter) -> 4<br>R is in ROSE (1st letter) -> 6<br>C is in CHAIR (1st letter) -> 7<br>H is in CHAIR (2nd letter) -> 3<br>Code: 214673."
  },
  {
    question: "If Z = 52 and ACT = 48, then BAT will be equal to:",
    option1: "39",
    option2: "41",
    option3: "44",
    option4: "46",
    ans: 4,
    explanation: "Z is 26th letter. Code is \\( 26 \\times 2 = 52 \\).<br>ACT = \\( (1 + 3 + 20) \\times 2 = 24 \\times 2 = 48 \\).<br>BAT = \\( (2 + 1 + 20) \\times 2 = 23 \\times 2 = 46 \\)."
  },
  {
    question: "In a certain code language, if 'car' is called 'bike', 'bike' is called 'cycle', 'cycle' is called 'scooter', 'scooter' is called 'train', 'train' is called 'plane', then which of the following is used to travel on railway tracks?",
    option1: "Scooter",
    option2: "Train",
    option3: "Plane",
    option4: "Cycle",
    ans: 3,
    explanation: "Normally, a 'train' runs on tracks. In this code, 'train' is called 'plane'. Therefore, the answer is 'plane'."
  },
  
  // --- SEATING & RANKING ---
  {
    question: "In a row of boys, If A who is 10th from the left and B who is 9th from the right interchange their positions, A becomes 15th from the left. How many boys are there in the row?",
    option1: "23",
    option2: "31",
    option3: "27",
    option4: "28",
    ans: 1,
    explanation: "After interchange, A is at B's original place.<br>So, this position is 15th from Left and 9th from Right.<br>Total boys = (Left + Right) - 1 = (15 + 9) - 1 = 23."
  },
  {
    question: "P, Q, R, S, T, U, V and W are sitting round the circle and are facing the centre. P is second to the right of T who is the neighbour of R and V. S is not the neighbour of P. V is the neighbour of U. Q is not between S and W. W is not between U and S. Who is sitting to the immediate right of V?",
    option1: "T",
    option2: "U",
    option3: "P",
    option4: "R",
    ans: 1,
    explanation: "This requires drawing a circle. T has neighbours R and V. P is 2nd right of T. If T is at 6 o'clock, P is at 4 o'clock (approx). V must be at 7 o'clock (to be neighbour of T and U). Thus, T is between R and V. Immediate right of V (facing center) -> T."
  },
  {
    question: "Five students are standing in a circle. Abhinav is between Alok and Ankur. Apurva is on the left of Abhishek. Alok is on the left of Apurva. Who is sitting next to Abhinav on his right?",
    option1: "Apurva",
    option2: "Ankur",
    option3: "Abhishek",
    option4: "Alok",
    ans: 4,
    explanation: "Arrangement (Clockwise): Abhishek, Apurva, Alok, Abhinav, Ankur.<br>To the immediate right of Abhinav is Alok (assuming facing center)."
  },

  // --- ENGLISH (Error Spotting & Grammar) ---
  {
    question: "Spot the error: 'He is / suffering / with flu.'",
    option1: "He is",
    option2: "suffering",
    option3: "with flu",
    option4: "No error",
    ans: 3,
    explanation: "The correct preposition is 'from'. One suffers 'from' a disease. Correct: 'He is suffering from flu.'"
  },
  {
    question: "Spot the error: 'Each of the / students / have done / their homework.'",
    option1: "Each of the",
    option2: "students",
    option3: "have done",
    option4: "their homework",
    ans: 3,
    explanation: "'Each' is singular. The verb must be singular. Correct: 'Each of the students has done his/her homework.'"
  },
  {
    question: "Fill in the blank: The train ________ before we reached the station.",
    option1: "left",
    option2: "had left",
    option3: "has left",
    option4: "was leaving",
    ans: 2,
    explanation: "Past Perfect Tense is used for the action that happened first in the past. The train leaving happened before they reached. So, 'had left'."
  },
  {
    question: "One word for: 'A speech made for the first time'",
    option1: "Extempore",
    option2: "Debate",
    option3: "Maiden",
    option4: "Sermon",
    ans: 3,
    explanation: "A 'Maiden speech' is the first speech given by a newly elected member or a person."
  },
  {
    question: "Idiom: 'To spill the beans' means:",
    option1: "To be clumsy",
    option2: "To reveal a secret",
    option3: "To cook food",
    option4: "To buy groceries",
    ans: 2,
    explanation: "To spill the beans means to disclose a secret or reveal confidential information."
  },

  // --- MIXED QUANT & LOGIC ---
  {
    question: "If \\( a : b = 5 : 7 \\) and \\( c : d = 2a : 3b \\), then \\( ac : bd \\) is:",
    option1: "20 : 38",
    option2: "50 : 147",
    option3: "10 : 21",
    option4: "50 : 151",
    ans: 2,
    explanation: "\\( \\frac{a}{b} = \\frac{5}{7} \\).<br>\\( \\frac{c}{d} = \\frac{2a}{3b} = \\frac{2}{3} \\times \\frac{5}{7} = \\frac{10}{21} \\).<br>\\( \\frac{ac}{bd} = \\frac{a}{b} \\times \\frac{c}{d} = \\frac{5}{7} \\times \\frac{10}{21} = \\frac{50}{147} \\)."
  },
  {
    question: "Find the missing number in the matrix:<br>6  | 11 | 25<br>8  | 6  | 16<br>12 | 5  | ?",
    option1: "18",
    option2: "16",
    option3: "12",
    option4: "22",
    ans: 2,
    explanation: "Logic: (First Column × Second Column) / 2? No.<br>Logic: (Col1 / 2) * Col2? <br>Row 1: (6/2) * 11 = 33 (No).<br>Let's try: Col3 = (Col1 * Col2)/2 - something? No.<br>Let's try Column logic. 6, 8, 12... 11, 6, 5...<br>Correct Logic: (First Number * Second Number) / 2 - 8? No.<br>Alternative Logic: \\( (25 + 11) / 6 = 6 \\). \\( (16 + 6) / 8 = 2.75 \\) No.<br>Let's try: A = 6, B=11, C=25. 2A + B = 12+11=23 (Close).<br>Let's try: (C - B) * 2? (25-11)*2 = 28. No.<br>Standard Matrix Logic for this question: (Col1 * Col2)/2 - 8? No.<br>Actually, look at Row 2: 8, 6, 16. (8 * 6)/3 = 16.<br>Row 1: (6 * 11)/... 66? No.<br>Let's try: \\( \\frac{A \\times B}{2} - \\text{constant} \\).<br>Wait, \\( 25 - 11 = 14 \\). 14 is not related to 6 easily.<br>Let's try simpler: \\( \\frac{A}{2} + B \\)? 3+11=14. No.<br><b>Re-evaluating logic:</b> \\( (A \\times B) / 2 = X \\). X - something? <br>Let's go with a simpler logic often found in exams: \\( A/2 + B = 14 \\) vs 25? No.<br><b>Correct Logic:</b> (Col1 / 2) + Col2 = ?<br>3+11=14. (25 is 14+11?). No.<br>How about: \\( B \\times 2 + A/2 = 22+3=25 \\).<br>Row 2: \\( 6 \\times 2 + 8/2 = 12 + 4 = 16 \\). (Matches!)<br>Row 3: \\( 5 \\times 2 + 12/2 = 10 + 6 = 16 \\).<br>Answer is 16."
  },
  {
    question: "A clock is started at noon. By 10 minutes past 5, the hour hand has turned through:",
    option1: "145°",
    option2: "150°",
    option3: "155°",
    option4: "160°",
    ans: 3,
    explanation: "Angle traced by hour hand in 12 hours = 360°.<br>Angle in 1 hour = 30°.<br>Time = 5 hours 10 mins = \\( 5 \\frac{1}{6} \\) hours = \\( \\frac{31}{6} \\) hours.<br>Angle = \\( \\frac{31}{6} \\times 30 = 31 \\times 5 = 155^{\\circ} \\)."
  },
  {
    question: "The ratio of boys and girls in a college is 5:3. If 50 boys leave and 50 girls join, the ratio becomes 9:7. The number of boys in the college is:",
    option1: "300",
    option2: "450",
    option3: "500",
    option4: "600",
    ans: 3,
    explanation: "Let boys = 5x, girls = 3x.<br>\\( \\frac{5x - 50}{3x + 50} = \\frac{9}{7} \\).<br>35x - 350 = 27x + 450.<br>8x = 800 => x = 100.<br>Boys = 5x = 500."
  },
  {
    question: "In an election between two candidates, one got 55% of the total valid votes, 20% of the votes were invalid. If the total number of votes was 7500, the number of valid votes that the other candidate got, was:",
    option1: "2700",
    option2: "2900",
    option3: "3000",
    option4: "3100",
    ans: 1,
    explanation: "Total votes = 7500.<br>Valid votes = 80% of 7500 = 6000.<br>First candidate got 55% of valid.<br>Second candidate got (100 - 55) = 45% of valid.<br>Votes = 45% of 6000 = \\( \\frac{45}{100} \\times 6000 = 45 \\times 60 = 2700 \\)."
  },
  // --- TIME AND DISTANCE (Advanced) ---
  {
    question: "Two trains 140 m and 160 m long run at the speed of 60 km/hr and 40 km/hr respectively in opposite directions on parallel tracks. The time which they take to cross each other, is:",
    option1: "9 seconds",
    option2: "9.6 seconds",
    option3: "10.8 seconds",
    option4: "12 seconds",
    ans: 3,
    explanation: "Relative Speed = \\( 60 + 40 = 100 \\) km/hr = \\( 100 \\times \\frac{5}{18} = \\frac{250}{9} \\) m/sec.<br>Total Distance = Length of Train A + Train B = 140 + 160 = 300 m.<br>Time = \\( \\frac{\\text{Distance}}{\\text{Speed}} = \\frac{300}{250/9} = \\frac{300 \\times 9}{250} = 10.8 \\) seconds."
  },
  {
    question: "A man covers a certain distance at X km/hr and an equal distance at Y km/hr. The average speed during the whole journey is:",
    option1: "(X+Y)/2",
    option2: "(2XY)/(X+Y)",
    option3: "2(X+Y)/XY",
    option4: "(X+Y)/XY",
    ans: 2,
    explanation: "This is the standard formula for Average Speed when distances are equal (Harmonic Mean).<br>Average Speed = \\( \\frac{2XY}{X+Y} \\) km/hr."
  },
  {
    question: "Walking at 3/4 of his normal speed, Mike is 16 minutes late in reaching his office. The usual time taken by him to cover the distance between his home and office is:",
    option1: "42 minutes",
    option2: "48 minutes",
    option3: "60 minutes",
    option4: "62 minutes",
    ans: 2,
    explanation: "New speed = 3/4 of usual speed.<br>New time = 4/3 of usual time.<br>Difference = \\( \\frac{4}{3}T - T = \\frac{1}{3}T \\).<br>Given difference = 16 mins.<br>So, \\( \\frac{1}{3}T = 16 \\implies T = 48 \\) minutes."
  },
  {
    question: "Excluding stoppages, the speed of a bus is 54 kmph and including stoppages, it is 45 kmph. For how many minutes does the bus stop per hour?",
    option1: "9",
    option2: "10",
    option3: "12",
    option4: "20",
    ans: 2,
    explanation: "Due to stoppages, it covers 9 km less in one hour.<br>Time taken to cover 9 km at original speed (54 kmph) = \\( \\frac{9}{54} \\times 60 \\) min = \\( \\frac{1}{6} \\times 60 = 10 \\) min."
  },

  // --- CODING AND DECODING ---
  {
    question: "If ROSE is coded as 6821, CHAIR is coded as 73456 and PREACH is coded as 961473, what will be the code for SEARCH?",
    option1: "246173",
    option2: "214673",
    option3: "214763",
    option4: "216473",
    ans: 2,
    explanation: "Direct Letter Coding (Look up the letters in the given words):<br>S is in ROSE (3rd letter) -> 2<br>E is in ROSE (4th letter) -> 1<br>A is in CHAIR (3rd letter) -> 4<br>R is in ROSE (1st letter) -> 6<br>C is in CHAIR (1st letter) -> 7<br>H is in CHAIR (2nd letter) -> 3<br>Code: 214673."
  },
  {
    question: "If Z = 52 and ACT = 48, then BAT will be equal to:",
    option1: "39",
    option2: "41",
    option3: "44",
    option4: "46",
    ans: 4,
    explanation: "Z is 26th letter. Code is \\( 26 \\times 2 = 52 \\).<br>ACT = \\( (1 + 3 + 20) \\times 2 = 24 \\times 2 = 48 \\).<br>BAT = \\( (2 + 1 + 20) \\times 2 = 23 \\times 2 = 46 \\)."
  },
  {
    question: "In a certain code language, if 'car' is called 'bike', 'bike' is called 'cycle', 'cycle' is called 'scooter', 'scooter' is called 'train', 'train' is called 'plane', then which of the following is used to travel on railway tracks?",
    option1: "Scooter",
    option2: "Train",
    option3: "Plane",
    option4: "Cycle",
    ans: 3,
    explanation: "Normally, a 'train' runs on tracks. In this code, 'train' is called 'plane'. Therefore, the answer is 'plane'."
  },
  
  // --- SEATING & RANKING ---
  {
    question: "In a row of boys, If A who is 10th from the left and B who is 9th from the right interchange their positions, A becomes 15th from the left. How many boys are there in the row?",
    option1: "23",
    option2: "31",
    option3: "27",
    option4: "28",
    ans: 1,
    explanation: "After interchange, A is at B's original place.<br>So, this position is 15th from Left and 9th from Right.<br>Total boys = (Left + Right) - 1 = (15 + 9) - 1 = 23."
  },
  {
    question: "P, Q, R, S, T, U, V and W are sitting round the circle and are facing the centre. P is second to the right of T who is the neighbour of R and V. S is not the neighbour of P. V is the neighbour of U. Q is not between S and W. W is not between U and S. Who is sitting to the immediate right of V?",
    option1: "T",
    option2: "U",
    option3: "P",
    option4: "R",
    ans: 1,
    explanation: "This requires drawing a circle. T has neighbours R and V. P is 2nd right of T. If T is at 6 o'clock, P is at 4 o'clock (approx). V must be at 7 o'clock (to be neighbour of T and U). Thus, T is between R and V. Immediate right of V (facing center) -> T."
  },
  {
    question: "Five students are standing in a circle. Abhinav is between Alok and Ankur. Apurva is on the left of Abhishek. Alok is on the left of Apurva. Who is sitting next to Abhinav on his right?",
    option1: "Apurva",
    option2: "Ankur",
    option3: "Abhishek",
    option4: "Alok",
    ans: 4,
    explanation: "Arrangement (Clockwise): Abhishek, Apurva, Alok, Abhinav, Ankur.<br>To the immediate right of Abhinav is Alok (assuming facing center)."
  },

  // --- ENGLISH (Error Spotting & Grammar) ---
  {
    question: "Spot the error: 'He is / suffering / with flu.'",
    option1: "He is",
    option2: "suffering",
    option3: "with flu",
    option4: "No error",
    ans: 3,
    explanation: "The correct preposition is 'from'. One suffers 'from' a disease. Correct: 'He is suffering from flu.'"
  },
  {
    question: "Spot the error: 'Each of the / students / have done / their homework.'",
    option1: "Each of the",
    option2: "students",
    option3: "have done",
    option4: "their homework",
    ans: 3,
    explanation: "'Each' is singular. The verb must be singular. Correct: 'Each of the students has done his/her homework.'"
  },
  {
    question: "Fill in the blank: The train ________ before we reached the station.",
    option1: "left",
    option2: "had left",
    option3: "has left",
    option4: "was leaving",
    ans: 2,
    explanation: "Past Perfect Tense is used for the action that happened first in the past. The train leaving happened before they reached. So, 'had left'."
  },
  {
    question: "One word for: 'A speech made for the first time'",
    option1: "Extempore",
    option2: "Debate",
    option3: "Maiden",
    option4: "Sermon",
    ans: 3,
    explanation: "A 'Maiden speech' is the first speech given by a newly elected member or a person."
  },
  {
    question: "Idiom: 'To spill the beans' means:",
    option1: "To be clumsy",
    option2: "To reveal a secret",
    option3: "To cook food",
    option4: "To buy groceries",
    ans: 2,
    explanation: "To spill the beans means to disclose a secret or reveal confidential information."
  },

  // --- MIXED QUANT & LOGIC ---
  {
    question: "If \\( a : b = 5 : 7 \\) and \\( c : d = 2a : 3b \\), then \\( ac : bd \\) is:",
    option1: "20 : 38",
    option2: "50 : 147",
    option3: "10 : 21",
    option4: "50 : 151",
    ans: 2,
    explanation: "\\( \\frac{a}{b} = \\frac{5}{7} \\).<br>\\( \\frac{c}{d} = \\frac{2a}{3b} = \\frac{2}{3} \\times \\frac{5}{7} = \\frac{10}{21} \\).<br>\\( \\frac{ac}{bd} = \\frac{a}{b} \\times \\frac{c}{d} = \\frac{5}{7} \\times \\frac{10}{21} = \\frac{50}{147} \\)."
  },
  {
    question: "Find the missing number in the matrix:<br>6  | 11 | 25<br>8  | 6  | 16<br>12 | 5  | ?",
    option1: "18",
    option2: "16",
    option3: "12",
    option4: "22",
    ans: 2,
    explanation: "Logic: (First Column × Second Column) / 2? No.<br>Logic: (Col1 / 2) * Col2? <br>Row 1: (6/2) * 11 = 33 (No).<br>Let's try: Col3 = (Col1 * Col2)/2 - something? No.<br>Let's try Column logic. 6, 8, 12... 11, 6, 5...<br>Correct Logic: (First Number * Second Number) / 2 - 8? No.<br>Alternative Logic: \\( (25 + 11) / 6 = 6 \\). \\( (16 + 6) / 8 = 2.75 \\) No.<br>Let's try: A = 6, B=11, C=25. 2A + B = 12+11=23 (Close).<br>Let's try: (C - B) * 2? (25-11)*2 = 28. No.<br>Standard Matrix Logic for this question: (Col1 * Col2)/2 - 8? No.<br>Actually, look at Row 2: 8, 6, 16. (8 * 6)/3 = 16.<br>Row 1: (6 * 11)/... 66? No.<br>Let's try: \\( \\frac{A \\times B}{2} - \\text{constant} \\).<br>Wait, \\( 25 - 11 = 14 \\). 14 is not related to 6 easily.<br>Let's try simpler: \\( \\frac{A}{2} + B \\)? 3+11=14. No.<br><b>Re-evaluating logic:</b> \\( (A \\times B) / 2 = X \\). X - something? <br>Let's go with a simpler logic often found in exams: \\( A/2 + B = 14 \\) vs 25? No.<br><b>Correct Logic:</b> (Col1 / 2) + Col2 = ?<br>3+11=14. (25 is 14+11?). No.<br>How about: \\( B \\times 2 + A/2 = 22+3=25 \\).<br>Row 2: \\( 6 \\times 2 + 8/2 = 12 + 4 = 16 \\). (Matches!)<br>Row 3: \\( 5 \\times 2 + 12/2 = 10 + 6 = 16 \\).<br>Answer is 16."
  },
  {
    question: "A clock is started at noon. By 10 minutes past 5, the hour hand has turned through:",
    option1: "145°",
    option2: "150°",
    option3: "155°",
    option4: "160°",
    ans: 3,
    explanation: "Angle traced by hour hand in 12 hours = 360°.<br>Angle in 1 hour = 30°.<br>Time = 5 hours 10 mins = \\( 5 \\frac{1}{6} \\) hours = \\( \\frac{31}{6} \\) hours.<br>Angle = \\( \\frac{31}{6} \\times 30 = 31 \\times 5 = 155^{\\circ} \\)."
  },
  {
    question: "The ratio of boys and girls in a college is 5:3. If 50 boys leave and 50 girls join, the ratio becomes 9:7. The number of boys in the college is:",
    option1: "300",
    option2: "450",
    option3: "500",
    option4: "600",
    ans: 3,
    explanation: "Let boys = 5x, girls = 3x.<br>\\( \\frac{5x - 50}{3x + 50} = \\frac{9}{7} \\).<br>35x - 350 = 27x + 450.<br>8x = 800 => x = 100.<br>Boys = 5x = 500."
  },
  {
    question: "In an election between two candidates, one got 55% of the total valid votes, 20% of the votes were invalid. If the total number of votes was 7500, the number of valid votes that the other candidate got, was:",
    option1: "2700",
    option2: "2900",
    option3: "3000",
    option4: "3100",
    ans: 1,
    explanation: "Total votes = 7500.<br>Valid votes = 80% of 7500 = 6000.<br>First candidate got 55% of valid.<br>Second candidate got (100 - 55) = 45% of valid.<br>Votes = 45% of 6000 = \\( \\frac{45}{100} \\times 6000 = 45 \\times 60 = 2700 \\)."
  },
  // --- BLOOD RELATIONS (Complex) ---
  {
    question: "A is B's sister. C is B's mother. D is C's father. E is D's mother. Then, how is A related to D?",
    option1: "Grandmother",
    option2: "Grandfather",
    option3: "Daughter",
    option4: "Granddaughter",
    ans: 4,
    explanation: "A is the sister of B, and B is the child of C. So A is the daughter of C.<br>C is the daughter of D.<br>Therefore, A is the daughter of D's daughter.<br>So, A is the Granddaughter of D."
  },
  {
    question: "Pointing to a man in a photograph, a woman said, 'His brother's father is the only son of my grandfather.' How is the woman related to the man in the photograph?",
    option1: "Sister",
    option2: "Aunt",
    option3: "Grandmother",
    option4: "Daughter",
    ans: 1,
    explanation: "Only son of woman's grandfather = Woman's Father.<br>Man's brother's father = Man's Father.<br>So, Man's Father is the Woman's Father.<br>Therefore, the woman is the Sister of the man."
  },
  {
    question: "P is the brother of Q and R. S is R's mother. T is P's father. Which of the following statements cannot be definitely true?",
    option1: "T is Q's father",
    option2: "S is P's mother",
    option3: "P is S's son",
    option4: "Q is T's son",
    ans: 4,
    explanation: "P, Q, R are siblings. T is Father, S is Mother.<br>P is brother (Male). R's gender unknown. Q's gender unknown.<br>Options:<br>1. T is Q's father (True).<br>2. S is P's mother (True).<br>3. P is S's son (True, P is male).<br>4. Q is T's son (Not definite, Q could be a daughter).<br>So, Option 4 cannot be definitely true."
  },

  // --- DATA INTERPRETATION (Text-Based Logic) ---
  {
    question: "Study the following data: Population of a city is 8000. Males increase by 6% and Females by 10%. The population becomes 8600. Find the number of males in the initial population.",
    option1: "5000",
    option2: "5500",
    option3: "6000",
    option4: "7000",
    ans: 1,
    explanation: "Let Males = x, Females = (8000 - x).<br>Increase: 6% of x + 10% of (8000 - x) = (8600 - 8000) = 600.<br>\\( 0.06x + 0.10(8000 - x) = 600 \\).<br>\\( 0.06x + 800 - 0.10x = 600 \\).<br>\\( -0.04x = -200 \\).<br>\\( x = \\frac{200}{0.04} = 5000 \\)."
  },
  {
    question: "A student scored marks in 5 subjects in the ratio 10 : 11 : 12 : 13 : 14. If the maximum marks in each subject are the same and he obtained 60% of the total marks, in how many subjects did he score more than 50%?",
    option1: "4",
    option2: "5",
    option3: "3",
    option4: "2",
    ans: 2,
    explanation: "Let marks be 10x, 11x, 12x, 13x, 14x.<br>Total scored = 60x.<br>Let Max marks per subject be M. Total Max = 5M.<br>Given: 60x = 60% of 5M => 60x = 3M => M = 20x.<br>Passing mark (50%) = 0.5M = 10x.<br>Marks obtained: 10x, 11x, 12x, 13x, 14x.<br>Scores > 10x are: 11x, 12x, 13x, 14x (4 subjects).<br>Wait, is 10x > 10x? No.<br>Question says 'more than 50%'. 10x is exactly 50%.<br>So 4 subjects."
  },

  // --- SENTENCE REARRANGEMENT (Para-jumbles) ---
  {
    question: "Rearrange the sentences:<br>S1: The machines were ready.<br>P: They were waiting for the signal.<br>Q: The operators were alert.<br>R: The siren sounded.<br>S: Work began immediately.<br>S6: It was a busy day.",
    option1: "QPRS",
    option2: "PQRS",
    option3: "QPSR",
    option4: "RQPS",
    ans: 1,
    explanation: "Logical flow: Machines ready -> Operators alert (Q) -> Waiting for signal (P) -> Siren sounded (R) -> Work began (S).<br>Sequence: Q-P-R-S."
  },
  {
    question: "Rearrange:<br>1. One of the reasons<br>P. for the failure<br>Q. of many students<br>R. in the examination<br>S. is their negligence<br>6. in studies.",
    option1: "QPRS",
    option2: "PQRS",
    option3: "PRQS",
    option4: "SPRQ",
    ans: 2,
    explanation: "Correct sentence: 'One of the reasons (1) for the failure (P) of many students (Q) in the examination (R) is their negligence (S) in studies (6).' Sequence: PQRS."
  },

  // --- QUANTITATIVE (Ratios & Mixtures) ---
  {
    question: "The salaries of A, B, and C are in the ratio 2 : 3 : 5. If the increments of 15%, 10% and 20% are allowed respectively in their salaries, then what will be the new ratio of their salaries?",
    option1: "3 : 3 : 10",
    option2: "10 : 11 : 20",
    option3: "23 : 33 : 60",
    option4: "Cannot be determined",
    ans: 3,
    explanation: "Let salaries be 200, 300, 500.<br>New A = 115% of 200 = 230.<br>New B = 110% of 300 = 330.<br>New C = 120% of 500 = 600.<br>Ratio: 230 : 330 : 600 -> 23 : 33 : 60."
  },
  {
    question: "A bag contains 50p, 25p and 10p coins in the ratio 5:9:4, amounting to Rs. 206. Find the number of coins of each type respectively.",
    option1: "200, 360, 160",
    option2: "150, 270, 120",
    option3: "200, 300, 100",
    option4: "100, 180, 80",
    ans: 1,
    explanation: "Let number of coins be 5x, 9x, 4x.<br>Value = \\( (5x \\times 0.50) + (9x \\times 0.25) + (4x \\times 0.10) = 206 \\).<br>\\( 2.5x + 2.25x + 0.4x = 206 \\).<br>\\( 5.15x = 206 \\).<br>\\( x = \\frac{206}{5.15} = 40 \\).<br>Coins: \\( 5 \\times 40 = 200 \\), \\( 9 \\times 40 = 360 \\), \\( 4 \\times 40 = 160 \\)."
  },
  {
    question: "Gold is 19 times as heavy as water and copper is 9 times as heavy as water. In what ratio should these be mixed to get an alloy 15 times as heavy as water?",
    option1: "1:1",
    option2: "2:3",
    option3: "1:2",
    option4: "3:2",
    ans: 4,
    explanation: "Using Alligation Rule:<br>Gold(19) &nbsp;&nbsp;&nbsp;&nbsp; Copper(9)<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Mean(15)<br>Difference (15-9)=6 &nbsp;&nbsp;&nbsp; Difference (19-15)=4<br>Ratio = 6 : 4 = 3 : 2."
  },

  // --- VERBAL (Vocabulary & Grammar) ---
  {
    question: "Find the antonym of 'ADVERSITY'",
    option1: "Failure",
    option2: "Helplessness",
    option3: "Misfortune",
    option4: "Prosperity",
    ans: 4,
    explanation: "Adversity means difficulties or misfortune. The opposite is Prosperity (success/good fortune)."
  },
  {
    question: "Choose the correct spelling:",
    option1: "Millenium",
    option2: "Millennium",
    option3: "Milennium",
    option4: "Milenium",
    ans: 2,
    explanation: "Millennium has double 'l' and double 'n'."
  },
  {
    question: "Fill in the blank: 'The man was charged ______ murder.'",
    option1: "of",
    option2: "for",
    option3: "with",
    option4: "on",
    ans: 3,
    explanation: "In legal terminology, a person is 'charged with' a crime. (However, a person is 'accused of' a crime)."
  },
  {
    question: "Analogy: BIRD : AVIARY :: BEE : ?",
    option1: "Aquarium",
    option2: "Hive",
    option3: "Apiary",
    option4: "Cage",
    ans: 3,
    explanation: "Birds are kept in an Aviary. Bees are kept in an Apiary. (Hive is where they live naturally, Apiary is the place where hives are kept)."
  },
  
  // --- CLOCK PUZZLE ---
  {
    question: "How many times are the hands of a clock at right angles in a day?",
    option1: "22",
    option2: "24",
    option3: "44",
    option4: "48",
    ans: 3,
    explanation: "In 12 hours, they are at right angles 22 times.<br>In 24 hours, they are at right angles \\( 22 \\times 2 = 44 \\) times.<br>(Note: It happens twice every hour, but between 2-4 and 8-10 it happens 3 times instead of 4)."
  },
  {
    question: "A clock is set right at 5 a.m. The clock loses 16 minutes in 24 hours. What will be the true time when the clock indicates 10 p.m. on the 4th day?",
    option1: "11 p.m.",
    option2: "10 p.m.",
    option3: "9 p.m.",
    option4: "12 p.m.",
    ans: 1,
    explanation: "Time from 5 a.m. on Day 1 to 10 p.m. on Day 4 = 89 hours.<br>Clock loses 16 min in 24 hrs. So 23 hr 44 min (real) = 24 hrs (this clock).<br>\\( \\frac{356}{15} \\) hrs of this clock = 24 hrs correct time.<br>89 hrs of this clock = \\( 89 \\times \\frac{24 \\times 15}{356} = 90 \\) hrs correct time.<br>So true time is 90 hours after 5 a.m.<br>89 hours -> 10 p.m. So 90 hours -> 11 p.m."
  },
  {
    question: "Find the missing number: 1, 4, 9, 16, 25, 36, ?",
    option1: "48",
    option2: "49",
    option3: "52",
    option4: "56",
    ans: 2,
    explanation: "Series of squares: \\( 1^2, 2^2, 3^2, 4^2, 5^2, 6^2 \\). Next is \\( 7^2 = 49 \\)."
  },
  {
    question: "Statement: 'If you want to study management, join institute X.' - An advice.<br>Assumption I: Institute X provides good management education.<br>Assumption II: X listens to advice.",
    option1: "Only I is implicit",
    option2: "Only II is implicit",
    option3: "Both I and II",
    option4: "Neither",
    ans: 1,
    explanation: "Advice is given with the assumption that the result will be beneficial. So, Institute X must be good (I). Assumption II is irrelevant to the speaker."
  },
  {
    question: "Which word does not belong with others?",
    option1: "Inch",
    option2: "Ounce",
    option3: "Centimeter",
    option4: "Yard",
    ans: 2,
    explanation: "Inch, Centimeter, and Yard are units of Length. Ounce is a unit of Weight."
  },
  {
    question: "If A = 26, SUN = 27, then CAT = ?",
    option1: "24",
    option2: "27",
    option3: "57",
    option4: "58",
    ans: 3,
    explanation: "Reverse Alphabet Logic (A=26, B=25... Z=1).<br>S(8) + U(6) + N(13) = 27.<br>CAT: C(24) + A(26) + T(7) = 57."
  },
  // --- HEIGHTS AND DISTANCES (Trigonometry) ---
  {
    question: "The angle of elevation of a ladder leaning against a wall is 60° and the foot of the ladder is 4.6 m away from the wall. The length of the ladder is:",
    option1: "2.3 m",
    option2: "4.6 m",
    option3: "7.8 m",
    option4: "9.2 m",
    ans: 4,
    explanation: "Let the length of the ladder be x.<br>Base = 4.6 m. Angle = 60°.<br>\\( \\cos(60^{\\circ}) = \\frac{\\text{Base}}{\\text{Hypotenuse}} = \\frac{4.6}{x} \\).<br>\\( \\frac{1}{2} = \\frac{4.6}{x} \\).<br>x = \\( 4.6 \\times 2 = 9.2 \\) m."
  },
  {
    question: "From a point P on a level ground, the angle of elevation of the top tower is 30°. If the tower is 100 m high, the distance of point P from the foot of the tower is:",
    option1: "149 m",
    option2: "156 m",
    option3: "173 m",
    option4: "200 m",
    ans: 3,
    explanation: "Let distance be d.<br>\\( \\tan(30^{\\circ}) = \\frac{\\text{Height}}{\\text{Base}} = \\frac{100}{d} \\).<br>\\( \\frac{1}{\\sqrt{3}} = \\frac{100}{d} \\).<br>\\( d = 100\\sqrt{3} = 100 \\times 1.732 = 173.2 \\) m."
  },
  {
    question: "An observer 1.6 m tall is 20.3 m away from a tower. The angle of elevation of the top of the tower from his eye is 30°. The height of the tower is:",
    option1: "21.6 m",
    option2: "23.2 m",
    option3: "24.72 m",
    option4: "None of these",
    ans: 4,
    explanation: "Let height of tower above eye level be h.<br>Distance = 20.3 m.<br>\\( \\tan(30^{\\circ}) = \\frac{h}{20.3} \\).<br>\\( h = \\frac{20.3}{\\sqrt{3}} = \\frac{20.3}{1.732} \\approx 11.72 \\) m.<br>Total height = h + observer's height = 11.72 + 1.6 = 13.32 m.<br>(Note: None of the options match)."
  },

  // --- LOGARITHMS ---
  {
    question: "If \\( \\log_{10} 2 = 0.3010 \\), then \\( \\log_{10} 80 \\) is:",
    option1: "1.6020",
    option2: "1.9030",
    option3: "3.9030",
    option4: "None of these",
    ans: 2,
    explanation: "\\( \\log 80 = \\log(8 \\times 10) = \\log 8 + \\log 10 \\).<br>\\( \\log 8 = \\log(2^3) = 3\\log 2 = 3 \\times 0.3010 = 0.9030 \\).<br>\\( \\log 10 = 1 \\).<br>Total = 1 + 0.9030 = 1.9030."
  },
  {
    question: "The value of \\( \\log_{2} 16 \\) is:",
    option1: "2",
    option2: "4",
    option3: "8",
    option4: "16",
    ans: 2,
    explanation: "\\( 16 = 2^4 \\).<br>\\( \\log_{2} 2^4 = 4 \\log_{2} 2 = 4 \\times 1 = 4 \\)."
  },
  {
    question: "If \\( \\log x + \\log y = \\log(x + y) \\), then:",
    option1: "x = y",
    option2: "xy = 1",
    option3: "y = x / (x - 1)",
    option4: "y = x / (x + 1)",
    ans: 3,
    explanation: "\\( \\log x + \\log y = \\log(xy) \\).<br>Given \\( \\log(xy) = \\log(x+y) \\).<br>Therefore, \\( xy = x + y \\).<br>\\( xy - y = x \\).<br>\\( y(x - 1) = x \\).<br>\\( y = \\frac{x}{x-1} \\)."
  },

  // --- CRITICAL REASONING & PUZZLES ---
  {
    question: "Statement: 'If you are a mechanical engineer, we want you as our supervisor.'<br>Conclusion I: We are looking for supervisors.<br>Conclusion II: We are a mechanical company.",
    option1: "Only I follows",
    option2: "Only II follows",
    option3: "Both I and II follow",
    option4: "Neither I nor II follows",
    ans: 1,
    explanation: "The statement clearly implies they are hiring supervisors (Conclusion I). However, they could be a construction or chemical company needing a mechanical supervisor; we cannot deduce the company type definitely (Conclusion II)."
  },
  {
    question: "Find the missing character in the visual puzzle (Circle divided into segments): 5, 10, ?, 50, 122",
    option1: "25",
    option2: "26",
    option3: "27",
    option4: "36",
    ans: 2,
    explanation: "Pattern: \\( n^2 + 1 \\).<br>\\( 2^2 + 1 = 5 \\).<br>\\( 3^2 + 1 = 10 \\).<br>\\( 5^2 + 1 = 26 \\).<br>\\( 7^2 + 1 = 50 \\).<br>\\( 11^2 + 1 = 122 \\).<br>(Using prime numbers 2, 3, 5, 7, 11). Ans is 26."
  },
  {
    question: "Count the number of triangles in a standard square with both diagonals drawn:",
    option1: "4",
    option2: "6",
    option3: "8",
    option4: "10",
    ans: 3,
    explanation: "In a square with two diagonals crossing, there are 4 small triangles and 4 large triangles (formed by combining two small ones). Total = 8."
  },
  {
    question: "A cube is painted blue on all faces and is then cut into 27 small identical cubes. How many small cubes have no paint on them?",
    option1: "1",
    option2: "3",
    option3: "4",
    option4: "8",
    ans: 1,
    explanation: "Formula for 0 painted faces = \\( (n-2)^3 \\).<br>Here, total cubes = 27, so \\( n^3 = 27 \\implies n = 3 \\).<br>Unpainted cubes = \\( (3-2)^3 = 1^3 = 1 \\).<br>This is the single core cube in the very center."
  },

  // --- VERBAL (Phrasal Verbs & Logic) ---
  {
    question: "Meaning of the phrase: 'To call it a day'",
    option1: "To start a job",
    option2: "To stop working",
    option3: "To work at night",
    option4: "To appreciate the day",
    ans: 2,
    explanation: "To call it a day means to decide that you have finished doing something for the day."
  },
  {
    question: "Select the odd word:",
    option1: "Listen",
    option2: "Swim",
    option3: "Walk",
    option4: "Climb",
    ans: 1,
    explanation: "Swim, Walk, and Climb involve significant physical body movement/displacement. Listening is a sensory perception action."
  },
  {
    question: "Statement: 'Nobody can predict the future.'<br>Conclusion: 'One should not plan for the future.'",
    option1: "Follows",
    option2: "Does not follow",
    option3: "Probably follows",
    option4: "None of these",
    ans: 2,
    explanation: "Just because the future is unpredictable doesn't mean planning is useless. Planning prepares you for uncertainties. The conclusion does not logically follow."
  },

  // --- MIXED BAG (The "Tough" Ones) ---
  {
    question: "If \\( 2^x = 3^y = 6^{-z} \\), then \\( \\frac{1}{x} + \\frac{1}{y} + \\frac{1}{z} \\) is equal to:",
    option1: "0",
    option2: "1",
    option3: "3/2",
    option4: "-1/2",
    ans: 1,
    explanation: "Let \\( 2^x = 3^y = 6^{-z} = k \\).<br>Then \\( 2 = k^{1/x}, 3 = k^{1/y}, 6 = k^{-1/z} \\).<br>We know \\( 2 \\times 3 = 6 \\).<br>\\( k^{1/x} \\times k^{1/y} = k^{-1/z} \\).<br>\\( k^{(1/x + 1/y)} = k^{-1/z} \\).<br>\\( \\frac{1}{x} + \\frac{1}{y} = -\\frac{1}{z} \\).<br>\\( \\frac{1}{x} + \\frac{1}{y} + \\frac{1}{z} = 0 \\)."
  },
  {
    question: "A towel shrinks 20% in length and 10% in breadth. What is the decrease in area?",
    option1: "30%",
    option2: "28%",
    option3: "32%",
    option4: "26%",
    ans: 2,
    explanation: "Use formula: \\( A + B - \\frac{AB}{100} \\) (for decrease use negative).<br>Actually simpler: Area = L*B.<br>New Area = (0.8L) * (0.9B) = 0.72 LB.<br>Decrease = 1 - 0.72 = 0.28 = 28%."
  },
  {
    question: "In a class of 60 students, 30 passed in Math, 25 in English and 15 in both. How many failed in both subjects?",
    option1: "10",
    option2: "15",
    option3: "20",
    option4: "25",
    ans: 3,
    explanation: "Total = 60.<br>Passed at least one = n(M) + n(E) - n(Both) = 30 + 25 - 15 = 40.<br>Failed both = Total - Passed at least one = 60 - 40 = 20."
  },
  {
     question: "Find the day of the week on 26th January 1950.",
     option1: "Tuesday",
     option2: "Thursday",
     option3: "Friday",
     option4: "Wednesday",
     ans: 2,
     explanation: "1600 yrs = 0 odd days. 300 yrs = 1 odd day. 49 yrs = 12 leap + 37 ordinary = 24+37 = 61 days = 5 odd days.<br>Jan 1950 (26 days) = 5 odd days.<br>Total = 1 + 5 + 5 = 11 => 4 odd days.<br>4 corresponds to Thursday."
  },
  {
    question: "A clock strikes once at 1 o'clock, twice at 2 o'clock, and so on. How many times will it strike in 24 hours?",
    option1: "78",
    option2: "136",
    option3: "156",
    option4: "196",
    ans: 3,
    explanation: "Strikes in 12 hours = Sum of 1 to 12 = \\( \\frac{12 \\times 13}{2} = 78 \\).<br>Strikes in 24 hours = \\( 78 \\times 2 = 156 \\)."
  },
  {
    question: "If A+B means A is the mother of B; A-B means A is the brother B; A%B means A is the father of B and A*B means A is the sister of B, which of the following shows that P is the maternal uncle of Q?",
    option1: "Q - N + M * P",
    option2: "P + S * N - Q",
    option3: "P - M + N * Q",
    option4: "Q - S % P",
    ans: 3,
    explanation: "Maternal Uncle means Mother's Brother.<br>Check option 3: P - M + N ...<br>P - M => P is brother of M.<br>M + N => M is mother of N.<br>So P is the brother of N's mother (P is maternal uncle of N).<br>If Q is sibling of N (implied by N*Q - N is sister of Q), then P is uncle of Q."
  },
  {
    question: "Complete the series: 4, 18, ?, 100, 180, 294",
    option1: "32",
    option2: "36",
    option3: "48",
    option4: "40",
    ans: 3,
    explanation: "Pattern: \\( n^3 - n^2 \\).<br>\\( 2^3 - 2^2 = 8 - 4 = 4 \\).<br>\\( 3^3 - 3^2 = 27 - 9 = 18 \\).<br>\\( 4^3 - 4^2 = 64 - 16 = 48 \\).<br>\\( 5^3 - 5^2 = 125 - 25 = 100 \\).<br>Ans is 48."
  }
]

// Normalized export: convert legacy question objects to the requested shape
export const normalizedData = data.map((q, idx) => {
  const options = [];
  for (let i = 1; i <= 4; i++) {
    const key = `option${i}`;
    if (Object.prototype.hasOwnProperty.call(q, key) && q[key] !== undefined) options.push(q[key]);
  }

  const ansRaw = q.ans ?? q.correct;
  const correct = typeof ansRaw === 'number' ? Math.max(0, ansRaw - 1) : 0;

  const text = (q.question || '').toLowerCase();
  let topic = 'Full Mock Test';

  if (/\b(train|km|speed|percent|percentage|probability|numbers|ratio|sum of|interest|mixture|algebra|geometry|arithmetic|distance|work|bank|cost price|selling price|ratio)\b/.test(text)) {
    topic = 'Quantitative Aptitude';
  } else if (/\b(series|puzzle|code|direction|blood|seating|odd one out|syllogism|assumption|conclusion|arrang|sitting|logic|deduction|pattern|sequence|cipher|riddle|problem)\b/.test(text)) {
    topic = 'Logical Reasoning';
  } else if (/\b(synonym|antonym|spot the error|choose the correct|idiom|phrase|meaning|spelling|rearrange|sentence|grammar|comprehension|vocab|word|fill in the blank|spelt|spelling)\b/.test(text)) {
    topic = 'Verbal Ability';
  }
  // Infer difficulty when not present: use simple heuristics on length and math symbols
  const inferDifficulty = (t) => {
    if (!t) return 'Medium';
    const len = t.length;
    const mathy = /\d|\(|\)|\\\(|\\\)|\^|\+|\-|\/|=|%/; // numbers or math chars
    if (mathy.test(t) && len > 120) return 'Hard';
    if (len < 80) return 'Easy';
    if (len < 220) return 'Medium';
    return 'Hard';
  };

  const difficulty = (q.difficulty ? String(q.difficulty) : undefined) ?? inferDifficulty(text);

  return {
    id: idx + 1,
    topic,
    question: q.question,
    options,
    correct,
    explanation: q.explanation,
    difficulty
  };
});

