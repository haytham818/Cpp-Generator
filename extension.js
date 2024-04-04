// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");
const creat = require("./generateClass");

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
    let createClassDisposed = vscode.commands.registerCommand(
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
                                    creat.createClass(className);
                                }
                            });
                    } else if (selectedOption === "Header Only") {
                    } else if (selectedOption === "Header and source") {
                    }
                });
        }
    );

    context.subscriptions.push(createClassDisposed);
}

// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
    activate,
    deactivate,
};

