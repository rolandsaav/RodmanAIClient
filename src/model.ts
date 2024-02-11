import * as tf from "@tensorflow/tfjs";
import url from "url";

export default async function getModel() {
	const fileUrl = url.pathToFileURL("../output/model.json");
	console.log(fileUrl);
	const model = await tf.loadLayersModel(fileUrl.href);
	return model;
}
