import app from "./app.js"
import { connectDatase } from "./config/database.js"

connectDatase();

app.listen(process.env.PORT, ()=> {
    console.log(`Server is running on port ${process.env.PORT}`)
})