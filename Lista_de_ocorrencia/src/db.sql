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
    FOREIGN KEY (condominio_id) REFERENCES condominio(id)
);

create table if not exists administrador (
    id serial primary key,
  condominio_id INTEGER NOT NULL,
 nome text not null,
 email text not null,
 senha_hash text not null,
  status TEXT NOT NULL,
  FOREIGN KEY (condominio_id) REFERENCES condominio(id)
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
    FOREIGN KEY (condominio_id) REFERENCES condominio(id)
);

drop table if exists porteiro;

create table porteiro (
    id serial primary key,
    condominio_id INTEGER NOT NULL,
    nome TEXT NOT NULL,
    email TEXT NOT NULL,
  telefone VARCHAR(20) NOT NULL,
  senha_hash TEXT NOT NULL,
  status TEXT NOT NULL,
    FOREIGN KEY (condominio_id) REFERENCES condominio(id)
);
drop table if exists ocorrencias;

create table ocorrencias (
    id serial primary key,
   morador_id INTEGER NOT NULL,
  sindico_id INTEGER NOT NULL,
    assunto TEXT NOT NULL,
    tipo_ocorrencia TEXT NOT NULL,
  nota TEXT NOT NULL,
  data_ocorrido DATE,
  foto BYTEA NOT NULL,
  FOREIGN KEY (morador_id) REFERENCES moradores(id),
  FOREIGN KEY (sindico_id) REFERENCES sindicos(id)
);