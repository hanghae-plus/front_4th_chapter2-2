// 글자 확대 축소
import { useState } from "react";

export const useFontSize = () => {
	const [fontSize, setFontSize] = useState(16); // 초기 font-size: 16px

	const increaseFontSize = () => {
		setFontSize((prev) => Math.min(prev + 1, 23)); // 최대 23px
	};

	const decreaseFontSize = () => {
		setFontSize((prev) => Math.max(prev - 1, 9)); // 최소 9px
	};

	return { fontSize, increaseFontSize, decreaseFontSize };
};