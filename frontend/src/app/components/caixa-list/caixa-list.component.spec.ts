import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { ConfirmService } from '../../services/confirm.service';
import { ToastService } from '../../services/toast.service';
import { CaixaListComponent } from './caixa-list.component';

describe('CaixaListComponent migrationStatus', () => {
  const component = new CaixaListComponent(
    {} as ApiService,
    {} as ActivatedRoute,
    {} as ToastService,
    new ConfirmService(),
  );

  it('warns when the current-stage period ends this year', () => {
    const status = component.migrationStatus({ ID: 1, TIPO: 'Corrente', CORRENTE: '2024-2026' }, 2026);

    expect(status?.severity).toBe('due');
    expect(status?.message).toContain('termina neste ano');
  });

  it('warns after the intermediate-stage period without using final destination', () => {
    const status = component.migrationStatus({
      ID: 2,
      TIPO: 'INTERMEDIARIO',
      INTERMEDIARIO: '2020-2024',
      DESTFINAL: 'ELIMINAÇÃO',
    }, 2026);

    expect(status?.severity).toBe('overdue');
    expect(status?.message).toContain('Verifique a situação física');
    expect(status?.message).not.toContain('ELIMINAÇÃO');
  });

  it('does not warn before the period ends or for an invalid period', () => {
    expect(component.migrationStatus({ ID: 3, TIPO: 'PERMANENTE', CORRENTE: '2020' }, 2026)).toBeNull();
    expect(component.migrationStatus({ ID: 4, TIPO: 'Corrente', CORRENTE: 'indeterminado' }, 2026)).toBeNull();
  });
});