// server.ts
import app from "./app";
import { connectToDatabase } from "./services/database.service";
const PORT = process.env.PORT || 5001;

connectToDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error: Error) => {
    console.error("Database connection failed", error);
    process.exit();
  });
