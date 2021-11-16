const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");

// @route   GET /notes
// @desc    Get notes from text files
// @access  Public
router.get("/:username", (req, res) => {
	const username = req.params.username;
	if (username) {
		try {
			fs.readFile(
				path.join(__dirname, "/usernames", `${username}.txt`),
				"utf8",
				(error, data) => {
					if (error) {
						res.status(404).send({ msg: `No notes for ${username} found.` });
						return;
					}

					const notesData = data.split("\n");
					//notesData.pop();
					console.log(notesData);
					res.send(notesData);
				}
			);
		} catch (err) {
			res.status(500).send("Server Error");
			console.error(err.message);
		}
	} else {
		res.status(404).send({ msg: "Please provide a username" });
	}
});

// @route   POST /notes
// @desc    Show note and its contents
// @access  Public
router.post("/", (req, res) => {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Credentials", true);
	const { username, note } = req.body;
	if (username && note) {
		try {
			fs.appendFile(
				path.join(__dirname, "/usernames", `${username}.txt`),
				`${note}\n`,
				(error) => {
					if (error) throw error;
					res.status(200).send({ msg: `${username}.txt has been written to!` });
				}
			);
		} catch (err) {
			res.status(500).send("Server Error");
			console.error(err.message);
		}
	} else {
		res.status(404).send({ msg: "Please provide a username and a note" });
	}
});

// @route   PATCH /notes
// @desc    Get notes from text files, replace note that needs to be edited
// @access  Public
// IMPORTANT: Not sure if we will end up using patch
router.patch("/:username", (req, res) => {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Credentials", true);
	const { username, oldNote, newNote } = req.body;
	let newFileContent;

	if (username && oldNote && newNote) {
		try {
			fs.readFile(
				path.join(__dirname, "/usernames", `${username}.txt`),
				"utf8",
				(error, data) => {
					if (error) {
						res.status(404).send({ msg: `No notes for ${username} found.` });
						return;
					}

					if (data.includes(oldNote)) {
						newFileContent = data.replace(oldNote, newNote);
						res.send(newFileContent);
						writeToFile(newFileContent);
					} else {
						res.status(404).send({ msg: `The text ${oldNote} isn't a note` });
						return;
					}
				}
			);

			// Function call used to make sure async problems don't occur
			function writeToFile(content) {
				console.log(content);
				fs.writeFile(
					path.join(__dirname, "/usernames", `${username}.txt`),
					`${content}`,
					(error) => {
						if (error) throw error;
					}
				);
			}
		} catch (err) {
			res.status(500).send("Server Error");
			console.error(err.message);
		}
	} else {
		res.status(404).send({ msg: "Please provide a username" });
	}
});

// @route   DELETE /notes
// @desc    Delete a note from the file
// @access  Public
router.delete("/", (req, res) => {
	res.status(200).send("Hello World!");
});

module.exports = router;
