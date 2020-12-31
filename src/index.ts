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

// Express import
import express from "express";
// Filesystem imports
import * as fs from 'fs';
import * as path from 'path';
// Winston logger from logging.ts
import {logger} from "./logging";

import { exit } from "process";
import { getRulesDirectories } from "tslint/lib/configuration";
const app = express();

// Get port to listen on from environment variable, defaulting to 8080
// if environment variable is undefined
const port = process.env.PORT || 8080;

// Get directory to browse from environment variable, defaulting to /
// if environment variable is undefined.
const directory = process.env.DIRECTORY || "/";
// Set static directory to directory so we can serve files later
app.use(express.static(directory));
// Configure Express to use EJS
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Define route handler
app.get("*", ( req, res ) => {
    const requestedPath = directory + req.url;
    logger.info(req.ip + " is accessing " + req.url);
    // Ensure that the requested path exists
    if (fs.existsSync(requestedPath)) {
        // Test if given path is a file or a directory
        const stats = fs.statSync(requestedPath);
        logger.info(stats.isFile());
        // Return the file index if directory, else return the file content
        if (!stats.isFile()) {
            // Get directory contents
            const pathContents = fs.readdirSync(requestedPath);
            // Ensure path contents is entirely real files
            const pathContentsFiltered = pathContents.filter(item => fs.existsSync(requestedPath + item));
            // Separate directory contents into paths and files
            const files = pathContentsFiltered.filter(item => fs.statSync(requestedPath + item).isFile());
            const directories = pathContentsFiltered.filter(item => fs.statSync(requestedPath + item).isDirectory());
            // Render directory screen
            res.render("browse", {
                "path": req.url,
                "directories": directories,
                "files": files
            });
        }
    } else {
        // Path does not exist
        logger.info(`Path ${requestedPath} does not exist!`);
        res.send("File not found");
    }
});

// Start the server
app.listen(port, () => {
    logger.info(`Started server on port ${port}`);
});