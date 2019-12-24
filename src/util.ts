import * as vscode from "vscode";
import * as path from "path";

export function getDiskPath(context: vscode.ExtensionContext, fileName: string) {
    const onDiskPath = vscode.Uri.file(path.join(context.extensionPath, "assets", fileName));
    return onDiskPath.with({ scheme: "vscode-resource" });
}

export function getWebviewContent(css: vscode.Uri, js: vscode.Uri) {
    return `<!DOCTYPE html>
	<html lang="en">
	<head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" href="${css}" />
	</head>
	<body>
        <div id="app"></div>
        <script src="${js}"></script>
	</body>
	</html>`;
}