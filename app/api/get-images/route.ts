import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
	try {
		const imagesDirectory = path.join(process.cwd(), "public/images");

		// Check if directory exists
		if (!fs.existsSync(imagesDirectory)) {
			return NextResponse.json({ paths: [] }, { status: 404 });
		}

		const fileNames = fs.readdirSync(imagesDirectory);
		const imagePaths = fileNames
			.filter((file) => {
				const ext = path.extname(file).toLowerCase();
				return [".jpg", ".jpeg", ".png", ".gif", ".webp"].includes(ext);
			})
			.map((file) => `/images/${file}`);

		return NextResponse.json({ paths: imagePaths });
	} catch (error) {
		console.error("Error reading images directory:", error);
		return NextResponse.json(
			{ error: "Failed to read images" },
			{ status: 500 }
		);
	}
}
