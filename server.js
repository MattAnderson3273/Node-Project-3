const express = require('express'); 
const cors = require('cors'); 

const app = express();
const PORT = process.env.PORT || 5000; 

// JSON Body Parser
app.use(express.json()); 

app.use(cors()); 

// Notes Route
app.use('/notes', require('./notes')); 

app.listen(PORT, () => {
  console.log(`App listening at http://localhost:${PORT}`); 
});
