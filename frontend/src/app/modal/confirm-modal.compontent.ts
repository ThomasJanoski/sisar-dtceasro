import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmService } from '../services/confirm.service';

@Component({
    selector: 'app-confirm-modal',
    standalone: true,
    imports: [CommonModule],
    template: `
     <div class="modal-overlay" *ngIf="confirmService.isOpen()">
      <div class="modal-content">
        <h3>{{ confirmService.title() }}</h3>
        <p>{{ confirmService.message() }}</p>
        <div class="modal-actions">
          <button class="btn-cancel" (click)="confirmService.onClose()">Cancelar</button>
          <button class="btn-confirm" (click)="confirmService.onConfirm()">Excluir</button>
        </div>
      </div>
    </div>
  `,
    styles: [`
   .modal-overlay { 
      position: fixed !important; inset: 0 !important; background: rgba(0, 0, 0, 0.6); 
      display: flex !important; align-items: center !important; justify-content: center !important; 
      z-index: 99999 !important;
    }
    .modal-content { 
      background: white; padding: 2rem; border-radius: 8px; width: 90%; max-width: 400px; 
      box-shadow: 0 10px 30px rgba(0,0,0,0.5);
    }

  .modal-actions { display: flex; justify-content: flex-end; gap: 1rem; margin-top: 1.5rem; }
  .btn-cancel { background: #f0f0f0; border: 1px solid #ccc; padding: 0.6rem 1rem; cursor: pointer; border-radius: 4px; }
  .btn-confirm { background: #dc3545; color: white; border: none; padding: 0.6rem 1rem; cursor: pointer; border-radius: 4px; }
`]
})
export class ConfirmModalComponent {
    constructor(public confirmService: ConfirmService) { }
}