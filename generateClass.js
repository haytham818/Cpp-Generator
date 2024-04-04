const fs = require("fs");
const path = require("path");
const vscode = require("vscode");
const os = require("os");

/**
 * Creates a new class with the given name.
 * @param {string} className - The name of the class to create.
 */
function createClass(className) {
    const hFileName = className + ".h";
    const cppFileName = className + ".cpp";
    const rootPath = vscode.workspace.workspaceFolders[0].uri.fsPath;
    const config = vscode.workspace.getConfiguration("cppgenerator");
    const addTo = config.get("addToCmake");
    const addHeader = config.get("addHeader");

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

    if (addTo) {
        addToCmake(className, addHeader);
    }

    vscode.window.showInformationMessage(
        "Class " + className + " has been created."
    );
}

/**
 * Searches for a file with the specified name in the given directory and its subdirectories.
 * @param {string} name - The name of the file to search for.
 * @param {string} dir - The directory to start the search from.
 * @returns {boolean} - Returns true if the file is found, false otherwise.
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
 * Generates the header guard for a C++ class.
 *
 * @param {string} className - The name of the class.
 * @param {boolean} ispragma - Indicates whether to use #pragma once or ifndef/define.
 * @returns {string} The generated header guard.
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
 * Generates the content for a C++ header file for a given class.
 * @param {string} className - The name of the class.
 * @returns {string} The content of the header file.
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

/**
 * Generates the author comment for the generated class file.
 * @returns {string} The author comment.
 */
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
    if (authorName.trim() === "") {
        authorName = os.userInfo().username;
    }
    let authorComment = `//
// Created by ${authorName} on ${currentDate}.\n`;
    if (authorEmail.trim() !== "") {
        authorComment += `// Contact: ${authorEmail}\n`;
    }
    authorComment += "//\n\n";
    return authorComment;
}

/**
 * Adds a source file and header file (optional) to the CMakeLists.txt file in the current workspace.
 * @param {string} className - The name of the class to be added.
 * @param {boolean} addHeader - Whether to add the header file or not.
 */
function addToCmake(className, addHeader) {
    const rootPath = vscode.workspace.workspaceFolders[0].uri.fsPath;
    if (!fs.existsSync(path.join(rootPath, "CMakeLists.txt"))) {
        vscode.window.showErrorMessage(
            "Error: CMakeLists.txt file not found in the current workspace."
        );
        return;
    }

    const cmakeFilePath = path.join(rootPath, "CMakeLists.txt");
    const cmakeFileContent = fs.readFileSync(cmakeFilePath, "utf8");
    const lines = cmakeFileContent.split("\n");

    let targetLineIndex = -1;
    for (let i = lines.length - 1; i >= 0; i--) {
        if (lines[i].includes("add_executable")) {
            targetLineIndex = i;
            break;
        }
    }

    if (targetLineIndex !== -1) {
        const rightParenthesis = lines[targetLineIndex].indexOf(")");
        let newLine =
            lines[targetLineIndex].substring(0, rightParenthesis) +
            " " +
            className +
            ".cpp";
        if (addHeader) {
            newLine += " " + className + ".h";
        }
        newLine += ")";
        lines[targetLineIndex] = newLine;
    }

    const newCmakeFileContent = lines.join("\n");
    fs.writeFileSync(cmakeFilePath, newCmakeFileContent, "utf8");
}

module.exports = {
    createClass,
};
