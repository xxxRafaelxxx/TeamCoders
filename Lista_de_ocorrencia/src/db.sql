drop table if exists condominio;

create table condominio (
    id serial primary key,
    nome TEXT NOT NULL,
    email TEXT NOT NULL,
    senha_hash TEXT NOT NULL,
    moradores_total INTEGER,
    localizacao TEXT NOT NULL
);

drop table if exists moradores;

create table moradores (
    id serial primary key,
    condominio_id INTEGER NOT NULL,
    nome TEXT NOT NULL,
    email TEXT NOT NULL,
    telefone VARCHAR(20) NOT NULL,
    senha_hash TEXT NOT NULL,
    status TEXT NOT NULL,
    casa SMALLINT NOT NULL,
    FOREIGN KEY (condominio_id) REFERENCES condominio(id) ON DELETE CASCADE
);

drop table if exists administradores;

create table administradores (
    id serial primary key,
    condominio_id INTEGER NOT NULL,
    nome TEXT NOT NULL,
    email TEXT NOT NULL,
    senha_hash TEXT NOT NULL,
    status TEXT NOT NULL,
    FOREIGN KEY (condominio_id) REFERENCES condominio(id) ON DELETE CASCADE
);

drop table if exists sindicos;

create table sindicos (
    id serial primary key,
    condominio_id INTEGER NOT NULL,
    nome TEXT NOT NULL,
    email TEXT NOT NULL,
    telefone VARCHAR(20) NOT NULL,
    senha_hash TEXT NOT NULL,
    status TEXT NOT NULL,
    casa SMALLINT NOT NULL,
    FOREIGN KEY (condominio_id) REFERENCES condominio(id) ON DELETE CASCADE
);

drop table if exists porteiros;

create table porteiros (
    id serial primary key,
    condominio_id INTEGER NOT NULL,
    nome TEXT NOT NULL,
    email TEXT NOT NULL,
    telefone VARCHAR(20) NOT NULL,
    senha_hash TEXT NOT NULL,
    status TEXT NOT NULL,
    FOREIGN KEY (condominio_id) REFERENCES condominio(id) ON DELETE CASCADE
);

drop table if exists ocorrencias;

create table ocorrencias (
    id serial primary key,
    morador_id INTEGER ,
    sindico_id INTEGER ,
   porteiro_id INTEGER ,
    assunto TEXT NOT NULL,
    tipo_ocorrencia TEXT NOT NULL,
    nota TEXT NOT NULL,
    data_ocorrido DATE,
    foto BYTEA ,
    FOREIGN KEY (morador_id) REFERENCES moradores(id) ON DELETE CASCADE,
    FOREIGN KEY (sindico_id) REFERENCES sindicos(id) ON DELETE CASCADE,
  FOREIGN KEY (porteiro_id) REFERENCES porteiros(id) ON DELETE CASCADE
);

-- 1. Criar a função para atualizar moradores_total
CREATE OR REPLACE FUNCTION atualizar_moradores_total_func()
RETURNS TRIGGER AS $$
BEGIN
    -- Atualiza o campo moradores_total na tabela condominio
    UPDATE condominio c
    SET moradores_total = (
        SELECT COUNT(*)
        FROM moradores m
        WHERE m.condominio_id = c.id
    )
    WHERE c.id = NEW.condominio_id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 2. Criar o trigger para executar a função
CREATE TRIGGER atualizar_moradores_total_trigger
AFTER INSERT OR UPDATE OR DELETE ON moradores
FOR EACH ROW
EXECUTE FUNCTION atualizar_moradores_total_func();
