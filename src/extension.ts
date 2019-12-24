import * as vscode from "vscode";
import * as path from "path";
import { getDiskPath, getWebviewContent } from "./util";

let _panel: vscode.WebviewPanel;
let _editor: vscode.TextEditor;

export function activate(context: vscode.ExtensionContext) {
  const { css, js } = getAssets(context);

  let editor = vscode.window.activeTextEditor;
  if (!editor) {
    return "";
  }
  _editor = editor;

  setListeners(context, css, js);
}

function getAssets(context: vscode.ExtensionContext) {
  const css = getDiskPath(context, "index.css");
  const js = getDiskPath(context, "index.js");
  return { css, js };
}

// WebViewにテキストを送信
function sendText(panel: vscode.WebviewPanel, str: string, ) {
  panel.webview.postMessage({
    command: "text",
    text: _editor.document.getText()
  });
}

function setListeners(context: vscode.ExtensionContext, css: vscode.Uri, js: vscode.Uri) {
  // Activeなテキストエディタが切り替わる（GanttDownはプレビュー内容を変更する）
  vscode.window.onDidChangeActiveTextEditor(editor => {
    if (editor === undefined) {
      return;
    }

    // package.jsonのlanguageに定義した拡張子のみに反応させる
    // (切り替えた際に.ganttのみプレビューしたいため)
    if (editor.document.languageId !== "gantt") {
      return;
    }
    if (editor) {
      _editor = editor;
    }
    _panel.title = editor ? _editor.document.fileName : "No File";

    // ファイル内容をWebViewに送る
    sendText(_panel, _editor.document.getText());
  }, null, context.subscriptions);

  // ActiveなDocumentが編集される
  vscode.workspace.onDidChangeTextDocument((e: vscode.TextDocumentChangeEvent) => {
    sendText(_panel, _editor.document.getText());
  }, null, context.subscriptions);

  // showGanttコマンドを登録
  context.subscriptions.push(vscode.commands.registerCommand("ganttdown.showGantt", () => {
    const panel = vscode.window.createWebviewPanel("ganttDown", // Identifies
      "GanttDown", // Title
      vscode.ViewColumn.Beside, {
      localResourceRoots: [
        vscode.Uri.file(path.join(context.extensionPath, "assets"))
      ],
      enableScripts: true
    });
    _panel = panel;

    // WebViewへの表示内容（自力Renderの必要がある）
    panel.webview.html = getWebviewContent(css, js);
    _panel.onDidDispose((e) => {
      //TODO 対象editorを破棄する必要あり
    }, undefined, context.subscriptions);
    panel.webview.onDidReceiveMessage(message => {
      switch (message.command) {
        case "text":
          let textDocument = _editor.document;
          let invalidRange = new vscode.Range(0, 0, textDocument!.lineCount /*intentionally missing the '-1' */, 0);
          let fullRange = textDocument!.validateRange(invalidRange);
          _editor.edit(edit => edit.replace(fullRange, message.text));
          return;
      }
    }, null);
    sendText(_panel, _editor.document.getText());
  }));
}


export function deactivate() { }
