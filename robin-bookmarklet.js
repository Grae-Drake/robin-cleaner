
// Merge triggers a page reload, so you need to run the mute script again.
// Reloads clear JS variables, so we're using localStorage to store persistent
// lists of muted users and messages.

var getMuted = function(mutedKey) {
	// Grab set of muted things from localStorage for easy reading.

	return new SET(JSON.parse(localStorage.getItem(mutedKey)) || []);
};

var setMuted = function(mutedKey, mutedList) {
	// Sets the list of things to mute to localStorage. Persists through reloads.
	
	localStorage.setItem(mutedKey, JSON.stringify(mutedList));
};

// variables with our muted users and messages for ease of access.
var mutedUsers = getMuted("mutedUsers");
var mutedMessages = getMuted("mutedMessages");

var mute = function(text, mutedList, mutedKey) {
	// Adds a new username to the list of muted users.

	mutedList.add(text);
	setMuted(mutedList, mutedKey);
};

var muteUser = function(text) {
	mute(text, mutedUsers, "mutedUsers");
};

var muteMessage = function(text) {
	mute(text, mutedMessages, "mutedMessages");
};

var clearMuted = function(mutelist) {
	localStorage.setItem(mutelist, JSON.stringify([]));
};

var clearMutedUser = function() {
	clearMuted("mutedUsers");
	mutedUsers = [];
};

var clearMutedUser = function() {
	clearMuted("mutedMessages");
	mutedMessages = [];
};

// Observer stuff to listen for relevant events.

// Select the main list element.
var messageList = document.querySelector('#robinChatMessageList');
// Configureation for the observer.
var config = {attributes: true, childList: true, characterData: true};
 
// Create an observer instance.
var observer = new MutationObserver(function(mutations) {
	mutations.forEach(function(mutation) {
		var $newNode = $(mutation.addedNodes[0]);
		var authorName = $newNode.children('.robin-message--from.robin--username').text();
		var message = $newNode.children('.robin-message--message').text();

		// Listen for /muteUser and /muteMessage commands
		if (authorName === "[robin]") {
			console.log("[robin] said something!");

			if (message.indexOf("/muteUser") > -1) {
				userToMute = $("input[name='message']").val().slice(10);
				console.log("you're muting", userToMute);
				muteUser(userToMute);
			}

			// TODO: Listen for /muteMessage command
    }

    // Remove messages from muted users.
    if (mutedUsers.has(authorName)) {
		console.log(authorName, "blocked!");
		$newNode.remove();
	}

    // TODO: Remove messages with muted words.

  });
});
 
// Start observing, passing in the target node and the config options.
observer.observe(messageList, config);