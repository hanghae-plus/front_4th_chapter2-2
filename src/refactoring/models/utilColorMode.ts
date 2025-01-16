// 다크모드 체크
export const isSystemDarkMode = (): boolean => {
	return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
};