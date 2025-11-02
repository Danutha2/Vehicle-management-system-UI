import { Injectable, NgZone } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { BehaviorSubject } from 'rxjs';

export interface AppNotification {
  id: string;
  message: string;
  timestamp: number;
  fileName?: string | null;
  type?: 'info' | 'success' | 'error';
}

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private socket: Socket | null = null;

  private notificationsSubject = new BehaviorSubject<AppNotification[]>([]);
  notifications$ = this.notificationsSubject.asObservable();

  constructor(private ngZone: NgZone) {}

  connect(email: string) {
    if (this.socket) {
      console.warn('⚠️ WebSocket already connected');
      return;
    }

    const url = `ws://localhost:3005/notification`;

    this.socket = io(url, {
      query: { email },
      transports: ['websocket'],
    });

    this.socket.on('connect', () => {
      console.log(`✅ Socket.IO connected for ${email}`);
      this.socket?.emit('register-email', { email });
    });

    // 📩 Handle both export + import notifications
    const handleNotification = (msg: any, source: string) => {
      console.log(`📨 Received ${source} notification:`, msg);

      const newNotification: AppNotification = {
        id: msg.id ?? Date.now().toString(),
        message: msg.message ?? 'Unknown notification',
        timestamp: msg.timestamp ?? Date.now(),
        fileName: msg.fileName ?? null,
        type: 'info',
      };

      this.ngZone.run(() => {
        const currentNotifications = this.notificationsSubject.value;
        this.notificationsSubject.next([...currentNotifications, newNotification]);
      });
    };

    this.socket.on('export-notification', (msg) => handleNotification(msg, 'export'));
    this.socket.on('import-notification', (msg) => handleNotification(msg, 'import'));

    this.socket.on('disconnect', (reason) => {
      console.log('🔒 Socket.IO disconnected:', reason);
      this.socket = null;
    });

    this.socket.on('connect_error', (err) => {
      console.error('❌ Connection Error:', err.message);
      this.pushLocalNotification(`Connection failed: ${err.message}`, 'error');
    });
  }

  pushLocalNotification(message: string, type: 'info' | 'success' | 'error' = 'info') {
    this.ngZone.run(() => {
      const current = this.notificationsSubject.value;
      const newNotification: AppNotification = {
        id: Date.now().toString(),
        message,
        timestamp: Date.now(),
        type,
      };
      this.notificationsSubject.next([...current, newNotification]);
    });
  }

  removeNotificationById(id: string) {
    const current = this.notificationsSubject.value.filter((n) => n.id !== id);
    this.notificationsSubject.next(current);
  }
}
