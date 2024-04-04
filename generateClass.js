const fs = require("fs");
const path = require("path");
const vscode = require("vscode");

/**
 * @param {string} className
 */
function createClass(className) {
    const hFileName = className + ".h";
    const cppFileName = className + ".cpp";
    const rootPath = vscode.workspace.workspaceFolders[0].uri.fsPath;

    if (
        searchFiles(hFileName, rootPath) ||
        searchFiles(cppFileName, rootPath)
    ) {
        vscode.window.showErrorMessage(
            "Error: The class " +
                className +
                " already exists in the current workspace. Please choose a different name."
        );
        return;
    }

    const hFilePath = path.join(rootPath, hFileName);
    const cppFilePath = path.join(rootPath, cppFileName);

    fs.writeFileSync(hFilePath, generateHeaderFileContent(className));
    fs.writeFileSync(cppFilePath, generateCppFileContent(className));

    vscode.window.showInformationMessage(
        "Class " + className + " has been created."
    );
}

/**
 * @param {string} name
 * @param {string} [dir]
 */
function searchFiles(name, dir) {
    const files = fs.readdirSync(dir);
    for (let i = 0; i < files.length; i++) {
        const filePath = path.join(dir, files[i]);
        const stat = fs.statSync(filePath);
        if (stat.isDirectory()) {
            if (searchFiles(name, filePath)) {
                return true;
            }
        } else if (path.basename(filePath) === name) {
            return true;
        }
    }
    return false;
}

/**
 * @param {string} className
 */
function generateHeaderGuard(className) {
    const upperCaseClassName = className.toUpperCase();
    return `#ifndef ${upperCaseClassName}_H
#define ${upperCaseClassName}_H`;
}

/**
 * @param {string} className
 */
function generateHeaderFileContent(className) {
    const headerGuard = generateHeaderGuard(className);
    return `${headerGuard}

class ${className} {
public:
        
};

#endif // ${className.toUpperCase()}_H`;
}

/**
 * @param {string} className
 */
function generateCppFileContent(className) {
    return `#include "${className}.h"`;
}

module.exports = {
    createClass,
};
