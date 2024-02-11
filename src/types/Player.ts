export type Player = {
	x: number;
	y: number;
	side: "offense" | "defense";
	shooter: boolean;
	color: string;
	id: number;
};

export const StartingPositions = [
	{ x: 32, y: 29 },
	{ x: 41, y: 26 },
	{ x: 13, y: 31 },
	{ x: 4, y: 21 },
	{ x: 13, y: 3 },
	{ x: 29, y: 24 },
	{ x: 20, y: 28 },
	{ x: 40, y: 23 },
	{ x: 19, y: 14 },
	{ x: 19, y: 7 },
];
