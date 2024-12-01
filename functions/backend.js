const path = require("path");
const fs = require("fs");

exports.handler = async (event) => {
    const { path: reqPath, httpMethod } = event;

    console.log(`HTTP ${httpMethod} Request to ${reqPath}`);

    // Common headers for CORS
    const commonHeaders = {
        "Access-Control-Allow-Origin": "*", // Allow all origins
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS", // Allowed methods
        "Access-Control-Allow-Headers": "Content-Type", // Allowed headers
    };

    // Handle CORS preflight requests
    if (httpMethod === "OPTIONS") {
        return {
            statusCode: 200,
            headers: commonHeaders,
            body: "CORS Preflight Check Passed",
        };
    }

    // Serve portfolio homepage
    if (reqPath === "/" || reqPath === "/index.html") {
        const filePath = path.join(__dirname, "../public/index.html");
        try {
            const content = fs.readFileSync(filePath, "utf-8");
            return {
                statusCode: 200,
                headers: { ...commonHeaders, "Content-Type": "text/html" },
                body: content,
            };
        } catch (error) {
            console.error("Error reading index.html:", error);
            return {
                statusCode: 500,
                headers: commonHeaders,
                body: "Internal Server Error",
            };
        }
    }

    // Serve JSON data at /api
    if (reqPath === "/api" && httpMethod === "GET") {
        const filePath = path.join(__dirname, "data", "db.json");
        try {
            const content = fs.readFileSync(filePath, "utf-8");
            return {
                statusCode: 200,
                headers: { ...commonHeaders, "Content-Type": "application/json" },
                body: content,
            };
        } catch (error) {
            console.error("Error reading db.json:", error);
            return {
                statusCode: 500,
                headers: commonHeaders,
                body: "Internal Server Error",
            };
        }
    }

    // 404 for undefined routes
    return {
        statusCode: 404,
        headers: commonHeaders,
        body: "404 Not Found",
    };
};

