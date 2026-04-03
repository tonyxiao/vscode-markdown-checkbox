import * as vscode from 'vscode';
import * as helpers from '../helpers';
import { cycleCheckbox } from '../cycleCheckbox';

export const cycleCheckboxCommand = vscode.commands.registerCommand(
  'markdown-checkbox.cycleCheckbox',
  () => {
    if (!helpers.shouldActivate()) {
      return;
    }

    try {
      cycleCheckbox();
    } catch (error) {
      console.log(error);
    }
  }
);
