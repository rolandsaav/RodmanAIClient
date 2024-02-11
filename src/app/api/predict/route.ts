import getModel from "@/model";

export async function POST(request: Request) {
	console.log("HIT");
	const model = await getModel();
	console.log(model);

	const dataJson = await request.json();
	console.log(dataJson);
	const result = model.predict(dataJson);

	console.log(dataJson);

	return new Response("Hello, Next.js!", {
		status: 200,
		headers: {
			"Access-Control-Allow-Origin": "https://localhost:3000",
			"Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
			"Access-Control-Allow-Headers": "Content-Type, Authorization",
		},
	});
}
