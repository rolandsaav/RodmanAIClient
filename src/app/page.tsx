"use client";
import { Player, StartingPositions } from "@/types/Player";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { round } from "lodash";
import PlayerOptions from "@/components/PlayerOptions";
import * as tf from "@tensorflow/tfjs";
import { defenseColor, offenseColor, shooterColor } from "@/colors";
const Court = dynamic(() => import("../components/court"), { ssr: false });

export default function Home() {
	const startingPlayers = StartingPositions.map((pos, index) => {
		const side = index > 4 ? "defense" : "offense";
		let player: Player = {
			...pos,
			side,
			shooter: index == 0 ? true : false,
			color:
				index == 0 ? shooterColor : index > 4 ? defenseColor : offenseColor,
			id: index,
		};
		return player;
	});

	const [model, setModel] = useState<tf.LayersModel | null>(null);
	const [prob, setProb] = useState(0);

	useEffect(() => {
		const getModel = async () => {
			const model = await tf.loadLayersModel("/model/model.json");
			setModel(model);
		};
		getModel();
	}, []);

	const getPrediction = () => {
		if (model !== null) {
			let input: number[][][][] = [[]];
			input[0] = new Array(47);
			for (let i = 0; i < 47; i++) {
				input[0][i] = new Array(50);
				for (let j = 0; j < 50; j++) {
					input[0][i][j] = [0];
				}
			}
			players.forEach((player) => {
				const row = Math.floor(player.y);
				const col = Math.floor(50 - player.x);
				input[0][row][col][0] = player.shooter
					? 3
					: player.side === "offense"
						? 2
						: 1;
			});

			const tensor = tf.tensor4d(input);
			const prediction = model.predict(tensor, {
				batchSize: 32,
			}) as tf.Tensor<tf.Rank>;
			const p = prediction.dataSync()[0];
			setProb(p);
		}
	};

	const updatePlayer = (id: number, pos: { x: number; y: number }) => {
		const nextPlayers = players.map((player) => {
			if (player.id === id) {
				const p = {
					...player,
					x: pos.x,
					y: pos.y,
				};
				return p;
			}
			return player;
		});
		setPlayers(nextPlayers);
		getPrediction();
	};
	const [players, setPlayers] = useState<Player[]>(startingPlayers);
	return (
		<div className="mx-auto container text-slate-200 pt-10 flex flex-col">
			<h1 className="font-bold text-5xl w-full text-center mb-8">Rodman AI</h1>
			<h4 className="font-semibold text-lg w-full text-center mb-12">
				&quot;Predicting the likelihood of offensive rebounds based on player
				position.&quot;
			</h4>

			<div className="probability-container mx-auto pb-2">
				<div
					className="offense flex text-xl justify-start px-3 font-bold items-center"
					style={{ width: `${400 * prob}px` }}
				>
					{round(prob * 100)}%
				</div>
				<div className="defense"></div>
			</div>
			<div className="flex justify-evenly">
				<Court players={players} updatePlayer={updatePlayer} />

				<PlayerOptions
					players={players}
					updatePlayer={updatePlayer}
					offense={true}
				/>
				<PlayerOptions
					players={players}
					updatePlayer={updatePlayer}
					offense={false}
				/>
			</div>
			<div className="info">In the NBA, ...</div>
		</div>
	);
}
