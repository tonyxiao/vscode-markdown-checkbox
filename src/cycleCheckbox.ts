import * as vscode from 'vscode';
import { TextEditor, TextLine } from 'vscode';
import * as helpers from './helpers';
import { createCheckboxOfLine } from './createCheckbox';
import { toggleCheckboxOfLine } from './toggleCheckbox';

/** Cycle a single line: no checkbox → [ ] → [x] → no checkbox */
const cycleCheckboxOfLine = async (
  editor: TextEditor,
  line: TextLine
): Promise<void> => {
  const checkbox = helpers.getCheckboxOfLine(line);

  if (!checkbox) {
    // no checkbox → add unchecked [ ]
    await createCheckboxOfLine(editor, line);
  } else if (!checkbox.checked) {
    // unchecked [ ] → checked [x]
    await toggleCheckboxOfLine(line, true);
  } else {
    // checked [x] → remove checkbox entirely
    // First uncheck (cleans up italic/strikethrough/date formatting)
    await toggleCheckboxOfLine(line, false);
    // Re-read the line, then delete the [ ] checkbox
    const updatedLine = editor.document.lineAt(line.lineNumber);
    await createCheckboxOfLine(editor, updatedLine);
  }
};

/** Cycle checkbox state for each line in the current selection or cursor position */
export const cycleCheckbox = async () => {
  const editor = helpers.getEditor();

  if (editor.selection.isEmpty) {
    const cursorPosition = helpers.getCursorPosition();
    const line = editor.document.lineAt(cursorPosition.line);
    await cycleCheckboxOfLine(editor, line);
    const endLine = editor.document.lineAt(editor.selection.end.line);
    const selectionPosition = new vscode.Position(endLine.lineNumber, 20000);
    helpers.getEditor().selection = new vscode.Selection(
      selectionPosition,
      selectionPosition
    );
  } else {
    const selection = editor.selection;
    for (let r = selection.start.line; r <= selection.end.line; r++) {
      const line = editor.document.lineAt(r);
      await cycleCheckboxOfLine(editor, line);
    }
  }
};
