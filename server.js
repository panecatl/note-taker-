const fs = require('fs');
const path = require('path');
const express = require('express');
const { database } = require('./db/db');
const { Console } = require('console');

const PORT = process.env.PORT || 3001;
const app = express();


app.use(express.static('public'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'));
});
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'));
});

// get post function of server 
app.route('/api/notes')
    .get((req, res) => {
        res.json(database); 
    })

    .post((req, res) => {
        let jsonFilePath = path.join(__dirname, '/db/db.json');
        let newNote = req.body;

        let highestId = 99;
        // loop to find highest ID 
        for (let i = 0; i < database.length; i++) {
            let individualNote = database[i];

            if (individualNote.id > highestId) {
                highestId = individualNote.id;
            }
        }
        // assigns id to new notes
        newNote.id = highestId + 1;
        database.push(newNote)

        // write into the db json file 
        fs.writeFile(jsonFilePath, JSON.stringify(database), (er) => {
            if (err) {
                return alert(err);
            }
            alert('Your note was saved!')
        });
        res.json(newNote);
    });

    app.delete('/api/notes/:id', (req, res) => {
        let jsonFilePath = path.join(__dirname, 'db/db.json');
        for (let i=0; i < database.length; i++) {
            if (database[i].id === req.params.id) {
                database.splice(i, 1);
                break
            }
        }
        // editing the json file
        fs.writeFile(jsonFilePath, JSON.stringify(database), (err) => {
            if (err) {
                alert(err);
            } else {
                alert('Your note was deleted!')
            }
        });
        res.json(database);
    });

    app.listen(PORT, () => {
        console.log('App listening on PORT' + PORT);
    });