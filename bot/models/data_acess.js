const {buscarComodatos, 
        buscarDocumentacao,
        converterNumeroParaData, 
        validarCNPJ, 
        validarCpf, 
        DESCRICAO_CATEGORIA,
        DESCRICAO_CONDICAO_PAGAMENTO
        } = require('../app/utils');
const fs = require('fs');
const csv = require('csv-parser');

// const converterNumeroParaData = require('../app/utils')

class DataAcess {

    constructor() {
        this.baseRevendas = {};

        this.caminhosMatriz = {
            'MATRIZ_CADASTRO': 'Z:/STL - Serra Talhada/FINANCEIRO/ADS/Bot Whatsapp/Dados/SERRA_TALHADA/01.05.07.04.02_MATRIZ.csv',
            'MATRIZ_COMODATO': 'Z:/STL - Serra Talhada/FINANCEIRO/ADS/Bot Whatsapp/Dados/SERRA_TALHADA/02.02.20_MATRIZ.csv',
            'MATRIZ_DOCUMENTACAO': 'Z:/STL - Serra Talhada/FINANCEIRO/ADS/Bot Whatsapp/Dados/SERRA_TALHADA/03.17.02_TT_MATRIZ.csv'
        }

        this.caminhosFilial = {
            'FILIAL_CADASTRO': 'Z:/STL - Serra Talhada/FINANCEIRO/ADS/Bot Whatsapp/Dados/ARCOVERDE/01.05.07.04.02_FILIAL.csv',
            'FILIAL_COMODATO': 'Z:/STL - Serra Talhada/FINANCEIRO/ADS/Bot Whatsapp/Dados/ARCOVERDE/02.02.20_FILIAL.csv',
            'FILIAL_DOCUMENTACAO': 'Z:/STL - Serra Talhada/FINANCEIRO/ADS/Bot Whatsapp/Dados/ARCOVERDE/03.17.02_TT_FILIAL.csv'
        };

        this.caminhosCeara = {
            'CEARA_CADASTRO': 'Z:/STL - Serra Talhada/FINANCEIRO/ADS/Bot Whatsapp/Dados/CEARA/01.05.07.04.02_CEARA.csv',
            'CEARA_COMODATO': 'Z:/STL - Serra Talhada/FINANCEIRO/ADS/Bot Whatsapp/Dados/CEARA/02.02.20_CEARA.csv',
            'CEARA_DOCUMENTACAO': 'Z:/STL - Serra Talhada/FINANCEIRO/ADS/Bot Whatsapp/Dados/CEARA/03.17.02_TT_CEARA.csv'
        };

        this.caminhosGaranhuns = {
            'GARANHUNS_CADASTRO': 'Z:/STL - Serra Talhada/FINANCEIRO/ADS/Bot Whatsapp/Dados/GARANHUNS/01.05.07.04.02_GARANHUNS.csv',
            'GARANHUNS_COMODATO': 'Z:/STL - Serra Talhada/FINANCEIRO/ADS/Bot Whatsapp/Dados/GARANHUNS/02.02.20_GARANHUNS.csv',
            'GARANHUNS_DOCUMENTACAO': 'Z:/STL - Serra Talhada/FINANCEIRO/ADS/Bot Whatsapp/Dados/GARANHUNS/03.17.02_TT_GARANHUNS.csv',
        };

        this.caminhosSalgueiro = {
            'SALGUEIRO_CADASTRO': 'Z:/STL - Serra Talhada/FINANCEIRO/ADS/Bot Whatsapp/Dados/SALGUEIRO/01.05.07.04.02_SALGUEIRO.csv',
            'SALGUEIRO_COMODATO': 'Z:/STL - Serra Talhada/FINANCEIRO/ADS/Bot Whatsapp/Dados/SALGUEIRO/02.02.20_SALGUEIRO.csv',
            'SALGUEIRO_DOCUMENTACAO': 'Z:/STL - Serra Talhada/FINANCEIRO/ADS/Bot Whatsapp/Dados/SALGUEIRO/03.17.02_TT_SALGUEIRO.csv',
        };

        this.caminhoAllowedNumbers = {
            'ALLOWEDNUMBERS' : 'F:/ANALISTA ADMINISTRATIVO DE VENDAS/01. TÉC. DE CADASTROS/10. Atalhos/Base BOT Whatsapp/Dados/allowedNumbers.csv'
        }

        this.caminhosChaves = {
            // F:\ANALISTA ADMINISTRATIVO DE VENDAS\01. TÉC. DE CADASTROS\10. Atalhos\Base BOT Whatsapp\Dados\ARCOVERDE

            'MATRIZ_CADASTRO': '../../Dados/SERRA_TALHADA/01.05.07.04.02_MATRIZ.csv',
            'MATRIZ_COMODATO': '../../Dados/SERRA_TALHADA/02.02.20_MATRIZ.csv',
            'MATRIZ_DOCUMENTACAO': '../../Dados/SERRA_TALHADA/03.17.02_TT_MATRIZ.csv',
            'FILIAL_CADASTRO': '../../Dados/ARCOVERDE/01.05.07.04.02_FILIAL.csv',
            'FILIAL_COMODATO': '../../Dados/ARCOVERDE/02.02.20_FILIAL.csv',
            'FILIAL_DOCUMENTACAO': '../../Dados/ARCOVERDE/03.17.02_TT_FILIAL.csv',
            'CEARA_CADASTRO': '../../Dados/CEARA/01.05.07.04.02_CEARA.csv',
            'CEARA_COMODATO': '../../Dados/CEARA/02.02.20_CEARA.csv',
            'CEARA_DOCUMENTACAO': '../../Dados/CEARA/03.17.02_TT_CEARA.csv',
            'GARANHUNS_CADASTRO': '../../Dados/GARANHUNS/01.05.07.04.02_GARANHUNS.csv',
            'GARANHUNS_COMODATO': '../../Dados/GARANHUNS/02.02.20_GARANHUNS.csv',
            'GARANHUNS_DOCUMENTACAO': '../../Dados/GARANHUNS/03.17.02_TT_GARANHUNS.csv',
            'SALGUEIRO_CADASTRO': '../../Dados/SALGUEIRO/01.05.07.04.02_SALGUEIRO.csv',
            'SALGUEIRO_COMODATO': '../../Dados/SALGUEIRO/02.02.20_SALGUEIRO.csv',
            'SALGUEIRO_DOCUMENTACAO': '../../Dados/SALGUEIRO/03.17.02_TT_SALGUEIRO.csv',
            'ALLOWEDNUMBERS' : '../../Dados/allowedNumbers.csv'
        };
        DataAcess.instance = this;
    }

