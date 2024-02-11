"use client";
import { Player } from "@/types/Player";
import Konva from "konva";
import { KonvaEventObject } from "konva/lib/Node";
import { ShapeConfig } from "konva/lib/Shape";
import { Vector2d } from "konva/lib/types";
import { round } from "lodash";
import { useEffect, useRef, useState } from "react";
import { Circle, Image, Layer, Rect, Stage } from "react-konva";
import useImage from "use-image";

export default function Court(props: { players: Player[]; updatePlayer: any }) {
	const [image, status] = useImage("/mccropped.png");
	const stage = useRef<Konva.Stage>(null);
	const [height, setHeight] = useState(0);

	const width = 800;

	let ratio: number = 0;
	useEffect(() => {
		if (status === "loaded") {
			ratio =
				(image as HTMLImageElement).width / (image as HTMLImageElement).height;
			setHeight(width / ratio);
			stage.current?.setSize({ width: width, height: width / ratio });
		}
	}, [status]);

	const feetToPxx = (original: number) => {
		if (stage.current) {
			return (original / 50) * stage.current.getSize().width;
		}
		return original;
	};
	const feetToPyy = (original: number) => {
		if (stage.current) {
			return (original / 47) * stage.current.getSize().height;
		}
		return original;
	};

	const pyyToFeet = (pyy: number) => {
		if (stage.current) {
			return (pyy / stage.current.getSize().height) * 47;
		}
		return pyy;
	};
	const pxxToFeet = (pxx: number) => {
		if (stage.current) {
			return (pxx / stage.current.getSize().width) * 50;
		}
		return pxx;
	};

	return (
		<Stage
			ref={stage}
			className="border-l-2 border-black"
			width={width}
			height={height}
		>
			<Layer>
				<Image image={image} width={width} height={height}></Image>
				{props.players.map((player, idx) => {
					return (
						<Circle
							key={idx}
							x={feetToPxx(player.x)}
							y={feetToPyy(player.y)}
							fill={player.color}
							radius={15}
							draggable
							onMouseEnter={(e) => {
								if (stage.current) {
									stage.current.container().style.cursor = "pointer";
									e.currentTarget.setAttr("fill", "white");
								}
							}}
							onMouseLeave={(e) => {
								if (stage.current) {
									stage.current.container().style.cursor = "default";
									e.currentTarget.setAttr("fill", player.color);
								}
							}}
							onDragEnd={(e) => {
								const feetX = pxxToFeet(e.target.getPosition().x);
								const feetY = pyyToFeet(e.target.getPosition().y);
								const adjustedX = round(feetX, 1);
								const adjustedY = round(feetY, 1);

								props.updatePlayer(idx, {
									x: adjustedX,
									y: adjustedY,
								});
							}}
						/>
					);
				})}
			</Layer>
		</Stage>
	);
}
