/**
 * Contains all of the requests for http://localhost:5000/notes. Includes a GET, POST, PATCH and DELETE request. Each request performs 
 * reading and writing to the specified file and updates it as necessary.   
 */

const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

// @route   GET /notes/:username
// @desc    Get notes from text files
// @access  Public
router.get('/:username', (req, res) => {
    const username = req.params.username;
    if (username) {
        try {
            fs.readFile(
                path.join(__dirname, '/usernames', `${username}.txt`),
                'utf8',
                (error, data) => {
                    if (error) {
                        res.status(404).send({ msg: `No notes for ${username} found.` });
                        return;
                    }

                    const notesData = data.split('\n');
                    notesData.pop();
                    console.log(notesData);
                    res.send(notesData);
                }
            );
        } catch (err) {
            res.status(500).send('Server Error');
            console.error(err.message);
        }
    } else {
        res.status(404).send({ msg: 'Please provide a username' });
    }
});

// @route   POST /notes
// @desc    Show note and its contents
// @access  Public
router.post('/', (req, res) => {
    const { username, note } = req.body;
    if (username && note) {
        try {
            fs.appendFile(
                path.join(__dirname, '/usernames', `${username}.txt`),
                `${note}\n`,
                (error) => {
                    if (error) throw error;
                    res.status(200).send({ msg: 'Message submitted.' });
                }
            );
        } catch (err) {
            res.status(500).send('Server Error');
            console.error(err.message);
        }
    } else {
        res.status(404).send({ msg: 'Please provide a username/note' });
    }
});

// @route   PATCH /notes/:username
// @desc    Get notes from text files, replace note that needs to be edited
// @access  Public
router.patch('/:username', (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Credentials', true);
    const { username, oldNote, newNote } = req.body;
    let newFileContent = '';

    if (username && oldNote && newNote) {
        try {
            fs.readFile(
                path.join(__dirname, '/usernames', `${username}.txt`),
                'utf8',
                (error, data) => {
                    if (error) {
                        res.status(404).send({ msg: `No notes for ${username} found.` });
                        return;
                    }

                    if (data.includes(oldNote)) {
                        newFileContent = data.replace(oldNote, newNote);
                        res.send(newFileContent);
                        writeToFile(newFileContent, username);
                    } else {
                        res.status(404).send({ msg: `The text ${oldNote} isn't a note` });
                        return;
                    }
                }
            );

        } catch (err) {
            res.status(500).send('Server Error');
            console.error(err.message);
        }
    } else {
        res.status(404).send({ msg: 'Please provide a username' });
    }
});

// @route   DELETE /notes/:username
// @desc    Delete a note from the file
// @access  Public
router.delete('/:username', (req, res) => {
    const username = req.params.username; 
    const notesFromDOM = req.body.notes; 
    let newFileContent = ''; 
    
    if (username && notesFromDOM) {
        try {
            fs.readFile(
                path.join(__dirname, '/usernames', `${username}.txt`),
                'utf8',
                (error, data) => { 

                    if (error) {
                        res.status(404).send({ msg: `No notes for ${username} found.` });
                        return;
                    }
                    const notesData = data.split('\n');
                    notesData.pop();

                    newFileContent = notesData.filter(note => {
                        let equal = false;
                        for (let i = 0; i < notesFromDOM.length; i++) {
                            if(note === notesFromDOM.at(i)) {
                                equal = true;
                            }
                        }

                        if(!equal) return note; 
                    });
                    res.send(newFileContent); 
                    writeArrayToFile(newFileContent, username);
                }
            );
        } catch (err) {
            res.status(500).send('Server Error');
            console.error(err.message);
        }
    }
    else {
        res.status(404).send({ msg: 'Please provide a username and/or notes to delete' });
    }
});

// used to write a whole array to the text file
function writeArrayToFile(array, username) {
    const file = fs.createWriteStream(path.join(__dirname, '/usernames', `${username}.txt`)); 
    file.on('error', err => {
        console.error(err.message); 
    });
    array.forEach(function(element) {
        file.write(element + '\n'); 
    });
    file.end(); 
}

// used to write a string to the text file
function writeToFile(content, username) {
    fs.writeFile(
        path.join(__dirname, '/usernames', `${username}.txt`),
        `${content}`,
        (error) => {
            if (error) throw error;
        }
    );
}

module.exports = router;
