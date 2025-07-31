export const getCurrentSchoolYear = () => {
    const currentYear = new Date().getFullYear();
    const nextYear = new Date().getFullYear() + 1;

    return `${currentYear}-${nextYear}`;
};
