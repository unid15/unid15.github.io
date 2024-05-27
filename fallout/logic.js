function randomInteger(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

const GAME_FALLOUT = 1 << 0;
const GAME_FALLOUT_2 = 1 << 1;
const GAME_FALLOUT_TACTICS = 1 << 2;
const GAME_FALLOUT_NEW_VEGAS = 1 << 3;
const GAME_ALL = GAME_FALLOUT | GAME_FALLOUT_2 | GAME_FALLOUT_NEW_VEGAS | GAME_FALLOUT_TACTICS;

Array.prototype.pick = function() {
	return this[Math.floor((Math.random()*this.length))];
}

Array.prototype.pickAmount = function(i) {
	let result = [];
	let set = this.slice(0);
	while(i > 0) {
		let addedEl = set.pick();
		set = set.filter( (a) => a !== addedEl );
		result.push(addedEl);
		i--;
	}
	return result;
}

class SkillSet {
	constructor() {
		this.skills = arguments.slice(0);
	}
}

class TraitSet {
	constructor() {
		this.traits = arguments.slice(0).map(
			(traitName) => Trait.list.filter( trait => trait.name === traitName )[0]
		);
	}
}

class Game {
	constructor(name, skills, traits) {
		this.name = name;
		this.skills = skills;
		this.traits = traits;
	}
}

let newVegas = new Game("Fallout New Vegas",
	[
		"Barter", "Energy Weapons", "Explosives", "Guns", "Lockpick", "Medicine",
		"Melee Weapons", "Repair", "Science", "Sneak", "Speech", "Survival", "Unarmed"
	],
	[
		"Built to Destroy", "Fast Shot", "Four Eyes", "Good Natured",
		"Heavy Handed", "Kamikaze", "Loose Cannon", "Small Frame",
		"Trigger Discripline", "Wild Wasteland", "Claustrophobia",
		"Early Bird", "Logan's Loophole", "Hoarder", "Hot Blooded",
		"Skilled"
	]
)

class Trait {
	static list = [];
	
	static getTraitsForGame(game) {
		return Trait.list.filter( trait => trait.games & game );
	}
	
	constructor(name, games) {
		this.name = name;
		this.games = games;
		Trait.list.push(this);
	}
}

new Trait("Bloody Mess", GAME_FALLOUT | GAME_FALLOUT_2 | GAME_FALLOUT_TACTICS);
new Trait("Bruiser", GAME_FALLOUT | GAME_FALLOUT_2 | GAME_FALLOUT_TACTICS);
new Trait("Built to Destroy", GAME_FALLOUT_NEW_VEGAS);
new Trait("Chem Reliant", GAME_FALLOUT | GAME_FALLOUT_2 | GAME_FALLOUT_TACTICS);
new Trait("Chem Resistant / Clean Living", GAME_FALLOUT | GAME_FALLOUT_2 | GAME_FALLOUT_TACTICS);
new Trait("Educated", null);
new Trait("Fast / Increased Metabolism", GAME_FALLOUT | GAME_FALLOUT_2 | GAME_FALLOUT_TACTICS);
new Trait("Fast Shot", GAME_ALL);
new Trait("Finesse", GAME_FALLOUT | GAME_FALLOUT_2 | GAME_FALLOUT_TACTICS);
new Trait("Four Eyes", GAME_FALLOUT_NEW_VEGAS);
new Trait("Gifted", GAME_FALLOUT | GAME_FALLOUT_2 | GAME_FALLOUT_TACTICS);
new Trait("Good Natured", GAME_ALL);
new Trait("Heavy Handed", GAME_ALL);
new Trait("Jinxed", GAME_FALLOUT | GAME_FALLOUT_2 | GAME_FALLOUT_TACTICS);
new Trait("Kamikaze", GAME_ALL);
new Trait("Loose Cannon", GAME_FALLOUT_NEW_VEGAS);
new Trait("Night Person", GAME_FALLOUT | GAME_FALLOUT_TACTICS);
new Trait("One Hander", GAME_FALLOUT | GAME_FALLOUT_2 | GAME_FALLOUT_TACTICS);
new Trait("Sex Appeal", GAME_FALLOUT_2);
new Trait("Skilled", GAME_FALLOUT | GAME_FALLOUT_2 | GAME_FALLOUT_TACTICS);
new Trait("Small Frame", GAME_ALL);
new Trait("Trigger Discipline", GAME_FALLOUT_NEW_VEGAS);
new Trait("Wild Wasteland", GAME_FALLOUT_NEW_VEGAS);
new Trait("Claustrophobia", GAME_FALLOUT_NEW_VEGAS);
new Trait("Early Bird", GAME_FALLOUT_NEW_VEGAS);
new Trait("Hoarder", GAME_FALLOUT_NEW_VEGAS);
new Trait("Hot Blooded", GAME_FALLOUT_NEW_VEGAS);
new Trait("Logan's Loophole", GAME_FALLOUT_NEW_VEGAS);
new Trait("Skilled", GAME_FALLOUT_NEW_VEGAS);

class CharacterSheet {
	static getAttributeList() {
		return ["strength", "perception", "endurance", "charisma", "intelligence", "agility", "luck"];
	}
	
	constructor(game) {
		this.game = game;
		this.total = 7*4 + 5;
		this.attributes = CharacterSheet.getAttributeList().reduce(
			(dictionary, attribute) => {dictionary[attribute]=1; return dictionary},
			{}
		);
		this.traits = [];
		this.taggedSkills = [];
	}
	
	randomize() {
		this.generateAttributes();
		this.generateTraits();
		this.generateTagSkills();
		
		for ( const [attribute, value] of Object.entries(this.attributes) ) {
			Interface.setValueOfAttribute(value, "attr_"+attribute);
		}
		
		this.traits.forEach(
			(traitText) => Interface.appendElementToList(traitText, Interface.getTraitList())
		)
		Interface.setValue("Picked " + this.traits.length + " traits", "#trait_amount");
		
		this.skills.forEach(
			(skillText) => Interface.appendElementToList(skillText, Interface.getSkillList())
		)
	}
	
	generateAttributes() {
		while(this.total > 0) {
			let randomAttribute = CharacterSheet.getAttributeList().pick();
			if( this.attributes[randomAttribute] >= 10 ) continue;
			this.total--;
			this.attributes[randomAttribute]++;
		}
	}
	
	generateTraits() {
		let acceptableTraits = this.game.traits;
		let traitAmount = randomInteger(0, 2);
		this.traits = acceptableTraits.pickAmount(traitAmount);
		console.log(this.traits);
		
	}
	
	generateTagSkills() {
		let acceptableSkills = this.game.skills;
		let tagAmount = 3;
		this.skills = acceptableSkills.pickAmount(tagAmount);
		console.log(this.skills);
	}
}

document.addEventListener("DOMContentLoaded", function(event){
	let a = new CharacterSheet(newVegas);
	a.randomize();
	console.log(a.attributes);
});
