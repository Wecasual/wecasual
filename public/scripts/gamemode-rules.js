console.log('ready');
var heroes = new Array(
  {
    name: 'Abaddon',
    icon: '/images/heroes/abaddon.png',
    colour: 'blue, purple'
  },
  {
    name: 'Alchemist',
    icon: '/images/heroes/alchemist.png',
    colour: 'yellow, purple'
  },
  {
    name: 'Ancient Apparition',
    icon: '/images/heroes/ancient_apparition.png',
    colour: 'blue, white'
  },
  {
    name: 'Anti-Mage',
    icon: '/images/heroes/antimage.png',
    colour: 'purple'
  },
  {
    name: 'Arc Warden',
    icon: '/images/heroes/arc_warden.png',
    colour: 'blue, purple'
  },
  {
    name: 'Axe',
    icon: '/images/heroes/axe.png',
    colour: 'red'
  },
  {
    name: 'Bane',
    icon: '/images/heroes/bane.png',
    colour: 'purple'
  },
  {
    name: 'Batrider',
    icon: '/images/heroes/batrider.png',
    colour: 'yellow, red'
  },
  {
    name: 'Beastmaster',
    icon: '/images/heroes/beastmaster.png',
    colour: 'yellow'
  },
  {
    name: 'Bloodseeker',
    icon: '/images/heroes/bloodseeker.png',
    colour: 'red'
  },
  {
    name: 'Bounty Hunter',
    icon: '/images/heroes/bounty_hunter.png',
    colour: 'yellow'
  },
  {
    name: 'Brewmaster',
    icon: '/images/heroes/brewmaster.png',
    colour: 'yellow'
  },
  {
    name: 'Bristleback',
    icon: '/images/heroes/bristleback.png',
    colour: 'yellow'
  },
  {
    name: 'Broodmother',
    icon: '/images/heroes/broodmother.png',
    colour: 'purple'
  },
  {
    name: 'Centaur Warrunner',
    icon: '/images/heroes/centaur_warrunner.png',
    colour: 'red'
  },
  {
    name: 'Chaos Knight',
    icon: '/images/heroes/chaos_knight.png',
    colour: 'red'
  },
  {
    name: 'Chen',
    icon: '/images/heroes/chen.png',
    colour: 'white'
  },
  {
    name: 'Clinkz',
    icon: '/images/heroes/clinkz.png',
    colour: 'yellow'
  },
  {
    name: 'Clockwerk',
    icon: '/images/heroes/clockwerk.png',
    colour: 'red, white'
  },
  {
    name: 'Crystal Maiden',
    icon: '/images/heroes/crystal_maiden.png',
    colour: 'blue, white'
  },
  {
    name: 'Dark Seer',
    icon: '/images/heroes/dark_seer.png',
    colour: 'purple'
  },
  {
    name: 'Dark Willow',
    icon: '/images/heroes/dark_willow.png',
    colour: 'purple'
  },
  {
    name: 'Dazzle',
    icon: '/images/heroes/dazzle.png',
    colour: 'purple'
  },
  {
    name: 'Death Prophet',
    icon: '/images/heroes/death_prophet.png',
    colour: 'green, purple'
  },
  {
    name: 'Disruptor',
    icon: '/images/heroes/disruptor.png',
    colour: 'blue, red'
  },
  {
    name: 'Doom',
    icon: '/images/heroes/doom.png',
    colour: 'red'
  },
  {
    name: 'Dragon Knight',
    icon: '/images/heroes/dragon_knight.png',
    colour: 'red'
  },
  {
    name: 'Drow Ranger',
    icon: '/images/heroes/drow_ranger.png',
    colour: 'blue'
  },
  {
    name: 'Earth Spirit',
    icon: '/images/heroes/earth_spirit.png',
    colour: 'green'
  },
  {
    name: 'Earthshaker',
    icon: '/images/heroes/earthshaker.png',
    colour: 'yellow'
  },
  {
    name: 'Elder Titan',
    icon: '/images/heroes/elder_titan.png',
    colour: 'green, yellow'
  },
  {
    name: 'Ember Spirit',
    icon: '/images/heroes/ember_spirit.png',
    colour: 'red, yellow'
  },
  {
    name: 'Enchantress',
    icon: '/images/heroes/enchantress.png',
    colour: 'green'
  },
  {
    name: 'Enigma',
    icon: '/images/heroes/enigma.png',
    colour: 'purple'
  },
  {
    name: 'Faceless Void',
    icon: '/images/heroes/faceless_void.png',
    colour: 'purple'
  },
  {
    name: 'Gyrocopter',
    icon: '/images/heroes/gyrocopter.png',
    colour: 'blue, yellow'
  },
  {
    name: 'Huskar',
    icon: '/images/heroes/huskar.png',
    colour: 'blue, red'
  },
  {
    name: 'Invoker',
    icon: '/images/heroes/invoker.png',
    colour: 'white'
  },
  {
    name: 'Io',
    icon: '/images/heroes/io.png',
    colour: 'white'
  },
  {
    name: 'Jakiro',
    icon: '/images/heroes/jakiro.png',
    colour: 'blue, red'
  },
  {
    name: 'Juggernaut',
    icon: '/images/heroes/juggernaut.png',
    colour: 'white, red'
  },
  {
    name: 'Keeper of the Light',
    icon: '/images/heroes/keeper_of_the_light.png',
    colour: 'white, yellow'
  },
  {
    name: 'Kunkka',
    icon: '/images/heroes/kunkka.png',
    colour: 'blue'
  },
  {
    name: 'Legion Commander',
    icon: '/images/heroes/legion_commander.png',
    colour: 'red, yellow'
  },
  {
    name: 'Leshrac',
    icon: '/images/heroes/leshrac.png',
    colour: 'blue'
  },
  {
    name: 'Lich',
    icon: '/images/heroes/lich.png',
    colour: 'white'
  },
  {
    name: 'Lifestealer',
    icon: '/images/heroes/lifestealer.png',
    colour: 'red, yellow'
  },
  {
    name: 'Lina',
    icon: '/images/heroes/lina.png',
    colour: 'red'
  },
  {
    name: 'Lion',
    icon: '/images/heroes/lion.png',
    colour: 'purple, red'
  },
  {
    name: 'Lone Druid',
    icon: '/images/heroes/lone_druid.png',
    colour: 'green, yellow'
  },
  {
    name: 'Luna',
    icon: '/images/heroes/luna.png',
    colour: 'blue'
  },
  {
    name: 'Lycan',
    icon: '/images/heroes/lycan.png',
    colour: 'red'
  },
  {
    name: 'Magnus',
    icon: '/images/heroes/magnus.png',
    colour: 'blue'
  },
  {
    name: 'Medusa',
    icon: '/images/heroes/medusa.png',
    colour: 'green'
  },
  {
    name: 'Meepo',
    icon: '/images/heroes/meepo.png',
    colour: 'blue'
  },
  {
    name: 'Mirana',
    icon: '/images/heroes/mirana.png',
    colour: 'blue'
  },
  {
    name: 'Monkey King',
    icon: '/images/heroes/monkey_king.png',
    colour: 'red, yellow'
  },
  {
    name: 'Morphling',
    icon: '/images/heroes/morphling.png',
    colour: 'blue'
  },
  {
    name: 'Naga Siren',
    icon: '/images/heroes/naga_siren.png',
    colour: 'blue, yellow'
  },
  {
    name: 'Nature\'s Prophet',
    icon: '/images/heroes/natures_prophet.png',
    colour: 'blue, green'
  },
  {
    name: 'Necrophos',
    icon: '/images/heroes/necrophos.png',
    colour: 'green'
  },
  {
    name: 'Night Stalker',
    icon: '/images/heroes/night_stalker.png',
    colour: 'blue'
  },
  {
    name: 'Nyx Assassin',
    icon: '/images/heroes/nyx_assassin.png',
    colour: 'red, yellow'
  },
  {
    name: 'Ogre Magi',
    icon: '/images/heroes/ogre_magi.png',
    colour: 'blue, red'
  },
  {
    name: 'Omniknight',
    icon: '/images/heroes/omniknight.png',
    colour: 'red, white'
  },
  {
    name: 'Oracle',
    icon: '/images/heroes/oracle.png',
    colour: 'blue, yellow'
  },
  {
    name: 'Outworld Devourer',
    icon: '/images/heroes/outworld_devourer.png',
    colour: 'green'
  },
  {
    name: 'Pangolier',
    icon: '/images/heroes/pangolier.png',
    colour: 'purple, yellow'
  },
  {
    name: 'Phantom Assassin',
    icon: '/images/heroes/phantom_assassin.png',
    colour: 'blue'
  },
  {
    name: 'Phantom Lancer',
    icon: '/images/heroes/phantom_lancer.png',
    colour: 'blue, yellow'
  },
  {
    name: 'Phoenix',
    icon: '/images/heroes/phoenix.png',
    colour: 'yellow'
  },
  {
    name: 'Puck',
    icon: '/images/heroes/puck.png',
    colour: 'blue, purple'
  },
  {
    name: 'Pudge',
    icon: '/images/heroes/pudge.png',
    colour: 'yellow'
  },
  {
    name: 'Pugna',
    icon: '/images/heroes/pugna.png',
    colour: 'green'
  },
  {
    name: 'Queen of Pain',
    icon: '/images/heroes/queen_of_pain.png',
    colour: 'blue, red'
  },
  {
    name: 'Razor',
    icon: '/images/heroes/razor.png',
    colour: 'blue'
  },
  {
    name: 'Riki',
    icon: '/images/heroes/riki.png',
    colour: 'blue, purple'
  },
  {
    name: 'Rubick',
    icon: '/images/heroes/rubick.png',
    colour: 'green'
  },
  {
    name: 'Sand King',
    icon: '/images/heroes/sand_king.png',
    colour: 'yellow'
  },
  {
    name: 'Shadow Demon',
    icon: '/images/heroes/shadow_demon.png',
    colour: 'red, purple'
  },
  {
    name: 'Shadow Fiend',
    icon: '/images/heroes/shadow_fiend.png',
    colour: 'red'
  },
  {
    name: 'Shadow Shaman',
    icon: '/images/heroes/shadow_shaman.png',
    colour: 'yellow'
  },
  {
    name: 'Silencer',
    icon: '/images/heroes/silencer.png',
    colour: 'purple, yellow'
  },
  {
    name: 'Skywrath Mage',
    icon: '/images/heroes/skywrath_mage.png',
    colour: 'yellow, white'
  },
  {
    name: 'Slardar',
    icon: '/images/heroes/slardar.png',
    colour: 'purple'
  },
  {
    name: 'Slark',
    icon: '/images/heroes/slark.png',
    colour: 'blue, yellow'
  },
  {
    name: 'Sniper',
    icon: '/images/heroes/sniper.png',
    colour: 'red, white'
  },
  {
    name: 'Spectre',
    icon: '/images/heroes/spectre.png',
    colour: 'purple'
  },
  {
    name: 'Spirit Breaker',
    icon: '/images/heroes/spirit_breaker.png',
    colour: 'blue'
  },
  {
    name: 'Storm Spirit',
    icon: '/images/heroes/storm_spirit.png',
    colour: 'blue'
  },
  {
    name: 'Sven',
    icon: '/images/heroes/sven.png',
    colour: 'blue, white'
  },
  {
    name: 'Techies',
    icon: '/images/heroes/techies.png',
    colour: 'yellow'
  },
  {
    name: 'Templar Assassin',
    icon: '/images/heroes/templar_assassin.png',
    colour: 'purple'
  },
  {
    name: 'Terrorblade',
    icon: '/images/heroes/terrorblade.png',
    colour: 'blue, purple'
  },
  {
    name: 'Tidehunter',
    icon: '/images/heroes/tidehunter.png',
    colour: 'green'
  },
  {
    name: 'Timbersaw',
    icon: '/images/heroes/timbersaw.png',
    colour: 'red, yellow'
  },
  {
    name: 'Tinker',
    icon: '/images/heroes/tinker.png',
    colour: 'purple, yellow'
  },
  {
    name: 'Tiny',
    icon: '/images/heroes/tiny.png',
    colour: 'white, green'
  },
  {
    name: 'Treant Protector',
    icon: '/images/heroes/treant_protector.png',
    colour: 'green'
  },
  {
    name: 'Troll Warlord',
    icon: '/images/heroes/troll_warlord.png',
    colour: 'red'
  },
  {
    name: 'Tusk',
    icon: '/images/heroes/tusk.png',
    colour: 'red, white'
  },
  {
    name: 'Underlord',
    icon: '/images/heroes/underlord.png',
    colour: 'green'
  },
  {
    name: 'Undying',
    icon: '/images/heroes/undying.png',
    colour: 'green'
  },
  {
    name: 'Ursa',
    icon: '/images/heroes/ursa.png',
    colour: 'blue'
  },
  {
    name: 'Vengeful Spirit',
    icon: '/images/heroes/vengeful_spirit.png',
    colour: 'blue'
  },
  {
    name: 'Venomancer',
    icon: '/images/heroes/venomancer.png',
    colour: 'green'
  },
  {
    name: 'Viper',
    icon: '/images/heroes/viper.png',
    colour: 'green'
  },
  {
    name: 'Visage',
    icon: '/images/heroes/visage.png',
    colour: 'blue'
  },
  {
    name: 'Warlock',
    icon: '/images/heroes/warlock.png',
    colour: 'red'
  },
  {
    name: 'Weaver',
    icon: '/images/heroes/weaver.png',
    colour: 'blue'
  },
  {
    name: 'Windranger',
    icon: '/images/heroes/windranger.png',
    colour: 'green'
  },
  {
    name: 'Winter Wyvern',
    icon: '/images/heroes/winter_wyvern.png',
    colour: 'blue, white'
  },
  {
    name: 'Witch Doctor',
    icon: '/images/heroes/witch_doctor.png',
    colour: 'purple'
  },
  {
    name: 'Wraith King',
    icon: '/images/heroes/wraith_king.png',
    colour: 'green'
  },
  {
    name: 'Zeus',
    icon: '/images/heroes/zeus.png',
    colour: 'blue, white'
  }


);
var bhtml = "";
var ghtml = "";
var phtml = "";
var rhtml = "";
var whtml = "";
var yhtml = "";

function addColourHero(html, hero){
    return html + '<div class="row "><div class="col-md-4"><img width="64" height="36" src="' + hero.icon + '"></div><div class="col-md-8">' + hero.name + '</div></div>'
}

heroes.forEach(function(hero){
  if(hero.colour.includes('blue')){
    bhtml = addColourHero(bhtml, hero);
  }
  if(hero.colour.includes('green')){
    ghtml = addColourHero(ghtml, hero);
  }
  if(hero.colour.includes('purple')){
    phtml = addColourHero(phtml, hero);
  }
  if(hero.colour.includes('red')){
    rhtml = addColourHero(rhtml, hero);
  }
  if(hero.colour.includes('white')){
    whtml = addColourHero(whtml, hero);
  }
  if(hero.colour.includes('yellow')){
    yhtml = addColourHero(yhtml, hero);
  }
});

$('#blue').html(bhtml);
$('#green').html(ghtml);
$('#purple').html(phtml);
$('#red').html(rhtml);
$('#white').html(whtml);
$('#yellow').html(yhtml);
