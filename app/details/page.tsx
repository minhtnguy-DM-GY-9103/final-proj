"use client";

import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import path from "path";
import ImageClassifier from "../components/ImageClassifier";
import { imageHistory } from "../utils/imageHistory";
import { useEffect, useState } from "react";
import ImageHistory from "../components/ImageHistory";

export default function ImagePage() {
	const [imagePath, setImagePath] = useState("");

	useEffect(() => {
		const searchParams = new URLSearchParams(window.location.search);
		const path = searchParams.get("imagePath") || "";
		setImagePath(path);
	}, []);

	const fileName = path.basename(imagePath);

	useEffect(() => {
		async function validate() {
			if (!imagePath) {
				notFound();
				return;
			}

			const response = await fetch(
				`/api/validate-image?path=${encodeURIComponent(imagePath)}`
			);
			const { valid } = await response.json();

			if (!valid) {
				notFound();
				return;
			}

			imageHistory.add(imagePath);
		}

		validate();
	}, [imagePath]);

	if (!imagePath) return null;

	return (
		<div className="flex flex-col items-center justify-center min-h-screen bg-[#2E2E2E]">
			<div className="w-full max-w-6xl flex flex-col gap-4 p-8">
				<div className="relative w-full h-[50vh] rounded-lg overflow-hidden">
					<Image
						src={imagePath}
						alt={fileName}
						fill
						className="object-contain"
						sizes="100vw"
						priority
					/>
				</div>
				<ImageClassifier imagePath={imagePath} />
			</div>
			{/* <ImageHistory /> */}
		</div>
	);
}
