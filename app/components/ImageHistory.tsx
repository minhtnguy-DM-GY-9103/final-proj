"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { imageHistory, HistoryImage } from "../utils/imageHistory";

export default function ImageHistory() {
	const [history, setHistory] = useState<HistoryImage[]>([]);

	useEffect(() => {
		setHistory(imageHistory.get());
	}, []);

	const handleClearHistory = () => {
		imageHistory.clear();
		setHistory([]);
	};

	if (history.length === 0) return null;

	return (
		<div className="w-full p-4">
			{/* <h3 className="text-gray-200 mb-3">Recently Viewed</h3> */}
			<div className="flex gap-2 overflow-x-auto pb-2">
				{history.map((item, i) => (
					<Link
						key={i}
						href={`/details?imagePath=${encodeURIComponent(item.path)}`}
						className="flex-shrink-0"
					>
						<div className="relative w-20 h-20">
							<Image
								src={item.path}
								alt="History thumbnail"
								fill
								className="object-cover rounded"
								sizes="80px"
							/>
						</div>
					</Link>
				))}
				<button
					onClick={handleClearHistory}
					className="text-sm text-gray-100 hover:text-white hover:cursor-pointer px-2 py-1 rounded bg-gray-700 hover:bg-gray-600 transition-colors"
				>
					Clear History
				</button>
			</div>
		</div>
	);
}
