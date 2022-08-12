function switchRu() {
	setLanguage("ru");
}

function switchCz() {
	setLanguage("cz");
}

function switchEn() {
	setLanguage("en");
}

function setLanguage(language) {
	console.log(language);
	var elements = document.getElementsByTagName('p');
	for( var i = 0 ; i < elements.length ; i++ ) {
		if( elements[i].lang == language ) {
			elements[i].style.display = 'block';
		} else {
			elements[i].style.display = 'none';
		}
	}
}