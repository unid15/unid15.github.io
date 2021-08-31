let cookieNumber = 0;
let notificationField = document.querySelector('#notification');

const BC_COOKIE_AMOUNT = 'cookieAmount';

let loaded = parseInt(getBrowserCookie(BC_COOKIE_AMOUNT));
cookieNumber = Number.isFinite(loaded) ? loaded : 0;
updateCookieTracker();

function notify(message) {
	notificationField.innerHTML = `<p>${message}</p>`;
}

function updateCookieTracker() {
	notify(`You now have: ${cookieNumber} cookie${cookieNumber==1 ? '' : 's'}`);
}

function cookieButton() {
	cookieNumber++;
	saveBrowserCookie(BC_COOKIE_AMOUNT, cookieNumber);
	updateCookieTracker();
}

function saveBrowserCookie(cookieName, cookieValue) {
	const date = new Date();
	const EXPIRATION_DAYS = 10000;
	date.setTime(date.getTime() + (EXPIRATION_DAYS*1000*60*60*24));
	document.cookie = `${cookieName}=${cookieValue};SameSite=Strict;expires=${date.toUTCString()};path=/`;
}

function getBrowserCookie(cookieName) {
	let name = cookieName + "=";
	let decodedBrowserCookie = decodeURIComponent(document.cookie);
	let browserCookieArray = decodedBrowserCookie.split(';');
	console.log(browserCookieArray);
	
	const cookie = browserCookieArray.find(value => {
		return value.split('=')[0].trim() === cookieName;
	});
	
	console.log(`Found ${cookie}`);
	return cookie.split('=')[1];
}