import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(request: Request) {
	const { searchParams } = new URL(request.url);
	const imagePath = searchParams.get("path");

	if (!imagePath) {
		return NextResponse.json({ valid: false }, { status: 400 });
	}

	const publicPath = imagePath.startsWith("/") ? imagePath.slice(1) : imagePath;
	const fullPath = path.join(process.cwd(), "public", publicPath);

	try {
		await fs.promises.access(fullPath, fs.constants.F_OK);
		return NextResponse.json({ valid: true });
	} catch (error) {
		return NextResponse.json({ valid: false });
	}
}
