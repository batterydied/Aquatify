import { Sequelize } from 'sequelize';
import dotenv from "dotenv";

dotenv.config();
// Set up a Sequelize instance to connect to PostgreSQL
const sequelize = new Sequelize({
  dialect: process.env.DB_DIALECT,
  host: process.env.DB_HOST, 
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  logging: false,
});

// Connect to the database and authenticate
const connectToDatabase = async () => {
  try {
    // Test the connection
    await sequelize.authenticate();
    console.log('Connection to the database has been established successfully.');

    await sequelize.sync({force: true});
    //await sequelize.sync();
    console.log('Database synchronized successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

// Export the sequelize instance and connection function
export default sequelize;
export { connectToDatabase };
