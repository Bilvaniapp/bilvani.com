const colorCodeApi = async (req, res) => {
    const colors = [
        { hex: "#0000ff", shade: "C" }, // Blue
        { hex: "#800000", shade: "M" }, // Maroon
        { hex: "#ffff00", shade: "Y" }, // Yellow
        { hex: "#000000", shade: "K" }, // Black
        { hex: "#ffffff", shade: "W" }, // White
        { hex: "#ff0000", shade: "R" }, // Red
        { hex: "#f5f5dc", shade: "G" }, // Beige
        { hex: "#946b00", shade: "B" }, // Olive
        { hex: "#ffa500", shade: "O" }, // Orange
        { hex: "#ff9999", shade: "P" }  // Light Pink
    ];

    res.json(colors);
}

module.exports = { colorCodeApi };
