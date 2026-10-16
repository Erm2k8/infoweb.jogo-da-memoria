-- Ranking global do Jogo da Memória.
-- Cole este arquivo inteiro no SQL Editor do Supabase e execute uma vez.
-- O site só lê as tabelas; gravar resultados passa pelas funções abaixo, que validam os dados.

create table if not exists resultados_solo (
  id bigint generated always as identity primary key,
  nome text not null check (char_length(nome) between 1 and 16),
  dificuldade text not null check (dificuldade in ('facil', 'medio', 'dificil')),
  jogadas int not null,
  segundos int not null check (segundos >= 0),
  criado_em timestamptz not null default now(),
  -- Cada nível tem 6, 10 ou 16 pares: menos jogadas que pares é impossível.
  check (jogadas >= case dificuldade when 'facil' then 6 when 'medio' then 10 else 16 end)
);

create index if not exists resultados_solo_ordem on resultados_solo (dificuldade, jogadas, segundos, id);

create table if not exists duelistas (
  chave text primary key,
  nome text not null check (char_length(nome) between 1 and 16),
  vitorias int not null default 0 check (vitorias >= 0),
  partidas int not null default 0 check (partidas >= vitorias)
);

alter table resultados_solo enable row level security;
alter table duelistas enable row level security;

drop policy if exists "ranking público" on resultados_solo;
create policy "ranking público" on resultados_solo for select to anon, authenticated using (true);
drop policy if exists "ranking público" on duelistas;
create policy "ranking público" on duelistas for select to anon, authenticated using (true);

-- Grava uma partida solo e devolve { id, posicao }; posicao é null fora do top 10.
create or replace function registrar_solo(p_nome text, p_dificuldade text, p_jogadas int, p_segundos int)
returns json
language plpgsql
security definer
set search_path = public
as $$
declare
  novo_id bigint;
  posicao int;
begin
  insert into resultados_solo (nome, dificuldade, jogadas, segundos)
  values (btrim(p_nome), p_dificuldade, p_jogadas, p_segundos)
  returning id into novo_id;

  select count(*) + 1 into posicao
  from resultados_solo r
  where r.dificuldade = p_dificuldade
    and (r.jogadas, r.segundos, r.id) < (p_jogadas, p_segundos, novo_id);

  return json_build_object('id', novo_id, 'posicao', case when posicao <= 10 then posicao end);
end;
$$;

-- Soma uma partida para cada jogador e uma vitória para o vencedor (0 ou 1; null é empate).
create or replace function registrar_duelo(p_nomes text[], p_vencedor int)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if array_length(p_nomes, 1) <> 2 or (p_vencedor is not null and p_vencedor not in (0, 1)) then
    raise exception 'duelo inválido';
  end if;

  for i in 1..2 loop
    insert into duelistas as d (chave, nome, vitorias, partidas)
    values (lower(btrim(p_nomes[i])), btrim(p_nomes[i]), case when p_vencedor = i - 1 then 1 else 0 end, 1)
    on conflict (chave) do update
      set nome = excluded.nome,
          vitorias = d.vitorias + excluded.vitorias,
          partidas = d.partidas + 1;
  end loop;
end;
$$;

revoke execute on function registrar_solo(text, text, int, int) from public;
revoke execute on function registrar_duelo(text[], int) from public;
grant execute on function registrar_solo(text, text, int, int) to anon, authenticated;
grant execute on function registrar_duelo(text[], int) to anon, authenticated;
