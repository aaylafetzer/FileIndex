"use strict";
// Copyright (C) 2020 Aayla Fetzer
//
// This file is part of FileIndex.
//
// FileIndex is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// FileIndex is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with FileIndex.  If not, see <http://www.gnu.org/licenses/>.
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Express import
const express_1 = __importDefault(require("express"));
// Filesystem imports
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
// Winston logger from logging.ts
const logging_1 = require("./logging");
// Screen functions
const ui_1 = require("./ui");
const app = express_1.default();
// Get port to listen on from environment variable, defaulting to 8080
// if environment variable is undefined
const port = process.env.PORT || 8080;
// Get directory to browse from environment variable, defaulting to /
// if environment variable is undefined.
const directory = process.env.DIRECTORY || "/";
// Should hidden files and directories be shown?
const showDotfiles = process.env.SHOW_DOTFILES || false;
// Set static directory to directory so we can serve files later
app.use(express_1.default.static(directory));
// Configure Express to use EJS
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
// Define route handler
app.get("*", (req, res) => {
    const requestedPath = decodeURI(directory + req.url);
    const requestedUrl = decodeURI(req.url);
    logging_1.logger.info(req.ip + " is accessing " + req.url);
    // Ensure that the requested path exists
    if (fs.existsSync(requestedPath)) {
        // Test if given path is a file or a directory
        const stats = fs.statSync(requestedPath);
        // Return the file index if directory, else return the file content
        if (!stats.isFile()) {
            // Get directory contents
            const pathContents = fs.readdirSync(requestedPath);
            // Ensure path contents is entirely real files
            let pathContentsFiltered = pathContents.filter(item => fs.existsSync(requestedPath + item));
            // Remove dotfiles
            if (!showDotfiles) {
                pathContentsFiltered = pathContentsFiltered.filter(item => !(/(?:^|[\\\/])(\.(?!\.)[^\\\/]+)$/.test(item)));
            }
            // Separate directory contents into paths and files
            const files = ui_1.fileInfo(pathContentsFiltered, requestedPath);
            const directories = ui_1.directoryInfo(pathContentsFiltered, requestedPath);
            // UI functions
            const breadcrumb = ui_1.makeBreadcrumb(requestedUrl);
            const currentDir = breadcrumb.pop().display;
            logging_1.logger.info(currentDir);
            // Render directory screen
            res.render("browse", {
                "url": requestedUrl,
                "path": breadcrumb,
                "currentDir": currentDir,
                "directories": directories,
                "files": files
            });
        }
    }
    else {
        // Path does not exist
        logging_1.logger.info(`Path ${requestedPath} does not exist!`);
        res.send("File not found");
    }
});
// Start the server
app.listen(port, () => {
    logging_1.logger.info(`Started server on port ${port}`);
});
//# sourceMappingURL=index.js.map