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
const app = express();

// Get port to listen on from environment variable, defaulting to 8080
// if environment variable is undefined
const port = process.env.PORT || 8080;

// Get directory to browse from environment variable, defaulting to /
// if environment variable is undefined.
const directory = process.env.DIRECTORY || "/";
// Set static directory to directory so we can serve files later
app.use(express.static(directory));

// Define route handler
app.get("*", ( req, res ) => {
    logger.info(req.ip + " is accessing " + req.url);
    // Ensure that the requested path exists
    if (fs.existsSync(directory + req.url)) {
        // Test if given path is a file or a directory
        const stats = fs.statSync(directory + req.url);
        logger.info(stats.isFile());
        // Return the file index if directory, else return the file content
        if (!stats.isFile()) {
            // Return directory
            res.send(
                fs.readdirSync(directory + req.url)
            );
        } else {
            // Serve the file
            res.send(
                fs.readFileSync(directory + req.url)
            );
        }
    } else {
        // Path does not exist
        logger.info(`Path ${directory + path} does not exist!`);
        res.send("File not found");
    }
});

logger.info(`Starting server on port ${port}`);
app.listen(port);