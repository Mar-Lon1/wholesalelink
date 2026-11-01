require('dotenv').config();
const app = require('./app');

const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`[WholesaleLink] Server running on port ${PORT} (${process.env.NODE_ENV || 'development'})`);
});
