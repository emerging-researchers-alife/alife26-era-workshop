// Generated from the ERA submission sheet and the ALIFE 2026 Workshop schedule.
const WORKSHOP = [
  {
    "label": "Session A",
    "span": "10:00–12:00",
    "rows": [
      {
        "edt": "10:00-10:10",
        "session": "ERA Intro",
        "speaker": ""
      },
      {
        "edt": "10:15-10:30",
        "session": "Lightning talks",
        "speaker": "Andy Walsh"
      },
      {
        "edt": "10:30-10:45",
        "session": "",
        "speaker": "Alejandro Ruiz y Mesa"
      },
      {
        "edt": "10:45-11:00",
        "session": "",
        "speaker": "Iliya Zhechev"
      },
      {
        "edt": "11:00-11:10",
        "session": "Break",
        "speaker": ""
      },
      {
        "edt": "11:10-11:25",
        "session": "Lightning talks",
        "speaker": "Anushka Sharma"
      },
      {
        "edt": "11:25-11:40",
        "session": "",
        "speaker": "Prince Siddhpara"
      },
      {
        "edt": "11:40-12:00",
        "session": "",
        "speaker": "Alex Alvarez"
      }
    ]
  },
  {
    "label": "Session B",
    "span": "15:00–17:00",
    "rows": [
      {
        "edt": "15:00-15:15",
        "session": "Lightning talks",
        "speaker": "Sean Hardy"
      },
      {
        "edt": "15:15-15:30",
        "session": "",
        "speaker": "Jason Yoder"
      },
      {
        "edt": "15:30-17:00",
        "session": "Ants Hackathon",
        "speaker": "ERA organisers"
      }
    ]
  }
];

