const productModel = require("../../models/product.model");
const getHomePage = async (req, res) => {
    try {
      
        const products = await productModel.find();
        if (!products) {
            return res.send("Không có sản phẩm nào");
        }
        
        res.render("./client/pages/home/index",{ products });
    } catch (err) {
        console.error(err);
        res.send("Lỗi server");
    }
   
}

module.exports = {
    getHomePage
}