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

import * as fs from 'fs';
import shelljs from 'shelljs';

export function makeBreadcrumb(requestedUrl:string) {
    // Split path into links
    let pathChunks = requestedUrl.split("/");
    // Fix leading and trailing elements
    pathChunks = pathChunks.slice(1, pathChunks.length - 1);
    // Create dicts
    const pathChunksDicts = [];
    for (let index = 0; index < pathChunks.length; index++) {
        const display = pathChunks[index];
        const link = (pathChunks[index-1] || '') + `/${display}`;
        pathChunks[index] = link;
        pathChunksDicts.push(
            {
                "display": display,
                "link": link
            }
        )
    }
    // Prepend Root Directory
    pathChunksDicts.unshift(
        {
            "display": 'root',
            "link": '/'
        }
    )
    return pathChunksDicts;
}

export function directoryInfo(directories:string[], requestedPath:string) {
    const filtered = directories.filter(item => fs.statSync(requestedPath + item).isDirectory());
    const output = [];
    for (const index of filtered) {
        output.push({
            "name": index,
            "file": 'directory',
        });
    }
    return output;
}

export function fileInfo(files:string[], requestedPath:string) {
    const filtered = files.filter(item => fs.statSync(requestedPath + item).isFile());
    const output = [];
    for (const index of filtered) {
        output.push({
            "name": index,
            "file": shelljs.exec(`file \'${requestedPath + index}\' | cut -d':' -f 2- | cut -d' ' -f 2-`),
            "size": shelljs.exec(`du -h \'${requestedPath + index}\' | awk '{print $1}'`)
        });
    }
    return output;
}