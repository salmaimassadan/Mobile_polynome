import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ErrorStateMatcher } from '@angular/material/core';
import { FormControl, FormGroupDirective, NgForm } from '@angular/forms';
import { trigger, transition, style, animate } from '@angular/animations';
import { PolynomialService } from '../../services/polynomial.service';
import { MatMenuModule } from '@angular/material/menu';
import { Router } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { LogoutConfirmationComponent } from '../dialogs/logout-confirmation/logout-confirmation.component';

export class CustomErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

interface PolynomialResult {
  answer: number;
  pol: number[];
}

@Component({
  selector: 'app-polynomial-input',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatDividerModule,
    MatIconModule,
    MatTooltipModule,
    MatMenuModule,
    MatDialogModule
  ],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-10px)' }),
        animate('200ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ opacity: 0, transform: 'translateY(-10px)' }))
      ])
    ])
  ],
  templateUrl: './polynomial-input.component.html',
  styleUrls: ['./polynomial-input.component.css']
})
export class PolynomialInputComponent {
  polynomialForm!: FormGroup;
  isLoading = false;
  result: PolynomialResult | null = null;
  userHistory: any[] = [];
  showHistory = false;
  matcher = new CustomErrorStateMatcher();
  readonly MAX_COEFFICIENTS = 10;

  constructor(
    private fb: FormBuilder,
    private polynomialService: PolynomialService,
    private snackBar: MatSnackBar,
    private router: Router,
    private dialog: MatDialog
  ) {
    this.initForm();
  }

  logout(): void {
    const dialogRef = this.dialog.open(LogoutConfirmationComponent, {
      width: '400px',
      panelClass: 'logout-dialog'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        localStorage.removeItem('token');
        this.showMessage('Successfully logged out', 'success');
        this.router.navigate(['/login']);
      }
    });
  }
  navigateToChangePassword(): void {
    this.router.navigate(['/change-password']);
  }

  private initForm(): void {
    this.polynomialForm = this.fb.group({
      coefficients: this.fb.array([this.createCoefficientField()], [
        Validators.required,
        Validators.maxLength(this.MAX_COEFFICIENTS)
      ])
    });
  }

  loadUserHistory(): void {
    this.polynomialService.getUserHistory().subscribe({
      next: (history: any[]) => {
        console.log('Raw history data:', history);
        this.userHistory = history.map(item => {
          // Formatter la racine avec 2 décimales
          const racine = parseFloat(item.racine).toFixed(2);
          
          // Calculer le polynôme quotient à partir des coefficients
          // Réduire le degré de 1 en enlevant le dernier coefficient
          const quotientCoeffs = item.coefficients.slice(0, -1);
          
          // Construire le quotient au format désiré
          const quotient = `(x - (${racine})) * (${this.formatPolynomial(quotientCoeffs)})`;

          return {
            polynome_id: item.polynome_id,
            coefficients: item.coefficients,
            racine: racine,
            quotient: quotient,
            owner: item.owner,
            date: item.date
          };
        });
      },
      error: (error: any) => {
        console.error('Error loading user history:', error);
        this.showMessage('Error loading history', 'error');
      }
    });
  }

  toggleHistory(): void {
    this.showHistory = !this.showHistory;
    if (this.showHistory) {
      this.loadUserHistory();
    }
  }

  

  createCoefficientField(): FormControl {
    return this.fb.control('', [
      Validators.required,
      Validators.pattern(/^-?\d*\.?\d*$/)
    ]);
  }

  get coefficients(): FormArray {
    return this.polynomialForm.get('coefficients') as FormArray;
  }

  getPlaceholder(index: number): string {
    return `e.g., ${index === 0 ? '1' : index === 1 ? '-2' : '3'}`;
  }

  getHint(index: number): string {
    const power = this.coefficients.length - index - 1;
    return `Coefficient for x${power > 1 ? `^${power}` : power === 1 ? '' : '⁰'}`;
  }

  addCoefficientField(): void {
    if (this.coefficients.length < this.MAX_COEFFICIENTS) {
      this.coefficients.push(this.createCoefficientField());
    } else {
      this.showMessage('Maximum number of coefficients reached', 'warning');
    }
  }

  removeCoefficientField(index: number): void {
    if (this.coefficients.length > 1) {
      this.coefficients.removeAt(index);
    }
  }

  resetForm(): void {
    this.polynomialForm.reset();
    while (this.coefficients.length > 1) {
      this.coefficients.removeAt(1);
    }
    this.result = null;
  }

  private formatResult(result: PolynomialResult): PolynomialResult {
    return {
      answer: parseFloat(result.answer.toFixed(2)),
      pol: result.pol.map(coef => parseFloat(coef.toFixed(2)))
    };
  }
  
  submitPolynomial(): void {
    if (this.polynomialForm.invalid) {
      this.showMessage('Please fix the errors before submitting', 'error');
      return;
    }
  
    this.isLoading = true;
    const coefficients = this.coefficients.value
      .map(Number)
      .filter((coef: number) => !isNaN(coef));
  
    if (coefficients.length === 0) {
      this.showMessage('Please enter at least one valid coefficient', 'error');
      this.isLoading = false;
      return;
    }
  
    this.polynomialService.savePolynomial(coefficients).subscribe({
      next: (response: PolynomialResult) => {
        this.result = this.formatResult(response);
        this.isLoading = false;
        this.showMessage('Calculation completed successfully!', 'success');
      },
      error: (error: any) => {
        this.isLoading = false;
        let errorMessage = 'An error occurred while calculating the polynomial';
        
        if (error.error?.message) {
          errorMessage = error.error.message;
        } else if (error.status === 0) {
          errorMessage = 'Unable to connect to the server. Please check your internet connection.';
        }
        
        this.showMessage(errorMessage, 'error');
        console.error('Error:', error);
      }
    });
  }
  
  public formatPolynomial(coefficients: number[]): string {
    if (!Array.isArray(coefficients) || coefficients.length === 0) {
      return '';
    }

    return coefficients
      .map((coef, index) => {
        if (coef === 0) return null;
        
        const power = coefficients.length - index - 1;
        let term = '';
        
        // Gestion du signe
        const absCoef = Math.abs(coef);
        const sign = coef < 0 ? '-' : index === 0 ? '' : '+';
        
        // Formatage du coefficient
        const coeffStr = absCoef === 1 && power > 0 ? '' : absCoef.toString();
        
        // Construction du terme
        if (power === 0) {
          term = `${sign}${coeffStr}`;
        } else if (power === 1) {
          term = `${sign}${coeffStr}x`;
        } else {
          term = `${sign}${coeffStr}x^${power}`;
        }
        
        return term;
      })
      .filter(term => term !== null)
      .join(' ')
      .trim() || '1';  // Retourner '1' si tous les coefficients sont nuls
  }


  private showMessage(message: string, type: 'success' | 'error' | 'warning'): void {
    const config = {
      duration: 5000,
      horizontalPosition: 'end' as const,
      verticalPosition: 'top' as const,
      panelClass: [`${type}-snackbar`]
    };

    this.snackBar.open(message, 'Close', config);
  }
}