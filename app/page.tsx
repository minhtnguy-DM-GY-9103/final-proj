import { useState, useEffect } from "react";
import Image from "next/image";
import fs from "fs";
import path from "path";
import Link from "next/link";
import ImageHistory from "./components/ImageHistory";

// This function runs on the server to get image paths
export async function getImagePaths() {
	const imagesDirectory = path.join(process.cwd(), "public/images");

	try {
		// Read the directory
		const fileNames = fs.readdirSync(imagesDirectory);

		// Filter for image files (you can add more extensions if needed)
		const imagePaths = fileNames
			.filter((file) => {
				const ext = path.extname(file).toLowerCase();
				return [".jpg", ".jpeg", ".png", ".gif", ".webp"].includes(ext);
			})
			.map((file) => `/images/${file}`);

		return imagePaths;
	} catch (error) {
		console.error("Error reading images directory:", error);
		return [];
	}
}

export default async function Home() {
	// Get image paths at build/request time
	const imagePaths = await getImagePaths();

	return (
		<main className="min-h-screen bg-[#2E2E2E]">
			<ImageHistory />
			{/* Image Grid */}
			<div className="flex flex-col items-center min-h-screen p-24 bg-[#2E2E2E]">
				<div className="w-full">
					<div className="grid grid-cols-1 md:grid-cols-4 gap-12">
						{imagePaths.map((src, index) => (
							<Link
								key={index}
								href={`/details?imagePath=${encodeURIComponent(src)}`}
								className="relative aspect-square bg-[#2E2E2E] overflow-hidden cursor-pointer transition-transform hover:scale-105"
							>
								<Image
									src={src}
									alt={`Image ${index + 1}`}
									fill
									className="object-contain"
									sizes="(max-width: 768px) 100vw, 33vw"
								/>
							</Link>
						))}

						{/* If we have fewer than 9 images, add placeholders to complete the grid */}
						{Array.from({ length: Math.max(0, 9 - imagePaths.length) }).map(
							(_, index) => (
								<div
									key={`placeholder-${index}`}
									className="relative aspect-square bg-[#2A2A2A] rounded-md flex items-center justify-center"
								>
									<div className="text-gray-500 text-sm">Image placeholder</div>
								</div>
							)
						)}
					</div>
				</div>
			</div>
		</main>
	);
}
