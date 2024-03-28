const fs = require('fs');
const csv = require('csv-parser');

const results = [];

fs.createReadStream('../../Dados/GARANHUNS/MATERIAIS_GARANHUNS.csv', { encoding: 'latin1' })
  .on('error', (err) => {
    console.error('Erro ao ler o arquivo CSV:', err);
  })
  .pipe(csv({ separator: ';' }))
  .on('data', (row) => {
    results.push(row);
  })
  .on('end', () => {
    console.log('Informações do CSV');
  
    if (results.length > 0) {
        // Obtém as chaves do primeiro objeto (cabeçalhos das colunas)
        const headers = Object.keys(results[0]);
    
        // Imprime os títulos das colunas
        console.log('Títulos das Colunas:');
        headers.forEach((header) => {
            console.log(header);
        });
    } else {
        console.log('Nenhum dado encontrado no arquivo CSV.');
    }
    results.forEach((row) => {
        console.log('nome:', row['NOME']);
        console.log(row)
    })
});




