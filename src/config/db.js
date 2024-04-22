const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const mongoDB = 'mongodb+srv://hengkimhok07:RjLX6TdttRKBpiOo@hengkimhok.bii82do.mongodb.net/?retryWrites=true&w=majority';

main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(mongoDB);
}
