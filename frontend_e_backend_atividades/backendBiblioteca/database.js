const livros = [
  {
    id: 1,
    titulo: 'Dom Casmurro',
    autor: 'Machado de Assis',
    ano: 1899,
    genero: 'Romance'
  },
  {
    id: 2,
    titulo: 'Memórias Póstumas de Brás Cubas',
    autor: 'Machado de Assis',
    ano: 1881,
    genero: 'Romance'
  },
  {
    id: 3,
    titulo: 'O Pequeno Príncipe',
    autor: 'Antoine de Saint-Exupéry',
    ano: 1943,
    genero: 'Infantil'
  }
];

let proximoIdLivro = 4;

module.exports = {
  livros,
  proximoIdLivro
};
