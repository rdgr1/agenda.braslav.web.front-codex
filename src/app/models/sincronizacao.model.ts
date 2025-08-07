export type Sincronizacao = {
    uuid: string
    unidadeUuid: string,
    usuarioUuid: string,
    tipo: string,
    status: string,
    entidade: string
    entidadeUuid: string

}

export type SincronizacaoCriar = Omit<Sincronizacao, "uuid">;