const express = require("express");

// Remember, this is a mini application, a router, that is independent from the main app
// A router is exactly the same as the app you have in server.js - just that this is a mini subset of the main app.
const router = express.Router();

// Instead of writing /users or /users/new", we just put / and /new. This is because we will prepend "/users" to all routes, as defined in server.js
router.get("/", (req, res) => {
	res.send("User List");
	// If you want to get query params, i.e. if I go to localhost:3000/users?name=Kyle
	// You can access the param like name, etc. like this
	console.log(req.query.name);
});

router.get("/new", (req, res) => {
	res.send("User New Form");
});

// Example to parse JSON form
router.get("/example_form", (req, res) => {
	// This will render /views/users/newForm.ejs
	res.render("users/newForm");
});

router.post("/", (req, res) => {
	// This req.body.firstName value will be passed from /views/users/newForm.ejs when the user submits and send a POST request to this endpoint (because of what we defined in the HTML form)
	// logs whatever the user enter in the input field
	// you may get an error here because you can't access the req.body directly. You need to go into server.js and specify that you're allowing this usage
	// see the app.use(express.urlencoded({ extended: true })); code

	console.log(req.body.firstName);
	// A real-life example of a system with validation
	const isValid = true;
	if (isValid) {
		// If value, we will append to the users array
		users.push({ firstName: req.body.firstName });
		// Then redirect the user to its page based on their ID; im not sure why he use -1 also lol
		// I thought
		// P.S. res.redirect just change the url to redirect the user
		res.redirect(`/users/${users.length - 1}`);
	} else {
		// The else block runs when there is an error, i.e. not valid
		console.log("Error");
		// We render back the firstName field because otherwise the form will just refresh with blank fields
		// but in reality a good user experience won't empty out user input; it will repopulate the errorenous input so user can correct it to resubmit
		res.render("users/new", { firstName: req.body.firstName });
	}
});

// Dynamic Route, i.e. to get a specific user based on id someone send to us
// Every string after /users/ will be defined as 'id' variable
// ***IMPT, the order of your routes MATTER! If you move this particular code block UP above the /new route, then everytime someone goes to /users/new, your 'id' variable will have the value of 'new'
// The best practice is simply put static route ABOVE dynamic routes
router.get("/:id", (req, res) => {
	// Extract the id variable
	let userId = req.params.id;
	res.send("Get User ID: " + userId);
	// If you go to localhost:3000/users/4, you get output of "User ID: 4"
	// If you go localhost:3000/users/100, you get id of 100, etc.
});

// Normally, it is very common to have a 'router.get' (to get user data), 'router.post' (to update user data), and 'router.delete' (to delete user data) - i.e. we will have many similar routes, just different type of requests.
// There is a cleaner way to represent these routes since it'll just be multiple repeats of router.get("/:id"), router.post("/:id") ... (the "/:id" part keeps repeating)
// We can chain these commands in a clean way as follow
router
	.route("/:id")
	.get((req, res) => {
		// nothing special here, just template string, the ${var_name} is just to access variable inside a string
		res.send(`Get User ID: ${req.params.id}`);
	})
	.put((req, res) => {
		// Can easily edit the code here to do what put request is supposed to do.
		res.send(`Post/Update User ID: ${req.params.id}`);
	})
	.delete((req, res) => {
		res.send(`Delete User ID: ${req.params.id}`);
	});

// Router.param function
// Whenever you find a param with name of id, run this function
// The next param is
// The id argument simply represent the data we're receiving back, i.e. the id value
router.param("id", (req, res, next, id) => {
	// This will be logged when we go to i.e. http://localhost:3000/users/4
	console.log("hello");
	// You may notice the webpage is loading forever even after it console.logged the 'hello'.
	// The reason is that it is waiting for you to run the 'next' command which is a middleware command; it stands for the next thing in line
	// Middleware is the stuff that runs between the request being sent to your server and the actual response being returned to the user.
	// i.e. the flow is request sent --> middleware --> response reply to user
	// So the chained routes above of .get, .put, .delete will only run after this middleware code here finishes execution and you run the next command
	next();

	// What is the practical usecase of this middleware though? Answer: you can totally use this section to get your user.
	// Everytime someone calls the user endpoint, i.e. to update data or delete data, you can use this specific section to grab the user based on its ID
	// Practically speaking, perhaps you'll extract the user object here; then
});

const users = [{ name: "Kyle" }, { name: "Sally" }];
router.param("id", (req, res, next, id) => {
	// the req.user is just a variable name; it can be anything, like req.test also
	// this line is basically to simulate "getting" user
	// now that req.user has a specific user, you can directly manipulate this user inside the router.route commands above
	// i.e. in router.route("/:id").get((req,res)=> {
	// you get the user by running req.user, then do whatever you want
	// })
	req.user = users[id];
	next();

	// What's the bottom line? Well, in middleware, you can basically do whatever to pass value into the request object (req.<something>), then every other routes can utilize this object to do something. The benefit is cleaner code basically.

	// sidenote; my personal opinion is that it's cool but honestly it makes the code so much more confusing... it's 100% better if it's less complicated imo...
});

// Need to export this 'users' router before you can use it in the main application server.js
module.exports = router;
