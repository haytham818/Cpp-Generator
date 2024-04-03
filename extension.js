// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");
const fs = require("fs");
const path = require("path");

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
    let creatClass = vscode.commands.registerCommand(
        "extension.createClass",
        function () {
            // The code you place here will be executed every time your command is executed
            // Display a message box to the user
            const options = ["Class", "Header Only", "Header and source"];
            vscode.window
                .showQuickPick(options, { placeHolder: "Select an option" })
                .then((selectedOption) => {
                    if (selectedOption === "Class") {
                        vscode.window
                            .showInputBox({
                                placeHolder: "Enter class name",
                            })
                            .then((className) => {
                                if (className) {
                                    createClass(className);
                                }
                            });
                    } else if (selectedOption === "Header Only") {
                    } else if (selectedOption === "Header and source") {
                    }
                });
        }
    );

    context.subscriptions.push(creatClass);
}

/**
 * @param {string} className
 */
function createClass(className) {
    const hFileName = className + ".h";
    const cppFileName = className + ".cpp";
    const rootPath = vscode.workspace.workspaceFolders[0].uri.fsPath;

    if (
        SearchFiles(hFileName, rootPath) ||
        SearchFiles(cppFileName, rootPath)
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

// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
    activate,
    deactivate,
};

/**
 * @param {string} name
 * @param {string} [dir]
 */
function SearchFiles(name, dir) {
    const files = fs.readdirSync(dir);
    for (let i = 0; i < files.length; i++) {
        const filePath = path.join(dir, files[i]);
        const stat = fs.statSync(filePath);
        if (stat.isDirectory()) {
            if (SearchFiles(name, filePath)) {
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

