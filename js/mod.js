let modInfo = {
	name: "The Tree of Void: Rewritten",
	author: "violet",
	pointsName: "points",
	modFiles: ["layers.js", "tree.js"],

	discordName: "",
	discordLink: "",
	initialStartPoints: new Decimal (10), // Used for hard resets and new players
	offlineLimit: 168,  // In hours
}

// Set your version in num and name
let VERSION = {
	num: "1.0",
	name: "The Release :D",
}

let changelog = `<h1>Changelog:</h1><br>
	<h3>v1.0</h3><br>
		- Added everything up until Row 3.<br>
		- idk tbh.`

let winText = `:toot: now wait until the dev isnt lazy or procrastinating her homework and updates the tree`

// If you add new functions anywhere inside of a layer, and those functions have an effect when called, add them here.
// (The ones here are examples, all official functions are already taken care of)
var doNotCallTheseFunctionsEveryTick = ["blowUpEverything"]

function getStartPoints(){
    return new Decimal(modInfo.initialStartPoints)
}

// Determines if it should show points/sec
function canGenPoints(){
	return true
}

// Calculate points/sec!
function getPointGen() {
	if(!canGenPoints())
		return new Decimal(0)

	let gain = new Decimal(1)
	if (!player.sl.unlocked) gain = gain.mul(0)
	if (hasUpgrade('sl', 11)) gain = gain.mul(upgradeEffect('sl',11))
	hasUpgrade('sl',12)?gain=gain.mul(hasUpgrade('sl',15)?"1e50":10):gain
	gain=gain.mul(buyableEffect('sl',11).x)	
	hasMilestone('ef',1)?gain=gain.mul(layers.ef.effect().x):gain
	hasUpgrade('ef',11)?gain=gain.pow(1.05):gain
	hasUpgrade('ef',14)?gain=gain.mul(10):gain
	hasUpgrade('ef',13)&&!hasMilestone('ef',3)?gain=gain.div(10):gain
	hasUpgrade('ef',15)?gain=gain.pow(hasUpgrade('sl',15)?1.75:1.45):gain
	gain=gain.mul(layers.hs.effect())
	hasUpgrade('hs',13)?gain=gain.mul(upgradeEffect('hs',13)):gain
	hasUpgrade('hs',23)?gain=gain.mul(upgradeEffect('hs',23)):gain
	gain=gain.mul(tmp.ew.effect.p)
	hasUpgrade('ew',13)?gain=gain.mul(upgradeEffect('ew',13)):gain
	hasUpgrade('e',21)?gain=gain.mul(upgradeEffect('e',21)):gain
	hasUpgrade('sl',13)?gain=gain.mul(upgradeEffect('sl',13)):gain
	return gain
}

// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() { return {
}}

// Display extra things at the top of the page
var displayThings = [
	"Current Endgame: &quot;1.00e2100 points&quot;"
]

// Determines when the game "ends"
function isEndgame() {
	return player.points.gte(new Decimal("e2100"))
}



// Less important things beyond this point!

// Style for the background, can be a function
var backgroundStyle = {

}

// You can change this if you have things that can be messed up by long tick lengths
function maxTickLength() {
	return(3600) // Default is 1 hour which is just arbitrarily large
}

// Use this if you need to undo inflation from an older version. If the version is older than the version that fixed the issue,
// you can cap their current resources with this.
function fixOldSave(oldVersion){
}