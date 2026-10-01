import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-toast-viewport',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-viewport" aria-label="Notificações" aria-atomic="false">
      <div
        *ngFor="let toast of notifications.messages()"
        class="toast"
        [ngClass]="'toast--' + toast.type"
        [attr.role]="toast.type === 'error' ? 'alert' : 'status'"
        [attr.aria-live]="toast.type === 'error' ? 'assertive' : 'polite'"
      >
        <span class="toast-indicator" aria-hidden="true"></span>
        <p>{{ toast.message }}</p>
        <button
          type="button"
          class="toast-close"
          (click)="notifications.dismiss(toast.id)"
          [attr.aria-label]="'Dispensar: ' + toast.message"
        >
          <span aria-hidden="true">×</span>
        </button>
      </div>
    </div>
  `,
  styles: [`
    .toast-viewport {
      position: fixed;
      z-index: 1000;
      top: 1rem;
      right: 1rem;
      display: grid;
      width: min(400px, calc(100vw - 2rem));
      gap: 0.6rem;
      pointer-events: none;
    }

    .toast {
      display: grid;
      grid-template-columns: 4px minmax(0, 1fr) 36px;
      align-items: center;
      gap: 0.75rem;
      min-height: 62px;
      padding: 0.65rem 0.7rem;
      border: 1px solid var(--border);
      border-radius: var(--radius-md);
      background: var(--surface);
      box-shadow: var(--shadow-md);
      pointer-events: auto;
      animation: toast-enter 180ms ease both;
    }

    .toast-indicator {
      width: 4px;
      height: 28px;
      border-radius: 4px;
      background: var(--primary);
    }

    .toast--success .toast-indicator { background: var(--success); }
    .toast--error .toast-indicator { background: var(--danger); }
    .toast--info .toast-indicator { background: var(--primary); }

    .toast p {
      margin: 0;
      color: var(--text);
      font-size: 0.9rem;
      overflow-wrap: anywhere;
    }

    .toast-close {
      display: grid;
      width: 36px;
      min-height: 36px;
      padding: 0;
      place-items: center;
      border: 0;
      background: transparent;
      color: var(--text-muted);
      font-size: 1.3rem;
    }

    .toast-close:hover {
      background: var(--bg);
      color: var(--text);
    }

    @keyframes toast-enter {
      from { opacity: 0; transform: translateY(-6px); }
      to { opacity: 1; transform: translateY(0); }
    }

    @media (max-width: 480px) {
      .toast-viewport {
        top: 0.6rem;
        right: 0.6rem;
        width: calc(100vw - 1.2rem);
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class ToastViewportComponent {
  constructor(public notifications: ToastService) {}
}