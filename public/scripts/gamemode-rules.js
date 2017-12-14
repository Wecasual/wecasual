console.log('ready');
var heroes = new Array(
  {
    name: 'Abaddon',
    colour: 'Blue, Purple'
  },
  {
    name: 'Alchemist',
    colour: 'Yellow, Purple'
  },
  {
    name: 'Ancient Apparition',
    colour: 'Blue, White'
  },
  {
    name: 'Anti-Mage',
    colour: 'Purple'
  },
  {
    name: 'Arc Warden',
    colour: 'Blue, Purple'
  },
  {
    name: 'Axe',
    colour: 'Red'
  },
  {
    name: 'Bane',
    colour: 'Purple'
  },
  {
    name: 'Batrider',
    colour: 'Yellow, Red'
  },
  {
    name: 'Beastmaster',
    colour: 'Yellow'
  },
  {
    name: 'Bloodseeker',
    colour: 'Red'
  },
  {
    name: 'Bounty Hunter',
    colour: 'Yellow'
  },
  {
    name: 'Brewmaster',
    colour: 'Yellow'
  },
  {
    name: 'Bristleback',
    colour: 'Yellow'
  },
  {
    name: 'Broodmother',
    colour: 'Purple'
  },
  {
    name: 'Centaur Warrunner',
    colour: 'Red'
  },
  {
    name: 'Chaos Knight',
    colour: 'Red'
  },
  {
    name: 'Chen',
    colour: 'White'
  },
  {
    name: 'Clinkz',
    colour: 'Yellow'
  },
  {
    name: 'Clockwerk',
    colour: 'Red, White'
  },
  {
    name: 'Crystal Maiden',
    colour: 'Blue, White'
  },
  {
    name: 'Dark Seer',
    colour: 'Purple'
  },
  {
    name: 'Dark Willow',
    colour: 'Purple'
  },
  {
    name: 'Dazzle',
    colour: 'Purple'
  },
  {
    name: 'Death Prophet',
    colour: 'Green, Purple'
  },
  {
    name: 'Disruptor',
    colour: 'Blue, Red'
  },
  {
    name: 'Doom',
    colour: 'Red'
  },
  {
    name: 'Dragon Knight',
    colour: 'Red'
  },
  {
    name: 'Drow Ranger',
    colour: 'Blue'
  },
  {
    name: 'Earth Spirit',
    colour: 'Green'
  },
  {
    name: 'Earthshaker',
    colour: 'Yellow'
  },
  {
    name: 'Elder Titan',
    colour: 'Green, Yellow'
  },
  {
    name: 'Ember Spirit',
    colour: 'Red, Yellow'
  },
  {
    name: 'Enchantress',
    colour: 'Green'
  },
  {
    name: 'Enigma',
    colour: 'Purple'
  },
  {
    name: 'Faceless Void',
    colour: 'Purple'
  },
  {
    name: 'Gyrocopter',
    colour: 'Blue, Yellow'
  },
  {
    name: 'Huskar',
    colour: 'Blue, Red'
  },
  {
    name: 'Invoker',
    colour: 'White'
  },
  {
    name: 'Io',
    colour: 'White'
  },
  {
    name: 'Jakiro',
    colour: 'Blue, Red'
  },
  {
    name: 'Juggernaut',
    colour: 'White, Red'
  },
  {
    name: 'Keeper of the Light',
    colour: 'White, Yellow'
  },
  {,
    name: 'Kunkka',
    colour: 'Blue'
  },
  {,
    name: 'Legion Commander',
    colour: 'Red, Yellow'
  },
  {,
    name: 'Leshrac',
    colour: 'Blue'
  },
  {
    name: 'Lich',
    colour: 'White'
  },
  {
    name: 'Lifestealer',
    colour: 'Red, Yellow'
  },
  {
    name: 'Lina',
    colour: 'Red'
  },
  {
    name: 'Lion',
    colour: 'Purple, Red'
  },
  {
    name: 'Lone Druid',
    colour: 'Green, Yellow'
  },
  {
    name: 'Luna',
    colour: 'Blue'
  },
  {
    name: 'Lycan',
    colour: 'Red'
  },
  {
    name: 'Magnus',
    colour: 'Blue'
  },
  {
    name: 'Medusa',
    colour: 'Green'
  },
  {
    name: 'Meepo',
    colour: 'Blue'
  },
  {
    name: 'Mirana',
    colour: 'Blue'
  },
  {
    name: 'Monkey King',
    colour: 'Red, Yellow'
  },
  {
    name: 'Morphling',
    colour: 'Blue'
  },
  {
    name: 'Naga Siren',
    colour: 'Blue, Yellow'
  },
  {
    name: 'Nature\'s Prophet',
    colour: 'Blue, Green'
  },
  {
    name: 'Necrophos',
    colour: 'Green'
  },
  {
    name: 'Night Stalker',
    colour: 'Blue'
  },
  {
    name: 'Nyx Assassin',
    colour: 'Red, Yellow'
  },
  {
    name: 'Ogre Magi',
    colour: 'Blue, Red'
  },
  {
    name: 'Omniknight',
    colour: 'Red, White'
  },
  {
    name: 'Oracle',
    colour: 'Blue, Yellow'
  },
  {
    name: 'Outworld Devourer',
    colour: 'Green'
  },
  {
    name: 'Pangolier',
    colour: 'Purple, Yellow'
  },
  {
    name: 'Phantom Assassin',
    colour: 'Blue'
  },
  {
    name: 'Phantom Lancer',
    colour: 'Blue, Yellow'
  },
  {
    name: 'Phoenix',
    colour: 'Yellow'
  },
  {
    name: 'Puck',
    colour: 'Blue, Purple'
  },
  {
    name: 'Pudge',
    colour: 'Yellow'
  },
  {
    name: 'Pugna',
    colour: 'Green'
  },
  {
    name: 'Queen of Pain',
    colour: 'Blue, Red'
  },
  {
    name: 'Razor',
    colour: 'Blue'
  },
  {
    name: 'Riki',
    colour: 'Blue, Purple'
  },
  {
    name: 'Rubick',
    colour: 'Green'
  },
  {
    name: 'Sand King',
    colour: 'Yellow'
  },
  {
    name: 'Shadow Demon',
    colour: 'Red, Purple'
  },
  {
    name: 'Shadow Fiend',
    colour: 'Red'
  },
  {
    name: 'Shadow Shaman',
    colour: 'Yellow'
  },
  {
    name: 'Silencer',
    colour: 'Purple, Yellow'
  },
  {
    name: 'Skywrath Mage',
    colour: 'Yellow, White'
  },
  {
    name: 'Slardar',
    colour: 'Purple'
  },
  {
    name: 'Slark',
    colour: 'Blue, Yellow'
  },
  {
    name: 'Sniper',
    colour: 'Red, White'
  },
  {
    name: 'Spectre',
    colour: 'Purple'
  },
  {
    name: 'Spirit Breaker',
    colour: 'Blue'
  },
  {
    name: 'Storm Spirit',
    colour: 'Blue'
  },
  {
    name: 'Sven',
    colour: 'Blue, White'
  },
  {
    name: 'Techies',
    colour: 'Yellow'
  },
  {
    name: 'Templar Assassin',
    colour: 'Purple'
  },
  {
    name: 'Terrorblade',
    colour: 'Blue, Purple'
  },
  {
    name: 'Tidehunter',
    colour: 'Green'
  },
  {
    name: 'Timbersaw',
    colour: 'Red, Yellow'
  },
  {
    name: 'Tinker',
    colour: 'Purple, Yellow'
  },
  {
    name: 'Tiny',
    colour: 'White, Green'
  },
  {
    name: 'Treant Protector',
    colour: 'Green'
  },
  {
    name: 'Troll Warlord',
    colour: 'Red'
  },
  {
    name: 'Tusk',
    colour: 'Red, White'
  },
  {
    name: 'Underlord',
    colour: 'Green'
  },
  {
    name: 'Undying',
    colour: 'Green'
  },
  {
    name: 'Ursa',
    colour: 'Blue'
  },
  {
    name: 'Vengeful Spirit',
    colour: 'Blue'
  },
  {
    name: 'Venomancer',
    colour: 'Green'
  },
  {
    name: 'Viper',
    colour: 'Green'
  },
  {
    name: 'Visage',
    colour: 'Blue'
  },
  {
    name: 'Warlock',
    colour: 'Red'
  },
  {
    name: 'Weaver',
    colour: 'Blue'
  },
  {
    name: 'Windranger',
    colour: 'Green'
  },
  {
    name: 'Winter Wyvern',
    colour: 'Blue, White'
  },
  {
    name: 'Witch Doctor',
    colour: 'Purple'
  },
  {
    name: 'Wraith King',
    colour: 'Green'
  },
  {
    name: 'Zeus',
    colour: 'Blue, White'
  }


);
console.log(heroes);
