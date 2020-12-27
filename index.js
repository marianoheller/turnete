require("dotenv").config();
const app = require("./api");

const port = app.get("port");

app.listen(port, () => {
  console.log(`Listening to port ${port}`);
});
