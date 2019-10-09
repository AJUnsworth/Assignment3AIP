
exports.admin_check = async (req, res) => {
    if (req.decoded.isAdmin) {
        return res.sendStatus(200);
    } else {
        return res.sendStatus(403);
    }
};