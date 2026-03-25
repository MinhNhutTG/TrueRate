const initWebRoutes = (app)=>{
    const webRoutes = require("./index.router");
    const productRoutes  = require("./product.router");
    app.use("/", webRoutes);
    app.use("/product", productRoutes);
    app.use("/auth", require("./auth.router"));
    app.use("/profile", require("./profile.router"));
}

module.exports = initWebRoutes; 