import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Html5Qrcode } from 'html5-qrcode';

@Component({
  selector: 'app-qr-scanner',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './qr-scanner.component.html',
  styleUrl: './qr-scanner.component.css'
})
export class QrScannerComponent implements OnInit, OnDestroy{

  html5QrCode: Html5Qrcode | undefined;
  qrResult: string = 'N/A';
  isScanning: boolean = false;
  hasCamera: boolean = false;
  cameraError: string = '';

  ngOnInit(): void {
    this.checkCameraAvailability();
  }

  checkCameraAvailability(): void {
    navigator.mediaDevices.enumerateDevices()
      .then(devices => {
        const videoInput = devices.find(device => device.kind === 'videoinput');
        this.hasCamera = !!videoInput;
        if (!this.hasCamera) {
          this.cameraError = 'No se encontró ninguna cámara en este dispositivo.';
        }
      })
      .catch(err => {
        console.error('Error al enumerar dispositivos:', err);
        this.cameraError = 'Error al acceder a los dispositivos de medios.';
      });
  }

  // Solicitar permisos y comenzar el escaneo
  startScanning(): void {
    if (!this.hasCamera) {
      this.cameraError = 'No hay cámaras disponibles para escanear.';
      return;
    }

    this.isScanning = true;
    const qrCodeRegionId = 'qr-reader';
    this.html5QrCode = new Html5Qrcode(qrCodeRegionId);

    const config = { fps: 10, qrbox: 250 };

    // Opcional: Puedes especificar la cámara que deseas usar
    // const cameraId = ...;

    this.html5QrCode.start(
      { facingMode: 'environment' }, // Preferir cámara trasera en dispositivos móviles
      config,
      (decodedText, decodedResult) => {
        this.qrResult = decodedText;
        console.log(decodedResult);
        this.stopScanning();
      },
      (errorMessage) => {
        // Puedes mostrar mensajes de error o actualizaciones en la UI
        console.warn(`Error de escaneo: ${errorMessage}`);
      }
    ).catch((err) => {
      console.error(`Error al iniciar el escáner: ${err}`);
      this.cameraError = 'No se pudo iniciar el escáner. Asegúrate de que el navegador tenga acceso a la cámara.';
      this.isScanning = false;
    });
  }

  // Detener el escaneo y limpiar
  stopScanning(): void {
    if (this.html5QrCode) {
      this.html5QrCode.stop().then(() => {
        this.html5QrCode?.clear();
        this.isScanning = false;
      }).catch((err) => {
        console.error(`Error al detener el escáner: ${err}`);
        this.cameraError = 'No se pudo detener el escáner correctamente.';
      });
    }
  }

  ngOnDestroy(): void {
    this.stopScanning();
  }

}
