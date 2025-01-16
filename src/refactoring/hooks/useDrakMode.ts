import { useState, useEffect } from "react";
import { isSystemDarkMode } from "../models/utilColorMode";

export const useDarkMode = () => {
	const [isDarkMode, setIsDarkMode] = useState(isSystemDarkMode);

	useEffect(() => {
		// 초기 테마 설정
		document.body.style.backgroundColor = isDarkMode ? "black" : "white";
	}, [isDarkMode]);

	const toggleDarkMode = () => {
		setIsDarkMode((prevMode) => {
			const newMode = !prevMode;
			document.body.style.backgroundColor = newMode ? "black" : "white";
			return newMode;
		});
	};

	return { isDarkMode, toggleDarkMode };
};