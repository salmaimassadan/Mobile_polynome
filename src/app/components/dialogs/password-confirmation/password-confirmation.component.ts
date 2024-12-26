import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-password-confirmation',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatDialogModule],
  template: `
    <h2 mat-dialog-title>Confirm Password Change</h2>
    <mat-dialog-content>
      Are you sure you want to change your password?
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancel</button>
      <button mat-raised-button color="primary" [mat-dialog-close]="true">Confirm</button>
    </mat-dialog-actions>
  `,
  styles: [`
    :host {
      display: block;
      padding: 20px;
    }
    h2 {
      margin: 0 0 16px;
      color: #2c3e50;
    }
    mat-dialog-content {
      margin-bottom: 20px;
      color: #64748b;
    }
    mat-dialog-actions {
      padding: 8px 0;
    }
  `]
})
export class PasswordConfirmationComponent {
  constructor(public dialogRef: MatDialogRef<PasswordConfirmationComponent>) {}
}