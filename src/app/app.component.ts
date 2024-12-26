import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  template: `
    <div class="app-container">
      <h1 class="app-title">Polynomial Calculator</h1>
      <router-outlet></router-outlet>
    </div>
  `,
  styles: [`
    .app-container {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .app-title {
      font-size: 2.5rem;
      font-weight: 700;
      background: linear-gradient(135deg, #4f46e5, #818cf8);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin: 2rem 0;
      padding: 0.5rem 1.5rem;
      letter-spacing: -0.025em;
      animation: fadeIn 0.6s ease-out;
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(-10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @media (max-width: 480px) {
      .app-title {
        font-size: 2rem;
      }
    }
  `]
})
export class AppComponent {
  title = 'Polynomial Calculator';
}