export default {
	preset: 'ts-jest',
	testEnvironment: 'node',
	roots: ['<rootDir>/src'],
	setupFilesAfterEnv: ['./src/config/mocks.ts'],
};
