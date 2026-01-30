exports.getAIRecommendation = (req, res) => {
    const { gender, occasion, season } = req.body;

    let tops = [];
    let bottoms = [];
    let shoes = [];
    let extras = [];

    if (gender === "man") {
        tops = ["a fitted blazer", "a classic shirt", "a smart jacket"];
        bottoms = ["tailored trousers", "dark jeans"];
        shoes = ["leather shoes", "clean sneakers"];
    } else {
        tops = ["an elegant blouse", "a stylish top", "a chic jacket"];
        bottoms = ["a midi skirt", "slim jeans"];
        shoes = ["heels", "fashion sneakers"];
    }

    if (occasion === "formal") {
        extras.push("minimal accessories");
    } else if (occasion === "party") {
        extras.push("bold accessories");
    } else {
        extras.push("a casual touch");
    }

    if (season === "winter") {
        extras.push("a warm coat");
    } else {
        extras.push("light fabrics");
    }

    function pick(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }

    const recommendation = `For a ${occasion} ${season} look, you can wear ${pick(
        tops
    )} with ${pick(bottoms)} and ${pick(shoes)}, finished with ${extras.join(" and ")
        }.`;

    res.json({ recommendation });
};
exports.getAITextRecommendation = (req, res) => {
    const text = req.body.text.toLowerCase();

    let gender = text.includes("woman") ? "woman" : "man";
    let occasion = "casual";
    let season = "summer";

    if (text.includes("formal") || text.includes("work")) occasion = "formal";
    if (text.includes("party")) occasion = "party";
    if (text.includes("winter")) season = "winter";

    let recommendation = `Based on your description, we suggest a ${occasion} ${season} outfit for a ${gender}. `;

    recommendation +=
        "Try combining stylish pieces that match the mood you described with confidence and comfort.";

    res.json({ recommendation });
};
