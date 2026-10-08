// src/app/services/confirm.service.ts
import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ConfirmService {
    isOpen = signal(false);
    title = signal('');
    message = signal('');
    private resolveFunction?: (value: boolean) => void;

    confirm(title: string, message: string): Promise<boolean> {
        return new Promise((resolve) => {
            this.resolveFunction = resolve;
            this.title.set(title);
            this.message.set(message);
            this.isOpen.set(true);
        });
    }

    onConfirm() {
        this.finish(true);
    }

    onClose() {
        this.finish(false);
    }

    private finish(confirmed: boolean) {
        this.isOpen.set(false);
        const resolve = this.resolveFunction;
        this.resolveFunction = undefined;
        resolve?.(confirmed);
    }
}