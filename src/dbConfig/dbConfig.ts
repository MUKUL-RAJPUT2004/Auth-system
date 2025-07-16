// import mongoose from "mongoose";

// export async function connect() {
//     try {
        
//         await mongoose.connect(process.env.MONGO_URI!);
//         const connection = mongoose.connection;

//         connection.on('connected', ()=>{
//             console.log("MongoDB connected successfully");
            
//         })

//         connection.on('error', (err) => {
//             console.error("MongoDB connection error:", err);
//             process.exit();
//         });

//     } catch (error) {
//         console.error("Database connection error:", error);
//     }

// }

import mongoose from "mongoose";

export async function connect() {
  try {
    // Connect to MongoDB without deprecated options
    await mongoose.connect(process.env.MONGO_URI!);

    const connection = mongoose.connection;

    connection.on('connected', () => {
      console.log("MongoDB connected successfully");
    });

    connection.on('error', (err) => {
      console.error("MongoDB connection error:", err);
      retryConnection(); // Retry on error instead of exiting
    });

    connection.on('disconnected', () => {
      console.log("MongoDB disconnected. Attempting to reconnect...");
      retryConnection();
    });
  } catch (error) {
    console.error("Database connection error:", error);
    retryConnection();
  }
}

// Retry logic for connection failures
async function retryConnection() {
  const maxRetries = 5;
  let attempt = 0;

  const attemptConnect = async () => {
    attempt++;
    try {
      await mongoose.connect(process.env.MONGO_URI!);
      console.log("MongoDB reconnected successfully");
    } catch (err) {
      console.error(`Retry ${attempt} failed:`, err);
      if (attempt < maxRetries) {
        setTimeout(attemptConnect, 5000 * attempt); // 5s, 10s, 15s...
      } else {
        console.error("Max retry attempts reached. Please check MongoDB.");
      }
    }
  };

  await attemptConnect();
}

// Call connect on app startup
connect();