const productModel = require("../../models/product.model");
const getHomePage = async (req, res) => {
    try {
        
        const { category } = req.query
        
        const filter = category && category !== 'all' ? { category } : {}
        const products = await productModel.find(filter).sort({ createdAt: -1 })

        // Nếu là API call thì trả JSON
        if (req.xhr || req.headers.accept.includes('application/json')) {
            return res.json({ success: true, products })
        }

        // Nếu là page load thì render
        res.render("./client/pages/home/index", { products })
    } catch (err) {
        console.error(err)
        res.send("Lỗi server")
    }

}

module.exports = {
    getHomePage
}