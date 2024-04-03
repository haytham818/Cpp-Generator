// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");
const fs = require("fs");

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
    let disposable = vscode.commands.registerCommand(
        "extension.createClass",
        function () {
            // The code you place here will be executed every time your command is executed

            // Display a message box to the user
            vscode.window
                .showInputBox({ prompt: "Enter the class name" })
                .then((className) => {
                    if (className) {
                        createClass(className);
                    }
                });
        }
    );

    context.subscriptions.push(disposable);
}

function createClass(className) {
    const hFileName = className + ".h";
    const cppFileName = className + ".cpp";

    fs.writeFileSync(hFileName, generateHeaderFileContent(className));
    fs.writeFileSync(cppFileName, generateCppFileContent(className));

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

function generateHeadInfo() {}

function generateHeaderFileContent(className) {
    return `#ifndef ${className.toUpperCase()}_H
#define ${className.toUpperCase()}_H

class ${className} {
public:
    ${className}();
    ~${className}();
    
    // TODO: Add class methods and member variables here
    
private:
    // TODO: Add private member variables here
    
};

#endif // ${className.toUpperCase()}_H`;
}

function generateCppFileContent(className) {
    return `#include "${className}.h"`;
}

