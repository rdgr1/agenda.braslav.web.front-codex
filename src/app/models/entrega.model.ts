export type Entrega = {
    uuid: string
    clienteUuid: string,
    data: string,
    hora: string,
    cep: string,
    endereco: string,
    unidadeUuid: string,
    ticket: number,
    tipoEntrega: string,
    statusEntrega: boolean,
    observacao: string,
    atualizadoEM: string,
    pendenteSync: boolean

}
 export type EntregaCriar = Omit<Entrega, "uuid">;