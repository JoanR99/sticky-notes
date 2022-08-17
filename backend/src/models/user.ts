import {
	Table,
	Column,
	Model,
	HasMany,
	AutoIncrement,
	PrimaryKey,
	Unique,
} from 'sequelize-typescript';

import Note from './note';

// interface UserModel
// 	extends Model<
// 		InferAttributes<UserModel>,
// 		InferCreationAttributes<UserModel>
// 	> {
// 	id: CreationOptional<number>;
// 	username: string;
// 	email: string;
// 	password: string;
// 	refreshToken: CreationOptional<string>;
// }

@Table
class User extends Model {
	@AutoIncrement
	@PrimaryKey
	@Column
	id: number;

	@Unique
	@Column
	username: string;

	@Unique
	@Column
	email: string;

	@Column
	password: string;

	@Column
	refreshToken: string;

	@HasMany(() => Note)
	notes: Note[];
}

// const Users = sequelize.define<UserModel>('User', {
// 	id: {
// 		type: DataTypes.INTEGER,
// 		primaryKey: true,
// 		autoIncrement: true,
// 	},
// 	username: {
// 		type: DataTypes.STRING,
// 	},
// 	email: {
// 		type: DataTypes.STRING,
// 	},
// 	password: {
// 		type: DataTypes.STRING,
// 	},
// 	refreshToken: {
// 		type: DataTypes.STRING,
// 	},
// });

// User.hasMany(Note);
// Note.belongsTo(User);

export default User;
