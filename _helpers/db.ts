import { Sequelize } from 'sequelize';
import mysql from 'mysql2/promise';
const config = require('../config.json'); 
interface DatabaseConfig {
    host: string;
    port: number;
    user: string;
    password: string;
    database: string;
}

const db: { User?: any; sequelize?: Sequelize } = {};

export default db;

initialize();

async function initialize(): Promise<void> {
    try {
        // Extract database config
        const { host, port, user, password, database }: DatabaseConfig = config.database;
        
        // Create DB if it doesn't already exist
        const connection = await mysql.createConnection({ host, port, user, password });
        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`);
        await connection.end();

        // Connect to DB
        const sequelize = new Sequelize(database, user, password, { dialect: 'mysql' });

        // Initialize models and attach them to db object
        db.User = (await import('../users/user.model')).default(sequelize);

        // Sync all models
        await sequelize.sync({ alter: true });

        // Attach Sequelize instance
        db.sequelize = sequelize;
    } catch (error) {
        console.error('Database initialization failed:', error);
    }
}
