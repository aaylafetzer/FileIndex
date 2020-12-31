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
            "file": shelljs.exec(`file ${requestedPath + index} | awk '{for(i=2;i<=NF;i++) printf $i" "; print ""}'`),
            "size": shelljs.exec(`du -h ${requestedPath + index} | awk '{print $1}'`)
        });
    }
    return output;
}