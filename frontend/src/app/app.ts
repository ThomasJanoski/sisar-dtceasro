import { Component, signal, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastViewportComponent } from './components/toast-viewport/toast-viewport.component';
import { ConfirmModalComponent } from './modal/confirm-modal.compontent';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ToastViewportComponent, ConfirmModalComponent],
  templateUrl: './app.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: ['./app.css'],
})
export class App implements OnInit {
  protected readonly title = signal('frontend');

  ngOnInit() {
    console.log('✅ App initialized successfully');
  }
}
