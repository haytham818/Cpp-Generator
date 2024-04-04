const fs = require("fs");
const path = require("path");
const vscode = require("vscode");
const os = require("os");

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
 * @param {boolean} ispragma
 */
function generateHeaderGuard(className, ispragma) {
    const upperCaseClassName = className.toUpperCase();
    if (ispragma) {
        return `#pragma once`;
    } else {
        return `#ifndef ${upperCaseClassName}_H
#define ${upperCaseClassName}_H`;
    }
}

/**
 * @param {string} className
 */
function generateHeaderFileContent(className) {
    const config = vscode.workspace.getConfiguration("cppgenerator");
    const ispragma = config.get("headerProctectStyel");
    const headerGuard = generateHeaderGuard(className, ispragma);
    let content = generateAuthorComment();
    content += `${headerGuard}

class ${className} {
public:
        
};`;

    if (!ispragma) {
        content += `\n#endif // ${className.toUpperCase()}_H`;
    }

    return content;
}

/**
 * @param {string} className
 */
function generateCppFileContent(className) {
    return `#include "${className}.h"`;
}

function generateAuthorComment() {
    const config = vscode.workspace.getConfiguration("cppgenerator");
    let authorName = config.get("userName");
    const authorEmail = config.get("userEmail");
    const userLocale = new Intl.DateTimeFormat().resolvedOptions().locale;
    const currentDate = new Date().toLocaleDateString(userLocale, {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    });
    if (authorName === "") {
        authorName = os.userInfo().username;
    }
    let authorComment = `//
// Created by ${authorName} on ${currentDate}.\n`;
    if (authorEmail !== "") {
        authorComment += `// Contact: ${authorEmail}\n`;
    }
    authorComment += "//\n\n";
    return authorComment;
}

module.exports = {
    createClass,
};
