export type Cliente = {
    uuid: string;
    nome: string;
    cpf: string;
    telefone: string;
    unidadeUuid: string;
    statusAtivo: boolean;
  };
  
  export type ClienteCriar = Omit<Cliente, 'uuid'>;
  