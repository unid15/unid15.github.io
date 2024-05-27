function randomInteger(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

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
	constructor(name, directory, skills, traits) {
		this.name = name;
		this.directory = directory;
		this.skills = skills;
		this.traits = traits;
		this.traits.forEach( (trait) => trait.game = this );
		this.skills.forEach( (skill) => skill.game = this );
	}
}

class PlayerAttribute {
	constructor(name, imageURL) {
		this.name = name;
		this.imageURL = imageURL;
	}
	
	getImage() {
		let img = document.createElement("img");
		img.style = "max-height: 100px;"
		img.src = this.getImageURL();
		return img;
	}
	
	getDOM() {
		let div = document.createElement("div");
		div.classList.add("row", "d-flex");
		let col1 = document.createElement("div");
		col1.classList.add("col-auto");
		let col2 = document.createElement("div");
		col2.classList.add("col");
		div.appendChild(col1);
		div.appendChild(col2);
		
		col1.appendChild(this.getImage());
		let name = document.createElement("span");
		name.innerText = this.name;
		col2.appendChild(name);
		return div;
	}
}

class Skill extends PlayerAttribute {
	getImageURL() {
		return "images/"+this.game.directory+"/skills/"+this.imageURL;
	}
}

class Trait extends PlayerAttribute {
	getImageURL() {
		return "images/"+this.game.directory+"/traits/"+this.imageURL;
	}
}

let newVegas = new Game("Fallout New Vegas", "nv",
	[
		new Skill("Barter", "Barter.webp"),
		new Skill("Energy Weapons", "EnergyWeapons.webp"),
		new Skill("Explosives", "Explosives.webp"),
		new Skill("Guns", "Guns.webp"),
		new Skill("Lockpick", "Lockpick.webp"),
		new Skill("Medicine", "Medicine.webp"),
		new Skill("Melee Weapons", "MeleeWeapons.webp"),
		new Skill("Repair", "Repair.webp"),
		new Skill("Science", "Science.webp"),
		new Skill("Sneak", "Sneak.webp"),
		new Skill("Speech", "Speech.webp"),
		new Skill("Survival", "Survival.webp"),
		new Skill("Unarmed", "Unarmed.webp"),
	],
	[
		new Trait("Built to Destroy", "BuiltToDestroy.webp"),
		new Trait("Fast Shot", "FastShot.webp"),
		new Trait("Four Eyes", "FourEyes.webp"),
		new Trait("Good Natured", "GoodNatured.webp"),
		new Trait("Heavy Handed", "HeavyHanded.webp"),
		new Trait("Kamikaze", "Kamikaze.webp"),
		new Trait("Loose Cannon", "LooseCannon.webp"),
		new Trait("Small Frame", "SmallFrame.webp"),
		new Trait("Trigger Discripline", "TriggerDiscipline.webp"),
		new Trait("Wild Wasteland", "WildWasteland.webp"),
		new Trait("Claustrophobia", "Claustrophobia.webp"),
		new Trait("Early Bird", "EarlyBird.webp"),
		new Trait("Logan's Loophole", "LogansLoophole.webp"),
		new Trait("Hoarder", "Hoarder.webp"),
		new Trait("Hot Blooded", "HotBlooded.webp"),
		new Trait("Skilled", "Skilled.webp")
	]
)

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
			(trait) => Interface.appendElementToList(trait.getDOM(), Interface.getTraitList())
		)
		//Interface.setValue("Picked " + this.traits.length + " traits", "#trait_amount");
		
		this.skills.forEach(
			(skill) => Interface.appendElementToList(skill.getDOM(), Interface.getSkillList())
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
		
	}
	
	generateTagSkills() {
		let acceptableSkills = this.game.skills;
		let tagAmount = 3;
		console.log(acceptableSkills);
		this.skills = acceptableSkills.pickAmount(tagAmount);
	}
}

document.addEventListener("DOMContentLoaded", generateCharacter);

function generateCharacter() {
	Interface.resetLists();
	let a = new CharacterSheet(newVegas);
	a.randomize();
}
