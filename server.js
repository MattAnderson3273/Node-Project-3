const http = require('http'); 
const port = 5000; 

const server = http.createServer((req, res) => {
    res.end('Hello World'); 
}); 

server.listen(port, () => console.log(`Server listening on port ${port}`)); 