    static getInstance() {
        if (!DataAcess.instance) {
            DataAcess.instance = new DataAcess();
        }
        return DataAcess.instance;
    }

    static async carregarArquivosCSV(caminhos = null) {
        if (!caminhos) {
            caminhos = this.caminhosChaves;
        }
    
        try {
            for (let key in DataAcess.instance.baseRevendas) {
                // Define o valor da chave como null
                DataAcess.instance.baseRevendas[key] = null;
            }
            const chaves = Object.keys(caminhos);
            const dados = await Promise.all(chaves.map(async (chave) => {
                const caminho = caminhos[chave];
                const resultado = await new Promise((resolve, reject) => {
                    const resultados = [];
                    fs.createReadStream(caminho,  { encoding: 'latin1' })
                        .pipe(csv({ separator: ';' }))
                        .on('data', (row) => {
                            resultados.push(row);
                        })
                        .on('end', () => {
                            resolve(resultados); 
                        })
                        .on('error', (error) => {
                            reject(error);
                        });
                });
                // Armazena os dados carregados no atributo baseRevendas, usando a chave associada ao caminho
                DataAcess.instance.baseRevendas[chave] = resultado;
                return true;
            }));
        } catch (error) {
            throw new Error('Erro ao carregar arquivos CSV: ' + error);
        }
    }

    recarregarCaminho(all=false, arquivo=null){
        if (!all){
            return DataAcess.carregarArquivosCSV();
        }
        try {
            return DataAcess.carregarArquivosCSV(arquivo);
        } catch (error) {
            throw new Error('Erro ao carregar arquivos CSV: ' + error);
        }
        
    }

    static async validarNumero(numero){
        return await DataAcess.instance.baseRevendas['ALLOWEDNUMBERS'].some((contato) => contato.numero === numero);
    }

    static async validarAdmin(numero){
        return await DataAcess.instance.baseRevendas['ALLOWEDNUMBERS'].some((contato) => (contato.numero === numero)&&(contato.cargo === 'admin'));
    }

