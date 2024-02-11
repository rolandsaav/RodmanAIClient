import { Player } from "@/types/Player";
import { round } from "lodash";

export default function PlayerOptions(props: {
	players: Player[];
	updatePlayer: any;
	offense: boolean;
}) {
	const order = props.offense ? "order-first" : "order-last";
	return (
		<div className={`${order} flex flex-col gap-5 px-1 `}>
			{props.players.map((player, index) => {
				if (props.offense) {
					if (player.side !== "offense") {
						return;
					}
				} else {
					if (player.side === "offense") {
						return;
					}
				}
				const name = player.shooter
					? "Shooter"
					: player.side === "offense"
						? `Offense ${player.id + 1}`
						: `Defense ${player.id - 4}`;
				return (
					<div className="w-full " key={player.id}>
						<div className="text-lg font-semibold">{name} Coords</div>
						<div className="flex text-sm justify-between">
							<div>{round(player.x, 2)}</div>
							<div>{round(player.y, 2)}</div>
						</div>
					</div>
				);
			})}
		</div>
	);
}
