// Create ExpressServer

const express = require("express");
// Call express function, we create an application to set up our entire server
const app = express();

// Set View Engine to be "EJS" (see example 5)
// Now your views/index.html has to be renamed to views/index.ejs - remember to install EJS syntax highlight on vscode marketplace
app.set("view engine", "ejs");

// Set up different routes
// app.get - get route
// app.post - post request route
// ...

// Most of the time, you're either sending some JSON to the user, or rendering some files to the user

// Example 1: Creating a route of '/get-helloworld' and send user a 'Hello World' on webpage
// first param: path, second param: function
// the function takes in 3 param: request, respond, and next (99% of the time we won't use 'next', so we are ignoring it here.)
app.get("/get-helloworld", (req, res) => {
	// Run some code everytime someone tries to access this URL.
	// This will log to your vsCode, not show to the user.
	console.log("You went to / directory, which is the root path.");

	// Send data back to the user - this will show on webpage when you navigate to localhost:3000
	res.send("Hello World");
});

// Example 2a: Creating route to send server status to user (we return error code 500 as an example)
app.get("/get-status", (req, res) => {
	// Usually you won't use 'res.send' except for testing, because it is too generic
	// Here, we try to send server status back to user
	// Standard HTTP Status Code, i.e. 500 refers to 'Internal Server Error' (the console will also show 'Failed to load resources: the server... responded with a status of 500 (Internal Server Error))
	res.sendStatus(500);
});

// Example 2b: Same as Example 2, except we can chain message to the status, i.e. console show error msg, user webpage see something else
app.get("/get-status-chained", (req, res) => {
	// You can also chain along status message along with normal text message
	res.sendStatus(500).send("There is an error here!");

	// You can even chain on JSON, res.json can also be used to send JSON data
	// res.sendStatus(500).json({message: 'Error'});
});

// Example 3: Create route for user to download files
app.get("/get-file", (req, res) => {
	// Send file to user - the moment the user navigate to this URL, the download box will popup.
	res.download("server.js");
});

// Example 4a: Create route to render HTML file for user
app.get("/render-basic-html-file", (req, res) => {
	// To render the file, we need to tell Express where the files to render are. By default, they reside in the 'views' folder (so we need to create that folder)
	res.render("index");
	// By default, however, you'll get an error: "Error: No default engine was specified and no extension was provided."

	// The reason is because we need to set up a view engine - we can use server codes to generate the views code
	// Some view engines we can use include EJS and Pug (ejs is most similar to HTML)
	// Need to "npm i ejs", then specify usage of this view engine at the top of this file, then rename index.html to index.ejs, and this will work already.
});

// Example 4b: Create route to render HTML file for user (passing info from server code down to view)
app.get("/render-html-file-with-server-input", (req, res) => {
	// Refer to example 4b to get context
	// Pass some value to the view we are rendering, here, we pass a string value
	// In
	res.render("index", { text: "I come from Server.JS" });
});

// Run the server, i.e. make your app listen at port 3000
// If you run this now, your localhost:3000 will have an output
app.listen(3000);
