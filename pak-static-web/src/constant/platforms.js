export default [
  // {
  //   code: "E-sports",
  //   name: "E-sports",
  //   path: "/e-sport",
  //   hasSub: true,
  //   tabOrder: 5,
  //   isLink: true,
  //   submenu: [
  //     {
  //       code: "Play4Win",
  //       icon: "jolly88",
  //       to: "/e-sport"
  //     }
  //   ]
  // },
  {
    code: "casino",
    name: "Live Casino",
    path: "/live-casino",
    icon: require("@/assets/images/index/menu/menu_sport.png"),
    hasSub: true,
    isLink: false,
    tabOrder: 3,
    submenu: [
      {
        code: "EvoAce",
        icon: "live1_1",
        name: "Evolution",
        status: "NORMAL",
        gameName: "EVO"
      },
      {
        code: "AWC",
        icon: "live4_01",
        name: "AE Sexy",
        status: "NORMAL",
        gameName: "AE Sexy",
        gameCode: "MX-LIVE-001"
      },
      {
        code: "EZUGI",
        icon: "live3_01",
        name: "Ezugi",
        status: "NORMAL",
        gameName: "EZUGI"
      }
    ]
  },
  {
    code: "Sports",
    name: "Sports",
    path: "/sport",
    icon: require("@/assets/images/index/menu/menu_sport.png"),
    hasSub: true,
    isLink: true,
    tabOrder: 9,
    submenu: [
      {
        code: "Play4Win",
        icon: "jolly88",
        to: "/sport"
      }
    ]
  },
  // {
  //   code: "CockFight",
  //   name: "Cockfight",
  //   path: "/cockfight",
  //   icon: require("@/assets/images/index/menu/menu_sport.png"),
  //   hasSub: true,
  //   isLink: true,
  //   tabOrder: 7,
  //   submenu: [
  //     {
  //       code: "Play4Win",
  //       icon: "cockfight-sub-icon.png",
  //       to: "/cockfight"
  //     }
  //   ]
  // },
  // {
  //   code: "bingo",
  //   name: "Bingo",
  //   path: "/bingo",
  //   icon: require("@/assets/images/index/menu/menu_sport.png"),
  //   hasSub: true,
  //   isLink: true,
  //   tabOrder: 4,
  //   submenu: [
  //     {
  //       code: "Play4Win",
  //       icon: "bingo-menu-icon.png",
  //       to: "/bingo"
  //     }
  //   ]
  // },
  {
    code: "Poker",
    name: "Poker",
    path: "/poker",
    icon: require("@/assets/images/index/menu/menu_sport.png"),
    isLink: false,
    hasSub: true,
    tabOrder: 8,
    submenu: [
      {
        code: "JILI",
        name: "Jili Games",
        status: "NORMAL",
        gameName: "Jili",
        gameCode: "64",
        // bg: require("../assets/images/games/poker/poker_1.jpg"),
        // main: require("../assets/images/games/poker/poker1_1.png"),
        logo: require("../assets/images/common/logo/jl.png")
        // menuicon: require("../assets/images/games/poker/poker-img1.png")
      },
      {
        code: "RICH88",
        name: "Rich88",
        status: "NORMAL",
        gameName: "Rich88",
        // bg: require("../assets/images/games/poker/poker_2.jpg"),
        // main: require("../assets/images/games/poker/poker2_01.png"),
        logo: require("../assets/images/common/logo/RICH88.png")
        // menuicon: require("../assets/images/games/poker/poker-img2.png")
      },
      {
        code: "KM",
        name: "KM",
        status: "NORMAL",
        gameName: "KM",
        // bg: require("../assets/images/games/poker/poker_3.jpg"),
        // main: require("../assets/images/games/poker/poker3_01.png"),
        logo: require("../assets/images/common/logo/km.png")
        // menuicon: require("../assets/images/games/poker/poker-img3.png")
      }
    ]
  },
  // {
  //   code: "minigame",
  //   name: "Hash Games",
  //   path: "/minigame",
  //   icon: require("@/assets/images/index/menu/menu_sport.png"),
  //   hasSub: true,
  //   isLink: true,
  //   tabOrder: 1,
  //   submenu: [
  //     {
  //       code: "Play4Win",
  //       icon: "bingo-menu-icon.png",
  //       to: "/minigame"
  //     }
  //   ]
  // },
  {
    id: "SLOT",
    code: "Slots",
    name: "Slots",
    path: "/slot",
    icon: require("@/assets/images/index/menu/menu_slots.png"),
    hasSub: true,
    isLink: false,
    tabOrder: 2,
    platformType: "SLOT",
    tabFilter: "JILI",
    submenu: [
      {
        code: "YESB",
        icon: "YESB",
        to: "/slot?plat=YESB"
      },
      {
        code: "PG",
        icon: "PG",
        to: "/slot?plat=PG"
      },
      {
        code: "JILI",
        icon: "JILI",
        to: "/slot?plat=JILI"
      },
      {
        code: "FC",
        icon: "FC",
        to: "/slot?plat=FC"
      },
      {
        code: "CQ9",
        icon: "CQ9",
        to: "/slot?plat=CQ9"
      },
      {
        code: "JDB",
        icon: "JDB",
        to: "/slot?plat=JDB"
      },
      {
        code: "KA",
        icon: "KA",
        to: "/slot?plat=KA"
      },
      {
        code: "RICH88",
        icon: "RICH88",
        to: "/slot?plat=RICH88"
      },
      {
        code: "PS",
        icon: "PS",
        to: "/slot?plat=PS"
      },
      {
        code: "BNG",
        icon: "BNG",
        to: "/slot?plat=BNG"
      },
      {
        code: "MGP",
        icon: "MGP",
        to: "/slot?plat=MGP"
      }
    ]
  },
  {
    id: "FISH",
    code: "Fishing",
    name: "Fishing",
    path: "/aviator",
    icon: require("@/assets/images/index/menu/menu_fish.png"),
    hasSub: true,
    isLink: false,
    tabOrder: 6,
    platformType: "FISH",
    tabFilter: "JILI",
    submenu: [
      {
        code: "JILI",
        icon: "JILI",
        to: "/aviator?plat=JILI"
      },
      {
        code: "FC",
        icon: "FC",
        to: "/aviator?plat=FC"
      },
      {
        code: "CQ9",
        icon: "CQ9",
        to: "/aviator?plat=CQ9"
      },
      {
        code: "JDB",
        icon: "JDB",
        to: "/aviator?plat=JDB"
      },
      {
        code: "KA",
        icon: "KA",
        to: "/aviator?plat=KA"
      },
      {
        code: "YL",
        icon: "YL",
        to: "/aviator?plat=YL"
      },
      {
        code: "YESB",
        icon: "YESB",
        to: "/aviator?plat=YESB"
      }
    ]
  }
];
