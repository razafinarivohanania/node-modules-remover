const fs = require('fs');
const path = require('path');
const configuration = require('./configuration.json');

function getDirectoriesPath(directoryPath) {
    console.log(`Get directories path in : ${directoryPath}`);
    const directoriesPath = fs.readdirSync(directoryPath)
        .map(directoryOrFile => path.resolve(directoryPath, directoryOrFile))
        .filter(directoryOrFiles => isDirectory(directoryOrFiles));
    directoriesPath.forEach(directoryPath => console.log(`Found : ${directoryPath}`));
    return directoriesPath;
}

function isDirectory(directoryOrFilePath) {
    return fs.lstatSync(directoryOrFilePath).isDirectory();
}

function isNodeModulesDirectory(directoryOrFilePath) {
    return directoryOrFilePath.includes('/node_modules/') ||
        directoryOrFilePath.endsWith('/node_modules');
}

function removeDirectory(directoryPath) {
    console.log(`Remove directory : ${directoryPath}`);
    fs.rmSync(directoryPath, { recursive: true, force: true });
}

function removeNodeModules(baseDirectoryPath) {
    const directoriesPath = getDirectoriesPath(baseDirectoryPath);
    for (const directoryPath of directoriesPath) {
        if (isNodeModulesDirectory(directoryPath)) {
            removeDirectory(directoryPath);
        } else {
            removeNodeModules(directoryPath);
        }
    }
}

removeNodeModules(configuration.directory);