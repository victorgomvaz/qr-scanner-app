import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { QrScannerComponent } from './qr-scanner/qr-scanner.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, QrScannerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'qr-scanner-app';
}
