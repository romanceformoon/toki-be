export const test = async (n: number) => {
    let userExp = 0;

    const hardBonus = 300 + parseFloat((1.3 ** n).toFixed(2));
    const hardLevel = 1.55;

    const baseScore = parseFloat((hardLevel ** n).toFixed(2));

    const addScore = baseScore + (1 / (0 + 1)) * 100 + hardBonus + 89 + 0.1;

    const ratingWeight = ((100 - 20) / 4) ** (n / 10);

    const finalExp = addScore + ratingWeight;

    userExp += finalExp;

    console.log(n, userExp);
};
