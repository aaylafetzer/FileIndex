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
exports.fileInfo = exports.directoryInfo = exports.makeBreadcrumb = void 0;
const fs = __importStar(require("fs"));
const shelljs_1 = __importDefault(require("shelljs"));
const directorySize = process.env.SHOW_DIRECTORY_SIZE || false;
function makeBreadcrumb(requestedUrl) {
    // Split path into links
    let pathChunks = requestedUrl.split("/");
    // Fix leading and trailing elements
    pathChunks = pathChunks.slice(1, pathChunks.length - 1);
    // Create dicts
    const pathChunksDicts = [];
    for (let index = 0; index < pathChunks.length; index++) {
        const display = pathChunks[index];
        const link = (pathChunks[index - 1] || '') + `/${display}`;
        pathChunks[index] = link;
        pathChunksDicts.push({
            "display": display,
            "link": link
        });
    }
    // Prepend Root Directory
    pathChunksDicts.unshift({
        "display": 'root',
        "link": '/'
    });
    return pathChunksDicts;
}
exports.makeBreadcrumb = makeBreadcrumb;
function directoryInfo(directories, requestedPath) {
    const filtered = directories.filter(item => fs.statSync(requestedPath + item).isDirectory());
    const output = [];
    for (const index of filtered) {
        const newContent = {
            "name": index,
            "file": 'directory',
            "size": ""
        };
        if (directorySize) {
            newContent.size = shelljs_1.default.exec(`du -sh \'${requestedPath + index}\' | awk '{print $1}'`);
        }
        output.push(newContent);
    }
    return output;
}
exports.directoryInfo = directoryInfo;
function fileInfo(files, requestedPath) {
    const filtered = files.filter(item => fs.statSync(requestedPath + item).isFile());
    const output = [];
    for (const index of filtered) {
        output.push({
            "name": index,
            "file": shelljs_1.default.exec(`file \'${requestedPath + index}\' | cut -d':' -f 2- | cut -d' ' -f 2-`),
            "size": shelljs_1.default.exec(`du -h \'${requestedPath + index}\' | awk '{print $1}'`)
        });
    }
    return output;
}
exports.fileInfo = fileInfo;
//# sourceMappingURL=ui.js.map