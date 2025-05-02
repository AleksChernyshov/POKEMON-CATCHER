import { gql } from '@apollo/client'

export const GET_POKEMON_LIST = gql`
  query ListPokemons($limit: Int!, $offset: Int!) {
    pokemons(limit: $limit, offset: $offset) {
      results { id name image }
    }
  }
`

export const GET_POKEMON_BY_NAME = gql`
  query GetPokemon($name: String!) {
    pokemon(name: $name) {
      id
      name
      sprites { front_default }
      species { url }          # ← url понадобится, чтобы узнать id цепочки
    }
  }
`

export const GET_EVOLUTION_CHAIN = gql`
  query GetEvolutionChain($id: String!) {
    evolutionChain(id: $id) {
      response
    }
  }
`
