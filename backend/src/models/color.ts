import {
	Table,
	Column,
	Model,
	AutoIncrement,
	HasMany,
	PrimaryKey,
	Unique,
} from 'sequelize-typescript';

import Note from './note';

@Table
class Color extends Model {
	@AutoIncrement
	@PrimaryKey
	@Column
	id: number;

	@Unique
	@Column
	name: string;

	@Unique
	@Column
	hex: string;

	@HasMany(() => Note)
	notes: Note[];
}

export default Color;
