const app = require("./app");
const { connectDatabase } = require("./utils/database");

connectDatabase();

const PORT = process.env.PORT || 7000;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
