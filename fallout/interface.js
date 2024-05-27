class Interface {
	static getTraitList() { return document.querySelector("#trait_list"); }
	static getSkillList() { return document.querySelector("#skill_list"); }
	
	static appendTextToList(elementText, list) {
		let newEl = document.createElement("li");
		newEl.innerText = elementText;
		list.appendChild(newEl);
	}
	
	static appendElementToList(element, list) {
		let newEl = document.createElement("li");
		newEl.appendChild(element);
		list.appendChild(newEl);
	}
	
	static setValueOfAttribute(value, elementId) {
		let x = "#"+elementId + " .val";
		Interface.setValue(value, x);
	}
	
	static setValue(value, selector) {
		document.querySelector(selector).innerText = value;
	}
	
	static resetLists() {
		Interface.getTraitList().innerHTML = "";
		Interface.getSkillList().innerHTML = "";
	}
}
