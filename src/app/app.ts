import { Component, ViewChild } from '@angular/core';
import { QRCodeComponent } from 'angularx-qrcode';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [QRCodeComponent, FormsModule],
  templateUrl: './app.html',
  styleUrls: ['./app.scss'],
})
export class App {
  public urlParaQR: string = 'https://www.google.com';
  public tamanoDescarga: number = 400; // Tamaño por defecto para descarga
  public tamanoVisual: number = 200; // Tamaño para visualización en pantalla

  @ViewChild(QRCodeComponent, { static: false }) qrCodeComponent!: QRCodeComponent;

  // Método para actualizar el tamaño visual cuando cambia el selector
  actualizarTamanoVisual(): void {
    // El tamaño visual se mantiene fijo para no afectar el diseño
    this.tamanoVisual = 200;
  }

  public async descargarQR(): Promise<void> {
    if (!this.urlParaQR || this.urlParaQR.trim() === '') {
      alert('Por favor, ingresa una URL válida');
      return;
    }

    try {
      // Crear un canvas temporal con el tamaño seleccionado
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        console.error('No se pudo obtener el contexto del canvas');
        return;
      }

      // Establecer el tamaño del canvas según la selección
      const size = this.tamanoDescarga;
      canvas.width = size;
      canvas.height = size;

      // Obtener el canvas del QR actual (el que se muestra)
      const qrElement = this.qrCodeComponent.qrcElement.nativeElement;
      const originalCanvas = qrElement.querySelector('canvas') as HTMLCanvasElement;

      if (!originalCanvas) {
        console.error('No se encontró el canvas del QR');
        return;
      }

      // Dibujar el QR original en el canvas temporal con el tamaño aumentado
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(originalCanvas, 0, 0, size, size);

      // Crear y descargar la imagen
      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png');
      link.download = `codigo-qr-${size}x${size}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

    } catch (error) {
      console.error('Error al generar el QR para descarga:', error);
      alert('Ocurrió un error al generar el código QR');
    }
  }
}
