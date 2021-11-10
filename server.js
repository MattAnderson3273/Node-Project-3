const fs = require('fs');
const usernameFolder = 'usernames';

fs.readdirSync(usernameFolder).forEach(file => {
  console.log(file);
});


// All the node stuff happen in the server
//  Need to establish a connection between client & server (Fetch requests)

// Need to make it so it understands these requests
// Add
// Edit
// Delete

// After receiving a username from the client, 
// the server should check to see if a textfile has the same name and read from it.
// If not, just create a new file and begin writing to it (If its a "View Note" request, show nothing due to the filtering)


// try {
//   const data = fs.readFileSync('', 'utf8')
//   console.log(data)
// } catch (err) {
//   console.error(err)
// }

const http = require('http'); 
const port = 5000; 

const server = http.createServer((req, res) => {

    res.end('Cyanara Earth'); 
}); 

server.listen(port, () => console.log(`Server listening on port ${port}`));

// Receive data from client.js
server.addListener()