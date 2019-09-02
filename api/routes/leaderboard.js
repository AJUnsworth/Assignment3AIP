const express = require("express");
const router = express.Router();

const members = [
    { name: "Andrew", rank: "#1" },
    { name: "Bela", rank: "#2" },
    { name: "Chloe", rank: "#3" },
    { name: "James", rank: "#4" },
    { name: "Josh", rank: "#5" },
    { name: "Andrew", rank: "#6" },
    { name: "Bela", rank: "#7" },
    { name: "Chloe", rank: "#8" },
    { name: "James", rank: "#9" },
    { name: "Josh", rank: "#10" },
    { name: "Josh", rank: "#11" },
    { name: "Andrew", rank: "#12" },
    { name: "Bela", rank: "#13" },
    { name: "Chloe", rank: "#14" },
    { name: "James", rank: "#15" },
    { name: "Josh", rank: "#16" },
    { name: "Josh", rank: "#17" },
    { name: "Andrew", rank: "#18" },
    { name: "Bela", rank: "#19" },
    { name: "Chloe", rank: "#20" }
];

/* GET home page. */
router.get("/", function (req, res, next) {
    let start = req.query.start || 0;
    let limit = req.query.limit || 10;
    let topMembers = members.slice(start, limit); //for top limit
    res.json(topMembers);
});

module.exports = router;
