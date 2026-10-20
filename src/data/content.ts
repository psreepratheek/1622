/**
 * ✏️  EDIT EVERYTHING HERE — this is the only file you need to touch.
 *
 * Photos live in /public/photos/.
 * Replace the sample photos with your own (keep the same file names),
 * or change the paths below.
 */

export type PhotoStyle = "polaroid" | "strip";

export const content = {
  // 💗 Names
  herName: "Bujji Kannaa", // ← her name

  // 🎂 Her birthday (shown on the birthday screen)
  birthdayLabel: "22 October",

  // 🔐 Gift password(s). Any one of these unlocks the gift.
  // Dates are forgiving: 14-02-2023, 14/02/2023 and 14.02.2023 all work.
  // Capital letters and spaces are ignored for words.
  passwords: ["bangaram"],
  passwordPrompt: "What’s my favourite name when it comes from your lips?",
  passwordHint: "🫠 “It’s a name that makes me melt every time you say it.”",

  // 📅 The day you met — powers the "time together" counter (YYYY-MM-DD)
  metDate: "2023-02-14",

  // 📸 Photos. objectPosition keeps faces in frame ("50% 30%" = centre, upper third)
  photos: {
    chapterOne: { src: "/photos/start1.jpeg", objectPosition: "50% 40%", alt: "A moment from our story" },
    couple: { src: "/photos/us.jpeg", objectPosition: "50% 40%", alt: "Us together" },
    // Optional solo photo of her. Delete the file or set src to "" to skip this beat.
    her: { src: "/photos/her2.jpeg", objectPosition: "50% 30%", alt: "My favourite person" },
  },

  // 🖼️ Photo moment style: "polaroid" or "strip" (photo-booth strip)
  photoStyle: "polaroid" as PhotoStyle,
  photoCaption: "My favourite day with you, as its my best birthday till now because you made it so special for me, bujji kannaa 😘",
  herPhotoLine: "My kuchu puchuu, mari intha cute ga vunte ela ammaa 😘 , cheera lo ayite mareenuu chala baguntaav hehee..",

  // 💞 How we met — 2 to 3 short lines, typed out one by one
  howWeMet: [
    "Ikkade anukunta manam normal ga kante konchem close ayyam",
    "Enduko petali anipinchindi ",
    "Antha oka magic laa ayipoyindi akada nunchi Anduke chala special aa roju naku..",
  ],

  // 💌 Love letter (opens from an envelope). Each item is a paragraph.
  letter: [
    "Oii bujjii,",
    "Haaah ekkada start cheyali chala ante chala chepalii, starting asalu nuvu evaro nenu evaro anatu vundevalam kani ipudu haaahh. ",
    "Nijangaa nenu entha lucky kakapothe mana idaram kalisamm naa life lone idoka best moment bujji kannaa",
    "Starting okalaki okalu notes petevalam akada nunchi start ayindi mana idari story epudu intha close ayipoyamo teledu kani telsukoni em chestam it is one of our best incidents in our lives .",
    "Asalu naku matladatame radu thitte danivi kooda anuko starting lo hee kani manchi pane chesav lee ",
    "Matladuthunee chala close ayipoyam asalu time telesedu kadu manam kalisi chat chestunapudu asalu intha bega ayipothada anipistadi, late nights matladevalam chala chesam asalu night antha vundipovachu ayina em anipinchadu antha laa istam bujjii, uhumm okosari mathu lo padukumpoyanu anuko nuv kooda chesav lee happens emundi le",
    "And abboo chala memories lee iddarakii navvukodam, ekirinchukodam, thittukodam, edchukodam haahh chala sarluu telsi teliyakunda badha petta daniki matram chollyy bujji kannaa",
    "Second year summer holidays lo anukunte chala baa matladukunam asalu ittee ayipoyedi time chala close ayipoyanu aa time lo matramm.",
    "And, inka bayata kalavadam start chestunapudu nunchii abbbaa anni naa best moments ehh stadium nunchi anukuntaa start ika akada nunchi chepakarlee prathi moment naaa best memories life lo, ammo giri pradikshina ayitee chepakarlee chala ante chaala baa anipinchindi .",
    "Manam idaram kalisi time spend cheyadam seperate gaa, okalni okalu choosukoni navvukodam class lo, malli em kanattu vundadam abbo pichi eki poyedii heheee balega vundedii",
    "Inka taruvatha chala sarlu kalusthu vacham hehe chala sakulu chepi time spend chestunam intloo hehee bale vundedi kani neetho prathi second, uhummm chala chestunam kooda idaram kalisi bayata heheeee .",
    "Kakapothe abardhalu ekkuva ayipoyayee bujam ki kinda vastav mali nuv podugu anta aa time lo thapa eppudu navvu radu nee joke lu ki, ayina badha padaku le edhugutav lee bujji kanna.",
    "Once again, HAPPY BIRTHDAY BUJJI KANNAAA 😘💖💞, eppuduu navvuthu happyy ga vundalii bujjii edaku eppuduu nen kooda edipinchanu cholyy bujji.",
    "Inkaa chala chepachuu nee gurinchi entha chepina takkuvee kani chalu lee hehe, ummahhhhh.",
  ],

  // 🫙 Reasons I love you — she pulls them out of a jar one by one
  reasons: [
    "Mana idaram cheya patukoni vunapudu asalu antha marchipoyi ala vundipovali anipistadi",
    "Nuvu padukunapudu entha baguntavo telsaa ala ani normal ga bagovu ani kadu, naa shoulder meeda cheya patukoni padukunapudu haaahhh korikeyali anipistadii hehee",
    "Mana idaram kalisi bayata spend chese prathi second naku chalaa istamm",
    "Nuvu naku thinipisthunapudu ayitee haah china piladni ayipotha chala istamm naku",
    "cheera lo entha baguntavo telsaa epudu choosinaa flatt asaluu, naa bujji kanna vi",
    "Nuv bangaram ani pilichinapudu ayitee haahh ededo ayipothadii, ummahhh",
    "Asalu enduku intha bujji ga vuntavuu epudu choosina gatiga pateskovali anipistadii",
    "Mana idaram hug chesukunapudu, mudhu pedthunapudu haaaahhh entha chesina takkuve anipistadi hehee.",
  ],
  memories: {
    title: "Best memories with you",
    instruction: "tap the jar to pull one out",
    completed: "These are just a few of our memories—there are so many more, and I can’t wait to make them with you. 💗",
  },

  // 🌙 Finale lines
  finaleLines: ["Do you know how lucky i am..", "because i got you, hehee..."],

  // 🥺 The last question (the "No" button runs away!)
  loveQuestion: {
    continueLabel: "Continue 💗",
    question: "You also love me, right? 🥺",
    yes: "Yes 💖",
    // the "No" button changes its text each time it runs away
    noLabels: ["No", "Are you sure? 🥺", "Think again!", "Can't catch me 😜", "Nope, not happening 😝", "Nope nopee kastam hai", "Just say yes 💗"],
    shyHint: "Hmm, the 'No' button seems a little shy… 🙈",
    answer: "Hehee, ummahhhhh bujji kannaaa 😘💋",
    answerSub: "I knew it. I love you more, always. 💞",
    replayLabel: "Replay our story 🔁",
  },
} as const;

export type Content = typeof content;
