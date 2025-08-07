export type Usuario = {
    uuid: string
    nome: string,
    email: string,
    usuario: string,
    senha:string,
    status: string,
    system: string,
    roleUuids: [],
}

export type UsuarioCriar = Omit<Usuario, 'uuid'>