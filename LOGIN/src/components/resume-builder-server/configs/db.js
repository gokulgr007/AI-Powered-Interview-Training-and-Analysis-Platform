import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

const connectDb = async () => {
  try {
    mongoose.connection.on("connected", () => {
      console.log("Database connected successfully");
    });

    mongoose.connection.on("error", (err) => {
      console.error("Mongoose connection error:", err);
    });

    let mongodbURI = process.env.MONGODB_URI;
    const projectName = "Resume-Builder";

    // If local env doesn't provide a MONGODB_URI, try the repository-wide
    // Backend/.env (useful when secrets are stored there during development).
    if (!mongodbURI || mongodbURI.trim() === "") {
      const backendEnvPath = path.resolve(
        process.cwd(),
        "..",
        "..",
        "..",
        "..",
        "Backend",
        ".env"
      );
      try {
        console.log(`Looking for Backend .env at ${backendEnvPath}`);
        if (fs.existsSync(backendEnvPath)) {
          const parsed = dotenv.parse(fs.readFileSync(backendEnvPath));
          if (parsed.MONGODB_URI) {
            mongodbURI = parsed.MONGODB_URI;
            console.log(`Using MONGODB_URI from ${backendEnvPath}`);
          } else {
            console.log(`No MONGODB_URI in ${backendEnvPath}`);
          }
        } else {
          console.log(`Backend .env not found at ${backendEnvPath}`);
        }
      } catch (e) {
        console.warn("Failed to read Backend .env:", e.message);
      }

      if (!mongodbURI || mongodbURI.trim() === "") {
        console.warn(
          "MONGODB_URI environment variable not set — falling back to local MongoDB at mongodb://127.0.0.1:27017"
        );
        mongodbURI = "mongodb://127.0.0.1:27017";
      }
    }

    if (mongodbURI.endsWith("/")) {
      mongodbURI = mongodbURI.slice(0, -1);
    }

    // If the provided URI already includes a database name or query string
    // (for example Atlas URIs often include '/?'), don't append the project name.
    const hasDbOrQuery = mongodbURI.includes("?") || /\/[^\/\?]+$/.test(mongodbURI);
    const fullUri = hasDbOrQuery ? mongodbURI : `${mongodbURI}/${projectName}`;
    console.log("Attempting MongoDB connection to:", fullUri);

    await mongoose.connect(fullUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
    });
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);

    if (error && error.code === "ECONNREFUSED") {
      console.error(
        "Connection refused — is MongoDB running on 127.0.0.1:27017?\n"
          + "If you intended to use a remote/Atlas DB, set the MONGODB_URI environment variable.\n"
          + "To start a local MongoDB on Windows, ensure the MongoDB service is installed and run: net start MongoDB\n"
          + "Or run 'mongod' in a terminal if you have the server binary available."
      );
    }

    process.exit(1);
  }
};

export default connectDb;
