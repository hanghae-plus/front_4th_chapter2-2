type CombinedStyles = { [key: string]: string };

export const combineClassNames = (
  combinedStyles: CombinedStyles,
  className?: string
) => {
  if (className) {
    const customStyles = className.split(" ").reduce((acc, cls) => {
      const [property] = cls.split("-");
      return { ...acc, [property]: cls };
    }, {});

    Object.assign(combinedStyles, customStyles);
  }

  return Object.values(combinedStyles).join(" ");
};
