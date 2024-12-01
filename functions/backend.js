const path = require("path");
const fs = require("fs");

exports.handler = async (event, context) => {
    const { httpMethod, path: reqPath } = event;

    console.log(`HTTP ${httpMethod} Request to ${reqPath}`);

    
    if (reqPath === "/" && httpMethod === "GET") {
        const filePath = path.join(__dirname, "public", "index.html");
        return serveFile(filePath, "text/html");
    }

    
    if (reqPath === "/api" && httpMethod === "GET") {
        const filePath = path.join(__dirname, "public", "db.json");
        return serveFile(filePath, "application/json");
    }

    
    const staticPath = path.join(__dirname, "public", reqPath);
    if (fs.existsSync(staticPath)) {
        const ext = path.extname(staticPath);
        const mimeTypes = {
            ".html": "text/html",
            ".css": "text/css",
            ".png": "image/png",
            ".jpg": "image/jpeg",
            ".jpeg": "image/jpeg",
        };
        const contentType = mimeTypes[ext] || "application/octet-stream";
        return serveFile(staticPath, contentType);
    }

    // 404 for undefined routes
    return {
        statusCode: 404,
        headers: {
            "Content-Type": "text/html",
            "Access-Control-Allow-Origin": "*", 
        },
        body: "<h1>404 - Page Not Found</h1>",
    };
};

// Utility function to serve files
function serveFile(filePath, contentType) {
    try {
        const ext = path.extname(filePath);
        const content = fs.readFileSync(filePath, ext === ".png" || ext === ".jpg" || ext === ".jpeg" ? null : "utf-8");
        return {
            statusCode: 200,
            headers: {
                "Content-Type": contentType,
                "Access-Control-Allow-Origin": "*", 
                "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type, Authorization",
            },
            body: content.toString("base64"),
            isBase64Encoded: ext === ".png" || ext === ".jpg" || ext === ".jpeg",
        };
    } catch (err) {
        console.error(`Error reading file: ${filePath}`, err);
        return {
            statusCode: 500,
            headers: {
                "Content-Type": "text/html",
                "Access-Control-Allow-Origin": "*", 
            },
            body: "<h1>500 - Internal Server Error</h1>",
        };
    }
}

