import { ConfirmService } from './confirm.service';

describe('ConfirmService', () => {
  it('opens the confirmation and resolves true when confirmed', async () => {
    const service = new ConfirmService();
    const result = service.confirm('Confirmar exclusão', 'Excluir esta caixa?');

    expect(service.isOpen()).toBe(true);
    expect(service.title()).toBe('Confirmar exclusão');
    expect(service.message()).toBe('Excluir esta caixa?');

    service.onConfirm();

    await expect(result).resolves.toBe(true);
    expect(service.isOpen()).toBe(false);
  });

  it('resolves false when the confirmation is dismissed', async () => {
    const service = new ConfirmService();
    const result = service.confirm('Confirmar exclusão', 'Excluir esta caixa?');

    service.onClose();

    await expect(result).resolves.toBe(false);
    expect(service.isOpen()).toBe(false);
  });
});
