export interface HistoryImage {
	path: string;
	timestamp: number;
}

export const imageHistory = {
	add: (imagePath: string) => {
		const history = localStorage.getItem("imageHistory");
		const images: HistoryImage[] = history ? JSON.parse(history) : [];

		// Add new image if not already the most recent
		if (images[0]?.path !== imagePath) {
			images.unshift({ path: imagePath, timestamp: Date.now() });
			// Keep only last 20 images
			images.splice(20);
			localStorage.setItem("imageHistory", JSON.stringify(images));
		}
	},

	get: (): HistoryImage[] => {
		const history = localStorage.getItem("imageHistory");
		return history ? JSON.parse(history) : [];
	},

	clear: () => {
		localStorage.removeItem("imageHistory");
	},
};
