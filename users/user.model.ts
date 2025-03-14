import { Sequelize, DataTypes, Model, Optional } from 'sequelize';

// Define User attributes
interface UserAttributes {
    id: number;  // Sequelize auto-generates ID
    email: string;
    passwordHash: string;
    title: string;
    firstName: string;
    lastName: string;
    role: string;
}

// Define attributes that are optional when creating a user
interface UserCreationAttributes extends Optional<UserAttributes, 'id' | 'role'> {}

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
    public id!: number;
    public email!: string;
    public passwordHash!: string;
    public title!: string;
    public firstName!: string;
    public lastName!: string;
    public role!: string;
}

export default function model(sequelize: Sequelize) {
    User.init(
        {
            id: {
                type: DataTypes.INTEGER.UNSIGNED,
                autoIncrement: true,
                primaryKey: true,
            },
            email: { type: DataTypes.STRING, allowNull: false, unique: true },
            passwordHash: { type: DataTypes.STRING, allowNull: false },
            title: { type: DataTypes.STRING, allowNull: false },
            firstName: { type: DataTypes.STRING, allowNull: false },
            lastName: { type: DataTypes.STRING, allowNull: false },
            role: { type: DataTypes.STRING, allowNull: true } // Optional role
        },
        {
            sequelize,
            tableName: 'users',
            modelName: 'User',
            defaultScope: {
                attributes: { exclude: ['passwordHash'] }
            },
            scopes: {
                withHash: { attributes: { include: ['passwordHash'] } }
            }
        }
    );

    return User;
}
