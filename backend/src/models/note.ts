import {
	Table,
	Column,
	Model,
	BelongsTo,
	AutoIncrement,
	PrimaryKey,
	ForeignKey,
} from 'sequelize-typescript';

import Color from './color';
import User from './user';

@Table
class Note extends Model {
	@AutoIncrement
	@PrimaryKey
	@Column
	id: number;

	@Column
	title: string;

	@Column
	content: string;

	@Column
	isArchive: boolean;

	@ForeignKey(() => User)
	@Column
	userId: number;

	@BelongsTo(() => User)
	user: User;

	@ForeignKey(() => Color)
	@Column
	colorId: number;

	@BelongsTo(() => Color)
	color: Color;
}

// const Note = sequelize.define<NoteModel>('Note', {
// 	id: {
// 		type: DataTypes.INTEGER,
// 		primaryKey: true,
// 		autoIncrement: true,
// 	},
// 	title: {
// 		type: DataTypes.STRING,
// 	},
// 	content: {
// 		type: DataTypes.STRING,
// 	},
// 	isArchive: {
// 		type: DataTypes.BOOLEAN,
// 		defaultValue: false,
// 	},
// });

// Note.belongsTo(Color);
// Color.hasMany(Note);

export default Note;
