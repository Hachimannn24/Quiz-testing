import { Quiz } from '../types';

export const defaultQuizzes: Quiz[] = [
  {
    id: 'web-dev-basics',
    title: 'Modern Web Development',
    description: 'Test your knowledge of React hooks, CSS layout systems, JavaScript engines, and modern browser APIs.',
    category: 'Web Development',
    difficulty: 'Medium',
    timeLimitSeconds: 20,
    questions: [
      {
        id: 'wd-1',
        question: 'Which of the following describes why a React developer might use the "useRef" hook?',
        options: [
          'To force a component re-render when a value changes.',
          'To persist values between renders without triggering a re-render.',
          'To perform side effects such as fetching data from an external API.',
          'To memoize computationally expensive calculations.'
        ],
        correctAnswerIndex: 1,
        explanation: 'Unlike useState, updating a ref via "useRef" (by modifying its .current property) does not trigger a component re-render. This is highly useful for accessing DOM elements directly or keeping track of timer IDs and previous state values.'
      },
      {
        id: 'wd-2',
        question: 'What is the primary difference between a JavaScript Microtask and Macrotask in the browser Event Loop?',
        options: [
          'Microtasks are executed in parallel threads, while macrotasks run sequentially on the main thread.',
          'Macrotasks have higher priority and execute before microtasks in every tick.',
          'The microtask queue is entirely cleared before the browser proceeds to the next macrotask or rendering step.',
          'Microtasks are only used for synchronous operations, while macrotasks handle asynchronous requests.'
        ],
        correctAnswerIndex: 2,
        explanation: 'After every macrotask (such as setTimeout, setInterval, or user input events), the Event Loop executes and completely drains the entire Microtask queue (which includes Promise.then callbacks and MutationObserver callbacks) before doing any style recalculation, layout, or running the next macrotask.'
      },
      {
        id: 'wd-3',
        question: 'In CSS Grid Layout, which property combination is used to create a responsive, fluid grid without using media queries?',
        options: [
          'grid-template-columns: repeat(auto-fit, minmax(200px, 1fr))',
          'grid-template-columns: repeat(12, minmax(0, 1fr))',
          'grid-auto-flow: dense; grid-gap: var(--spacing)',
          'grid-template-columns: fit-content(200px) 1fr'
        ],
        correctAnswerIndex: 0,
        explanation: 'Using repeat(auto-fit, minmax(200px, 1fr)) creates a fluid grid. "auto-fit" automatically inserts as many tracks of at least 200px as can fit into the grid container, stretching them to fill empty space up to 1fr, eliminating the need for rigid @media break points.'
      },
      {
        id: 'wd-4',
        question: 'Which HTTP status code signifies that a resource has permanently moved to a new URI, instructing search engines to update their indexing?',
        options: [
          '302 Found',
          '301 Moved Permanently',
          '307 Temporary Redirect',
          '308 Permanent Redirect'
        ],
        correctAnswerIndex: 1,
        explanation: 'The "301 Moved Permanently" status code instructs the client and SEO spiders that the target resource has been assigned a new permanent URI. The "308 Permanent Redirect" is similar but strictly forbids changing the request method (e.g., from POST to GET).'
      },
      {
        id: 'wd-5',
        question: 'What does the "defer" attribute do when added to an HTML <script> tag?',
        options: [
          'It pauses HTML parsing immediately to fetch and execute the script.',
          'It executes the script instantly in a background worker thread.',
          'It downloads the script asynchronously and executes it only after the entire HTML document is fully parsed.',
          'It delays script downloading until the page is scrolled to the bottom.'
        ],
        correctAnswerIndex: 2,
        explanation: 'The "defer" attribute downloads the script in the background (parallel to HTML parsing) and executes it only after HTML parsing is complete, preserving the script execution order. This contrasts with "async", which executes as soon as it finishes downloading, potentially blocking HTML parsing.'
      }
    ]
  },
  {
    id: 'science-nature',
    title: 'Wonders of Science',
    description: 'Explore the depths of modern astronomy, biological structures, chemical mysteries, and quantum phenomena.',
    category: 'Science & Nature',
    difficulty: 'Hard',
    timeLimitSeconds: 15,
    questions: [
      {
        id: 'sc-1',
        question: 'What is the exact physical phenomenon that prevents a neutron star from collapsing further under its own intense gravitational pull?',
        options: [
          'Thermal nuclear fusion pressure',
          'Electron degeneracy pressure',
          'Neutron degeneracy pressure',
          'Quantum electrostatic repulsion'
        ],
        correctAnswerIndex: 2,
        explanation: 'Neutron degeneracy pressure, arising from the Pauli Exclusion Principle (which states that two fermions, like neutrons, cannot occupy the same quantum state simultaneously), is what keeps neutron stars stable. If the star is too massive (above the Tolman-Oppenheimer-Volkoff limit), gravity wins and collapses it into a black hole.'
      },
      {
        id: 'sc-2',
        question: 'Which biological organelle is responsible for synthesizing lipids, metabolizing carbohydrates, and detoxifying drugs or poisons?',
        options: [
          'Rough Endoplasmic Reticulum',
          'Smooth Endoplasmic Reticulum',
          'Golgi Apparatus',
          'Lysosome'
        ],
        correctAnswerIndex: 1,
        explanation: 'The Smooth Endoplasmic Reticulum (SER) is a membrane-bound organelle that synthesizes cellular lipids (including phospholipids and steroids), processes carbohydrates, and plays a critical role in detoxifying toxic compounds (especially in human liver cells).'
      },
      {
        id: 'sc-3',
        question: 'Why does ice float on liquid water, a rare property among compounds where solid states are typically denser?',
        options: [
          'The solid form traps micro-bubbles of atmospheric air during freezing.',
          'Hydrogen bonds in ice form a crystalline lattice that holds water molecules further apart than in liquid state.',
          'Ice undergoes molecular sublimation that decreases its overall atomic mass.',
          'Liquid water molecules carry a stronger electrical charge, repelling the solid ice upward.'
        ],
        correctAnswerIndex: 1,
        explanation: 'As water cools below 4°C, hydrogen bonds stabilize to form a rigid, open hexagonal crystalline lattice. This holds the molecules further apart than they are in the fluid, chaotic liquid state, making ice about 9% less dense than liquid water.'
      },
      {
        id: 'sc-4',
        question: 'Which element is considered the "King of Chemistry" because it has the highest electronegativity and is capable of forming compounds with almost all other elements?',
        options: [
          'Oxygen',
          'Fluorine',
          'Carbon',
          'Helium'
        ],
        correctAnswerIndex: 1,
        explanation: 'Fluorine (F) is the most electronegative element on the periodic table (value of 3.98 on the Pauling scale). It is extremely reactive, pulling electrons away from other atoms with such strength that it can form compounds even with inert noble gases like Xenon.'
      }
    ]
  },
  {
    id: 'world-history',
    title: 'Epochs of History',
    description: 'Travel through pivotal ancient discoveries, revolutionary movements, and legendary historical figures.',
    category: 'History',
    difficulty: 'Medium',
    timeLimitSeconds: 20,
    questions: [
      {
        id: 'hs-1',
        question: 'The discovery of the Rosetta Stone in 1799 was monumental for archeology. What did it primarily enable scholars to do?',
        options: [
          'Map the precise borders of ancient Egypt during the Old Kingdom.',
          'Decipher ancient Egyptian Hieroglyphs for the first time.',
          'Identify the tomb of the famous Pharaoh Tutankhamun.',
          'Track the movement of trade goods along the Silk Road.'
        ],
        correctAnswerIndex: 1,
        explanation: 'The Rosetta Stone features the same royal decree written in three distinct writing systems: Egyptian Hieroglyphs, Demotic script, and Ancient Greek. Because scholars could read Ancient Greek, they were finally able to cross-reference and decode the long-lost Egyptian hieroglyphic system.'
      },
      {
        id: 'hs-2',
        question: 'Which empire, known for its rapid expansion across Eurasia, established the Pax Mongolica, ensuring safe trade along the Silk Road?',
        options: [
          'The Roman Empire',
          'The Ottoman Empire',
          'The Mongol Empire',
          'The Persian Empire'
        ],
        correctAnswerIndex: 2,
        explanation: 'In the 13th and 14th centuries, the Mongol Empire established a period of relative peace and stability across Asia and Europe. This "Pax Mongolica" allowed merchants, explorers (like Marco Polo), and diplomats to travel safely along trade routes stretching from China to the Mediterranean.'
      },
      {
        id: 'hs-3',
        question: 'Which invention is credited with initiating the European Age of Enlightenment and sparking the Protestant Reformation by democratizing literacy?',
        options: [
          'The Astrolabe',
          'The Gutenberg Printing Press',
          'The Magnetic Compass',
          'The Mechanical Clock'
        ],
        correctAnswerIndex: 1,
        explanation: 'Johannes Gutenberg invented the movable-type printing press around 1440. It allowed books to be mass-produced, drastically reducing their cost, elevating literacy rates across Europe, and allowing religious and scientific ideas to spread without church censorship.'
      }
    ]
  },
  {
    id: 'general-knowledge',
    title: 'Ultimate Trivia Challenge',
    description: 'A diverse mix of trivia across geography, world facts, vocabulary, and curious historical events.',
    category: 'General Knowledge',
    difficulty: 'Easy',
    timeLimitSeconds: 15,
    questions: [
      {
        id: 'gk-1',
        question: 'Which of the following countries is completely landlocked, meaning it is entirely surrounded by land with no direct ocean coastline?',
        options: [
          'Switzerland',
          'Vietnam',
          'Portugal',
          'South Africa'
        ],
        correctAnswerIndex: 0,
        explanation: 'Switzerland is a landlocked alpine country located in Central Europe, bordered by France, Germany, Italy, Austria, and Liechtenstein. It has no direct access to open sea routes.'
      },
      {
        id: 'gk-2',
        question: 'What is the name of the deepest known point in the Earth\'s oceans, situated in the Western Pacific?',
        options: [
          'The Java Trench',
          'The Puerto Rico Trench',
          'The Mariana Challenger Deep',
          'The Sunda Deep'
        ],
        correctAnswerIndex: 2,
        explanation: 'The Challenger Deep, located in the southern end of the Mariana Trench, is the deepest known spot on Earth. It has an estimated depth of nearly 11,000 meters (approx. 36,000 feet)—deep enough to easily submerge Mount Everest.'
      },
      {
        id: 'gk-3',
        question: 'How many time zones are there in the world, assuming standard 1-hour offsets?',
        options: [
          '12',
          '24',
          '360',
          '18'
        ],
        correctAnswerIndex: 1,
        explanation: 'The Earth rotates 15 degrees per hour, leading to 24 theoretical standard time zones spaced 15 degrees apart across a full 360-degree rotation. Although actual political boundaries cause some irregular offsets, there are 24 major standard hourly zones.'
      }
    ]
  }
];