    async getCsv(arquivo){
        try{
            return await DataAcess.instance.baseRevendas[arquivo];
        }catch(e){
            return false;
        }
    }
    
    async buscarInformacaoNb(numero, revenda) {
        return new Promise(async (resolve, reject) => {
            try {
                const base_cadastro = await DataAcess.instance.getCsv(revenda + '_CADASTRO');
                const base_comodato = await DataAcess.instance.getCsv(revenda + '_COMODATO');
                const base_documentacao = await DataAcess.instance.getCsv(revenda + '_DOCUMENTACAO');
                var cliente = {};
    
                // Verifica se base_cadastro não é null e é iterável antes de iterar sobre ele
                if (base_cadastro && typeof base_cadastro[Symbol.iterator] === 'function') {
                    for (const pdv of base_cadastro) {
                        if (pdv['Cód PDV'] === numero) {
                            // Monta os dados do cliente
                            cliente['documento'] = pdv['Documento'].trim();
                            cliente['nomeFantasia'] = pdv['Nome Fantasia'].trim(); 
                            cliente['razaoSocial'] = pdv['Razão Social'].trim(); 
                            cliente['nb'] = pdv['Cód PDV'].trim();
                            cliente['setor'] = pdv['Setor VDE'].trim(); 
                            cliente['segmento'] = DESCRICAO_CATEGORIA[pdv['Categoria']] ? DESCRICAO_CATEGORIA[pdv['Categoria']].trim() : 'SEM CATEGORIA';
                            cliente['dataUltimaCompra'] = pdv['Data da Última Compra'] != "          " ? (pdv['Data da Última Compra'].trim().includes('/') ? pdv['Data da Última Compra'].trim() : converterNumeroParaData(pdv['Data da Última Compra'].trim()))  : 'Sem compra';
                            cliente['doc'] = await buscarDocumentacao(numero, base_documentacao); 
    
                            // Aguarda a resolução da promessa de comodatos
                            cliente['comodatos'] = pdv['Possui Comodato'] == 'Sim'? await buscarComodatos(numero, base_comodato): false;
                            cliente['condPagamento'] = DESCRICAO_CONDICAO_PAGAMENTO[pdv['Cond Pag Atual']];
                            cliente['isComodato'] = cliente['comodatos'] ? true : false;
                            cliente['limiteCredito'] = 'R$'+ (pdv['Limite de Crédito Disponível']>=0? pdv['Limite de Crédito Disponível'].trim() : '0');
                            cliente['limiteCredito'] = cliente['limiteCredito'].includes(',')? cliente['limiteCredito'].trim() : cliente['limiteCredito'].trim()+',00';
                            
                            // Monta o resumo do cliente
                            cliente['resumo'] =  (`🔎 *Seguem as informações do PDV*`+
                                                `\n   - *NB*: ${cliente['nb']}`+
                                                `\n   - *Razão socaial*: ${cliente['razaoSocial']}`+
                                                `\n   - *Nome Fantasia*: ${cliente['nomeFantasia']}`+
                                                `\n   - *Documento*: ${cliente['documento']}`+
                                                `\n   - *Segmento*: ${cliente['segmento']}`+
                                                `\n   - *Data da última compra*: ${cliente['dataUltimaCompra']}`+
                                                `\n   - *Condição de Pag.*: ${cliente['condPagamento']}`+
                                                `\n   - *Limite de crédito*: ${cliente['limiteCredito']}`+
                                                `\n   - *Setor*: ${cliente['setor']}`+
                                                `\n   - *Possui comodatos*: ${cliente['isComodato'] ? 'Sim' : 'Não'}`);
                            
                            resolve(cliente); // Resolve a promessa com os dados do cliente
                            return;
                        }
                    }
                    reject('Cliente não encontrado'); // Rejeita a promessa se o cliente não for encontrado
                } else {
                    reject('base_cadastro não está definido ou não é iterável');
                }
            } catch (error) {
                reject(error); // Rejeita a promessa em caso de erro
            }
        });
    }


