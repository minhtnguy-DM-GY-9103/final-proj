"use client";

import { useState, useEffect } from "react";
import * as tf from "@tensorflow/tfjs";
import * as mobilenet from "@tensorflow-models/mobilenet";
import quantize from "quantize";

// Initialize tensorflow backend with CPU only
tf.setBackend("cpu");

interface ImageClassifierProps {
	imagePath: string;
	onAnalysis?: (tags: string[], colors: Color[]) => void;
}

interface Prediction {
	className: string;
	probability: number;
}

interface Color {
	r: number;
	g: number;
	b: number;
}

type RgbPixel = [number, number, number];

async function getImageColors(
	imagePath: string,
	colorCount: number = 5
): Promise<Color[]> {
	return new Promise((resolve) => {
		const img = new Image();
		img.src = imagePath;
		img.onload = () => {
			const canvas = document.createElement("canvas");
			const ctx = canvas.getContext("2d");
			canvas.width = img.width;
			canvas.height = img.height;

			ctx?.drawImage(img, 0, 0);
			const imageData = ctx?.getImageData(
				0,
				0,
				canvas.width,
				canvas.height
			).data;

			if (!imageData) return resolve([]);

			const pixels: RgbPixel[] = [];
			for (let i = 0; i < imageData.length; i += 4) {
				pixels.push([imageData[i], imageData[i + 1], imageData[i + 2]]);
			}

			const colorMap = quantize(pixels, colorCount);
			if (!colorMap) return resolve([]);

			const palette = colorMap.palette() as RgbPixel[];
			resolve(palette.map(([r, g, b]) => ({ r, g, b })));
		};
	});
}

function ColorSwatch({ color }: { color: Color }) {
	return (
		<div
			className="w-8 h-8 rounded"
			style={{
				backgroundColor: `rgb(${color.r}, ${color.g}, ${color.b})`,
			}}
		/>
	);
}

export default function ImageClassifier({
	imagePath,
	onAnalysis,
}: ImageClassifierProps) {
	const [tags, setTags] = useState<string[]>([]);
	const [description, setDescription] = useState<string>("");
	const [isLoading, setIsLoading] = useState(true);
	const [colors, setColors] = useState<Color[]>([]);

	useEffect(() => {
		async function analyzeImage() {
			try {
				const imageColors = await getImageColors(imagePath);
				setColors(imageColors);

				// Load the model
				const model = await mobilenet.load();

				// Create an HTML image element
				const imgElement = new Image();
				imgElement.src = imagePath;

				await new Promise((resolve) => {
					imgElement.onload = resolve;
				});

				// Classify the image
				const predictions = await model.classify(imgElement);

				// Extract top 3 predictions
				const topTags = predictions
					.slice(0, 3)
					.map((pred: Prediction) => pred.className.split(",")[0].trim());

				setTags(topTags);
				setIsLoading(false);

				// Call the callback with analysis results
				onAnalysis?.(topTags, imageColors);
			} catch (error) {
				console.error("Error analyzing image:", error);
				setIsLoading(false);
			}
		}

		analyzeImage();
	}, [imagePath, onAnalysis]);

	if (isLoading) {
		return (
			<div className="flex justify-center p-4 text-gray-200">
				Analyzing image...
			</div>
		);
	}

	return (
		<div className="flex flex-col items-center p-4 gap-3">
			<p className="text-gray-200 text-sm">{description}</p>
			<div className="flex flex-wrap gap-2">
				{tags.map((tag, index) => (
					<span
						key={index}
						className="px-3 py-1 bg-[#575757] text-white text-sm"
					>
						{tag}
					</span>
				))}
			</div>
			<div className="flex gap-2 mt-2">
				{colors.map((color, i) => (
					<ColorSwatch key={i} color={color} />
				))}
			</div>
		</div>
	);
}
