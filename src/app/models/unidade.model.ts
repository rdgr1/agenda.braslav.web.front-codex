export type Unidade = {
    uuid: string
    nome: string,
}

export type UnidadeCriar = Omit<Unidade,'uuid'>