const TALKS = [
  {
    "name": "Andy Walsh",
    "url": "https://bsky.app/profile/andyswalsh.bsky.social",
    "urlLabel": "@andyswalsh",
    "affiliation": "Independent researcher",
    "title": "Neutrally Evolving Interlocking Complexity in the Quandary Den",
    "abstract": [
      "Molecular biology features numerous complexes of proteins that coordinate in an interlocking fashion to fulfill different functions. Adaptive evolution explains some of this complexity, but needn't be the default when neutral explanations suffice. A new artificial life model \"organism,\" the Quandary Den, is introduced to explore different neutral evolution scenarios where complexity increases in the absence of greater informational needs. Two interlocking complexity scenarios emerge. Subfunctionalization leads to functionality diffusing through the complex. Masking allows intracomplex interference to accumulate genetically, requiring that it be blocked at the level of expression."
    ],
    "bio": "Andy Walsh is the Chief Science Officer at Health Monitoring, a public health software company. Their tools for analyzing prediagnostic healthcare data are used by public health professionals to stay on top of trends in emerging and endemic health conditions from the flu to substance use disorders. He earned a PhD in molecular microbiology and immunology from the Bloomberg School of Public Health by trapping mosquitoes and building statistical models."
  },
  {
    "name": "Alejandro Ruiz y Mesa",
    "url": null,
    "urlLabel": null,
    "affiliation": "Independent researcher",
    "title": "Oscillatory Cellular Automata as a Substrate for Autopoietic Self-Repair",
    "abstract": [
      "Autopoietic characteristics –such as self-production and self-reparation– are longstanding design goals in artificial life. Neural Cellular Automata (NCA) have been used to simulate such autopoietic characteristics and have shown to settle into oscillatory attractors. Separately, damped oscillatory dynamics have shown to carry memory and computation tasks in the neocortex. Such networks of oscillators tend to code information with ghost attractors that emerge at criticality. Motivated by these parallels, we explore the suitability of cellular automata exhibiting intrinsic oscillatory dynamics to self-repair a morphological pattern after a perturbation in a digital toy void environment. We report early implementation challenges, both defining the oscillatory update rule and deploying it on non-conventional (i.e., non-CUDA) digital hardware. Future work will examine (1) whether small perturbations give rise to ghost-attractor-like transients, and (2) whether larger perturbations during the growth phase can induce the emergence of qualitatively new attractors, as has been observed in related NCA and continuous-attractor systems."
    ],
    "bio": "Fresh grad electrical and computer engineer from TU Dresden, Germany, interested in hardware and unconventional compute. Working on compilation of dynamic systems and simulation."
  },
  {
    "name": "Iliya Zhechev",
    "url": "https://ichko.github.io",
    "urlLabel": "ichko.github.io",
    "affiliation": "Sofia University",
    "title": "Self-organized boolean computation",
    "abstract": [
      "Neural cellular automata are usually trained to grow and repair shapes; this one computes. A single learned update rule, applied locally over many steps, self-organises the answer from spatially encoded inputs. Explore the live demo here: https://ncpu.pages.dev"
    ],
    "bio": "I like to make NCAs do stuff"
  },
  {
    "name": "Anushka Sharma",
    "url": "https://www.researchgate.net/profile/Anushka-Sharma-77",
    "urlLabel": "researchgate",
    "affiliation": "Independent researcher",
    "title": "What Happens When Evolution Has No Reward? A Platform for Fitness-Free Open-Endedness",
    "abstract": [
      "Genesis is a platform I built to study evolution without a fitness function: no reward, no objective, just agents and an environment that co-evolve under shared constraints.",
      "Across 12 independent runs spanning 10,000+ generations, agents grew from 52 to 467 internal nodes while their behavior stayed flat for hundreds of generations, then became roughly 4x richer later. That gap between internal complexity and behavioral expression is the core finding, a structural lag that shows up consistently and isn't explained by noise. I checked this with sham-controlled experiments and pruning tests: the extra structure only collapsed under 90% pruning, and runs with constrained physics stagnated instead of showing the same jump.",
      "This talk walks through what Genesis is, what the lag looks like in the data, and why I think it might be a general property of complex adaptive systems evolving under pressure rather than an artifact of this particular setup. Two related papers from this work are appearing at GECCO 2026."
    ],
    "bio": "Anushka Sharma is an independent researcher building Genesis: a fitness-free, constraint-driven evolution platform. She has two first-author papers at GECCO 2026. Her current work focuses on structure-function lag in open-ended evolutionary systems and the meta-evolution of physics across co-evolving worlds."
  },
  {
    "name": "Prince Siddhpara",
    "url": "https://mura-alife.com",
    "urlLabel": "mura-alife.com",
    "affiliation": "Mura ALife Labs",
    "title": "Reasoning Without Backpropagation: A Near-Zero-Compute Vector-Symbolic Organism",
    "abstract": [
      "Ikigai is a digital organism i've been building on a vector symbolic (FHRR phasor) substrate instead of a neural network. It stores plain facts and rules and works out the answers when you ask, so the multi hop reasoning happens at query time rather than being memorized. On an equal knowledge test, where both sides get the exact same facts, it derives 100% of the held out multi hop conclusions through 8 hops with zero made up answers, using around 9 lookups per query (microseconds, one CPU core). That matches a live 550B parameter frontier model on correctness at roughly a millionth of the compute. It also learns without backpropagation, taking in about 15,000 facts a second on one core, which comes to around $0.36 per billion facts with no GPU. How it picks a method is emergent too, it arbitrates between reasoning, retrieval, arithmetic and planning by free energy, with no hand written router, and it just says i don't know when the query sits below its own noise floor. I'll walk through the architecture, the numbers, and the honest limit, which is that it doesn't match large open ended generation yet. Still very much a work in progress, and i'm looking for data and people to build it with."
    ],
    "bio": "Hi! Im Prince, 17 year old researcher and the founder of Mura ALife Labs. I work solo on NeuroSeed, the framework behind Ikigai, a near zero compute digital organism. You can find more about me and the project at princesiddhpara.com and mura-alfie.com"
  },
  {
    "name": "Alex Alvarez",
    "url": "https://x.com/0xalexrez",
    "urlLabel": "@0xalexrez",
    "affiliation": "MIT",
    "title": "Limbomorphs",
    "abstract": [
      "Artificial life systems are typically defined by a set of dynamical rules over an environment, an agent, or both, from which lifelike patterns may emerge. Gifbreeder is an animated version of the interactive evolutionary computation (IEC) platform Picbreeder, and was initially created to generate visual art. Instead of encoding the agent or the environment, Gifbreeder genomes encode a spatiotemporal field and evolve through the user's aesthetic selection. The evolved expressions can sometimes resemble motile lifelike creatures that we term Limbomorphs, given that they exist in a deterministic three-second looping “limbo”. We assess their behavior via input-space perturbations and find species-specific reactions to different kinds of perturbations. We discuss whether these reactions may reflect goal-directed behavior like navigation, or merely the appearance of it, and more broadly how agent-like dynamics may emerge in a system with no explicitly defined agent, environment, or interaction rules."
    ],
    "bio": "I'm a postbac in the Computational Cognitive Science Lab at MIT, where I study principles of learning and intelligence across natural and artificial systems. I'm broadly interested in open-endedness, meta-learning, and Human-AI interaction."
  },
  {
    "name": "Sean Hardy",
    "url": "https://seanjhardy.com",
    "urlLabel": "seanjhardy.com",
    "affiliation": "Independent researcher",
    "title": "Genetica: Evolving animal morphology",
    "abstract": [
      "Genetica is an ongoing project to simulate the evolution of earth-like aquatic organisms with complex morphologies and brains. Genetica uses a novel algorithm for representing creature morphologies, inspired by real gene-regulatory networks. It allows for modular organisms that exhibit within-lifetime, nonlinear growth, serial homology, continuous morphological mutation, and complex functional bodies with interior tissues and exterior structures. Most importantly, these creatures are super efficient to simulate on a GPU, so I can simulate thousands of organisms at ecosystem scale on a laptop."
    ],
    "bio": "I'm a 24 year old software engineer based in the UK, but in my spare time I'm building Genetica. Not sure what to put here but I’d love the opportunity to give a talk :D"
  },
  {
    "name": "Jason Yoder",
    "url": "https://alife-edu.github.io/",
    "urlLabel": "alife-edu.github.io",
    "affiliation": "Rose-Hulman Institute of Technology",
    "title": "Introducing ALife-Edu: A Community for Artificial Life Education",
    "abstract": [
      "In this talk I will give a short background of my journey as an educator and my efforts to create \"ALife-Edu\" - a new organization that has been developing since ALIFE2025. Inspired by my own personal experiences within communities of creative educators, I have sought to help organize a community focused on education and artificial life. I will give an introduction to the progress we have made thus far, recapping our recent virtual workshops in May (AEDU) which brought together ALife educators from around the world. I will introduce some details about the plans for the organization including a draft charter, how to get involved, and a brief outline of the opportunities within the Teaching (with) Artificial Life workshop (Thursday 10am-12pm)."
    ],
    "bio": "Jason A. Yoder is an Associate Professor of Computer Science and Software Engineering at Rose-Hulman Institute of Technology in Terre Haute, IN. His research interests span artificial life, bio-inspired AI, developmental neural networks, evolutionary development (Evo-Devo), and evolvable hardware, exploring how biological principles inform intelligence, learning, and system adaptability. He has a passion for mentoring undergraduate researchers and has repeatedly published work with them in ALIFE, as well as in other venues. He has ongoing industry collaborations with a shared research interest in developing an open-source evolvable hardware platform. He integrates these research areas into undergraduate mentorship and courses at Rose-Hulman Institute of Technology, engaging students in long-term research projects."
  },
  {
    "name": "Piotr Walas",
    "url": null,
    "urlLabel": null,
    "affiliation": "Warsaw University of Technology",
    "title": "Sneak peek Swarmnasium: a year into RL stimulation",
    "abstract": [
      "Sneak peek into Swarmnasium framework for making RL swarm oriented environments"
    ],
    "bio": "I am Piotr research assistant at WUT in Warsaw and freelance software engineer"
  }
];