    async buscarInformacaoCpfCnpj(cpfCnpj, revenda) {
        return new Promise(async (resolve, reject) => {
            try {
                if(validarCpf(cpfCnpj) || validarCNPJ(cpfCnpj)){
                    console.log('entrei');
                    const base_cadastro = await DataAcess.instance.getCsv(revenda + '_CADASTRO');
                    const base_comodato = await DataAcess.instance.getCsv(revenda + '_COMODATO');
                    const base_documentacao = await DataAcess.instance.getCsv(revenda + '_DOCUMENTACAO');
                    var cliente = {};
        
                    // Verifica se base_cadastro não é null e é iterável antes de iterar sobre ele
                    if (base_cadastro && typeof base_cadastro[Symbol.iterator] === 'function') {
                        for (const pdv of base_cadastro) {
                            if (pdv['Documento'].trim().replace(/\D/g, '') === cpfCnpj.trim().replace(/\D/g, '')) {
                                console.log('entrei');
                                // Monta os dados do cliente
                                cliente['documento'] = pdv['Documento'].trim();
                                cliente['nomeFantasia'] = pdv['Nome Fantasia'].trim(); 
                                cliente['razaoSocial'] = pdv['Razão Social'].trim(); 
                                cliente['nb'] = pdv['Cód PDV'].trim();
                                cliente['setor'] = pdv['Setor VDE'].trim(); 
                                cliente['segmento'] = DESCRICAO_CATEGORIA[pdv['Categoria']] ? DESCRICAO_CATEGORIA[pdv['Categoria']].trim() : 'SEM CATEGORIA';
                                cliente['dataUltimaCompra'] = pdv['Data da Última Compra'] != "          " ? (pdv['Data da Última Compra'].trim().includes('/') ? pdv['Data da Última Compra'].trim() : converterNumeroParaData(pdv['Data da Última Compra'].trim()))  : 'Sem compra';
                                cliente['doc'] = await buscarDocumentacao(cliente['nb'], base_documentacao); 
        
                                // Aguarda a resolução da promessa de comodatos
                                cliente['comodatos'] = pdv['Possui Comodato'] == 'Sim'? await buscarComodatos(cliente['nb'], base_comodato): false;
                                cliente['condPagamento'] = DESCRICAO_CONDICAO_PAGAMENTO[pdv['Cond Pag Atual'].trim()];
                                cliente['isComodato'] = cliente['comodatos'] ? true : false;
                                cliente['limiteCredito'] = 'R$'+ (pdv['Limite de Crédito Disponível']>=0? pdv['Limite de Crédito Disponível'].trim() : '0');
                                cliente['limiteCredito'] = cliente['limiteCredito'].includes(',')? cliente['limiteCredito'].trim() : cliente['limiteCredito'].trim()+',00';
                                
                                // Monta o resumo do cliente
                                cliente['resumo'] =  (`🔎 *Seguem as informações do PDV*`+
                                                    `\n   - *NB*: ${cliente['nb']}`+
                                                    `\n   - *Razão social*: ${cliente['razaoSocial']}`+
                                                    `\n   - *Nome Fantasia*: ${cliente['nomeFantasia']}`+
                                                    `\n   - *Documento*: ${cliente['documento']}`+
                                                    `\n   - *Segmento*: ${cliente['segmento']}`+
                                                    `\n   - *Data da última compra*: ${cliente['dataUltimaCompra']}`+
                                                    `\n   - *Condição de Pag.*: ${cliente['condPagamento']}`+
                                                    `\n   - *Limite de crédito*: ${cliente['limiteCredito']}`+
                                                    `\n   - *Setor*: ${cliente['setor']}`+
                                                    `\n   - *Possui comodatos*: ${cliente['isComodato'] ? 'Sim' : 'Não'}`);
                                
                                resolve(cliente); // Resolve a promessa com os dados do cliente
                                return;
                            }
                        }
                        reject('Cliente não encontrado'); // Rejeita a promessa se o cliente não for encontrado
                    } else {
                        reject('base_cadastro não está definido ou não é iterável');
                    }
                }
                reject('Documento inválido');
            } catch (error) {
                reject(error); // Rejeita a promessa em caso de erro
            }
        });
    }



}

module.exports = DataAcess;


// DataAcess.carregarArquivosCSV(DataAcess.getInstance().caminhosChaves)
// .then(async () => {
//     try {
//     const cliente = await DataAcess.validarAdmin('558788292517@c.us');
//     const numeros = await DataAcess.getInstance().baseRevendas['ALLOWEDNUMBERS']
//     console.log(numeros);
//     console.log(cliente);
//     } catch (error) {
//     console.error('Erro ao buscar informações do cliente:', error);
//     }
// })
// .catch((error) => {
//     console.error('Erro ao carregar arquivos CSV:', error);
// });