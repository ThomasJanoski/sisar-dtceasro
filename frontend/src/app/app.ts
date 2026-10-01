import { Component, signal, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
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
