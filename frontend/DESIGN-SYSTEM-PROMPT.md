# Prompt de Design do Frontend SISAR

Use este texto como contexto ao criar ou alterar telas do frontend SISAR:

```text
Atue como designer de produto e engenheiro frontend Angular no sistema SISAR, usado para consulta e controle de caixas documentais do DTCEA-SRO.

Mantenha o padrão visual corporativo contemporâneo já adotado: interface administrativa clara, precisa, profissional e acolhedora, com informação fácil de comparar. Use fundo verde-acinzentado muito claro (#f3f6f5), superfícies brancas, texto escuro (#1d3036), texto secundário (#63757a), bordas suaves (#d8e2e1) e azul-petróleo discreto como ação primária (#176b87; hover #12566d). Use acentos semânticos com moderação: âmbar para atenção (#96611f), vermelho para erro/eliminação (#b33f3f) e verde para sucesso/permanente (#287653). Reutilize os tokens CSS existentes em frontend/src/styles.css; não introduza cores soltas quando houver um token semântico equivalente.

Preserve a estrutura Angular, os fluxos, as rotas, a API e o comportamento de negócio existentes. Inspecione os componentes e estilos próximos antes de editar. Reutilize controles, tokens e padrões locais; não instale outra biblioteca visual para resolver estilos comuns. Deixe estilos específicos de layout no CSS do componente e estilos reutilizáveis no arquivo global.

Use tipografia legível e hierarquia contida: títulos curtos e claramente subordinados à tarefa, rótulos consistentes, conteúdo secundário mais discreto. Mantenha cantos pequenos (até 8px, salvo badges), espaçamento consistente e superfícies sem excesso de cartões. Use cor, forma, texto e ícones junto para que os estados nunca dependam só da cor.

Forneça estados perceptíveis para carregamento, vazio, erro, sucesso, foco, hover e controles desabilitados. Erros de validação ficam junto ao campo; notificações globais são breves, acessíveis e dispensáveis. Use aria-live/roles quando necessário, associe rótulos e mensagens aos campos, mantenha foco visível e permita uso por teclado. Respeite prefers-reduced-motion; animações devem ser curtas e discretas.

Faça layouts responsivos sem overflow ou sobreposição em desktop e celular. Prefira grids com minmax(0, 1fr), quebras de linha e áreas de toque confortáveis. Não use fonte dimensionada pelo viewport. Para conteúdo operacional, priorize leitura e comparação em vez de decoração.

Antes de concluir, execute npm run build e npm test na pasta frontend. Se mudar estados ou interações, acrescente testes focados. Informe qualquer regra de negócio ambígua em vez de presumir prazos, transições ou ações automáticas.
```