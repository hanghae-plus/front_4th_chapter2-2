import { useState, useEffect } from "react";
import { isSystemDarkMode } from "../models/utilColorMode";

export const useDarkMode = () => {
	const [isDarkMode, setIsDarkMode] = useState(isSystemDarkMode);

	useEffect(() => {
		// 초기 테마 설정
		document.body.style.backgroundColor = isDarkMode ? "black" : "white";
		if (isDarkMode) {
			document.querySelector("nav")?.classList.remove("bg-blue-600");
			document.querySelector("nav")?.classList.add("bg-gray-800");

			document.getElementById("wrapContent")?.classList.remove("bg-gray-100");
			document.getElementById("wrapContent")?.classList.add("bg-gray-500");

			document.querySelectorAll(".bg-blue-500").forEach((el) => {
				el.classList.remove("bg-blue-500");
				el.classList.add("bg-gray-500");
			});
			document.querySelectorAll(".bg-blue-500").forEach((el) => {
				el.classList.remove("bg-blue-500");
				el.classList.add("bg-gray-500");
			});
		} else {
			document.querySelector("nav")?.classList.remove("bg-gray-800");
			document.querySelector("nav")?.classList.add("bg-blue-600");

			document.getElementById("wrapContent")?.classList.remove("bg-gray-500");
			document.getElementById("wrapContent")?.classList.add("bg-gray-100");

			document.querySelectorAll(".bg-gray-500").forEach((el) => {
				el.classList.remove("bg-gray-500");
				el.classList.add("bg-blue-500");
			});
		}

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