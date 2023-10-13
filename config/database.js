import mongoose from "mongoose";

export const connectDatase = () => {
  mongoose
    .connect(process.env.MONGO_URI)
    .then((con) => console.log(`Database connect: ${con.connection.host}`))
    .catch((err) => console.log(err));
};




// exports.connecDatabase = () => {
//   mongoose
//     .connect(process.env.MONGO_URI)
//     .then((con) => console.log(`Database connect: ${con.connection.host}`))
//     .catch((err) => console.log(err));
// };
