// const DataAcess = require('../models/data_acess');
const xlsx = require('xlsx')
const path = require('path');
const { resourceUsage } = require('process');
const DataAcess = require('../models/data_acess');

const DESCRICAO_MATERIAL = {'GARRAFEIRA PLAST,12 GFA 1L,AMBEV,                                 ':'GARRAFEIRA 1L',
                            'GFA VIDRO 1L,AMBAR,RETORN.,,                                      ':'GARRAFA 1L',
                            'REFRIGERADOR,VERTICAL,PEPSI,CAPACIDADE 324L,127/220V,AZUL,1554X525':'FREEZER PEPSI SLIM',
                            'FREEZER,HORIZONTAL TODOS OS MODELOS,                              ':'FREEZER 250',
                            'GARRAFEIRA PLAST,24 GFA 300ML,AZUL,C/2                            ':'GARRAFEIRA 300ML',
                            'Visa Guarana Triplo 220V/60Hz,,,                                  ':'FREEZER GUARANA TRIPLO',
                            'GFA VIDRO 300 ML,AMBAR,RETORNAVEL IMP                             ':'GARRAFA 300ML',
                            'GARRAFEIRA PLAST,23 GFA 300ML,AZUL                                ':'GARRAFEIRA 300ML',
                            'REFRIGERADOR,CERVEJEIRA,BRAHMA,1104L,S/,220V,VERMELHO,2011X1342X80':'FREEZER BRAHMA TRI',
                            'GFA VIDRO 635ML,AMBAR,TIPO A,RETORN.,                             ':'GARRAFA 600ML',
                            'GARRAFEIRA PLAST,24 GFA 600ML,BRAHMA,C/1,                         ':'GARRAFEIRA 600ML BRAHMA',
                            'GARRAFEIRA PLAST,24 GFA 600ML,SKOL,C/1,                           ':'GARRAFEIRA 600ML SKOL',
                            'BARRIL CHOPP,50L,                                                 ':'BARRIL CHOPP 50L',
                            'REFRIGERADOR,BOHEMIA,                                             ':'FREEZER BOHEMIA',
                            'VISA COOLER,GUARANA CHP ANTARCTICA,NORMAL,110W,17010,             ':'FREEZER GUARANA',
                            'REFRIGERADOR,SKOL,NORMAL,110W,9642,                               ':'FREEZER SKOL',
                            'CHOPEIRA,ELETRICA,,QUIOSQUE DE CHOPP,                             ':'CHOPEIRA',
                            'GARRAFEIRA PLAST,24 GFA 600ML,ANTARCTICA,,AZUL,                   ':'GARRAFEIRA 600ML',
                            'GARRAFEIRA PLAST,24 GFA 600ML,,,CINZA ESCURO,                     ':'GARRAFEIRA 600ML',
                            'REFRIGERADOR,CERVEJEIRA,COLORADO,CAPACIDADE 310L,CONGELADOR S/,220':'FREEZER COLORADO',
                            'GFA VIDRO 635ML,VERDE,TIPO A,RETORN.,                             ':'GARRAFA VERDE 600ML',
                            'REFRIGERADOR,BRAHMA,NORMAL PC,220W,9641,                          ':'FREEZER BRAHMA',
                            'MP, CDD, CDD,Refrigerador,Visa Cooler,PEPSI110V,                  ':'FREEZER PEPSI COLA',
                            'REFRIGERADOR,CERVEJEIRA,PEPSI BLACK,740L,220V,PRETO,1980X990X650MM':'FREEZER PEPSI',
                            'REFRIGERADOR,SKOL,MINI,110W,11490,                                ':'FREEZER MINI SKOL',
                            'REFRIGERADOR,SKOL,NORMAL OASIS PV,110W,Vertical,                  ':'FREEZER SKOL PV',
                            'VISA PEPSI COLA NORMAL 110 VOLT                                   ':'FREEZER PEPSI',
                            'REFRIGERADOR,BRAHMA FRESH,NORMAL,110W                             ':'FREEZER BRAHMA FRESH',
                            'GFA VIDRO 330ML,AMBAR,TIPO S GP,RETORN                            ':'GARRAFA 300ML',
                            'GFA VIDRO 1L,PEPSI COLA,RETORN.,ROLL ON,                          ':'GARRAFA 1L PEPSI',
                            'Refrigerador,ANTARCTICA PILSEN,PINGUIM MINI,RC 290,Vertical,,     ':'FREEZER MINI ANTARTICA',
                            'GFA VIDRO 284ML,PEPSI COLA,RETORN.,,                              ':'GARRAFA 290ML PEPSI',
                            'GARRAFEIRA PLAST,24 GFA 290ML,BRAHMA,RA/2,                        ':'GARRAFEIRA 290ML BRAHMA',
                            'REFRIGERADOR,GUARANA/PEPSI,CAPACIDADE 324L,127/220V,VERDE/AZUL,186':'FREEZER GUARANA SLIM',
                            'GFA VIDRO 290ML,GUARANA ANT.,RETORN.,                             ':'GARRAFEIRA 290ML GUARANA',
                            'GFA VIDRO 290ML,SODA L.ANT.,RETORN.,                              ':'GARRAFA 290ML SODA',
                            'GARRAFEIRA PLAST,24 GFA 290ML,ANTARCTICA,                         ':'GARRAFEIRA 290ML',
                            'GFA VIDRO 1L,GCA 1L,RETORN.,,                                     ':'GARRAFA 1L GUARANA',
                            'FREEZER 350 LT                                                    ':'FREEZER 350 LT                                                    ',
                            'BARRIL CHOPP,30L,                                                 ':'BARRIL CHOPP 30L',
                            'REFRIGERADOR,BRAHMA, VISOR DE VIDRO, NORMAL, 220V,                ':'FREEZER BRAHMA VISOR V',
                            'TV 32 POL                                                         ':'TV 32 POL                                                         ',
                            'REFRIGERADOR,BRAHMA,MINI,110W,11488,                              ':'FREEZER BRAHMA MINI',
                            'REFRIGERADOR,ANTARCTICA PILSEN,NORMAL PINGUIM PC,110W,2704,       ':'FREEZER ANTARTICA',
                            'REFRIGERADOR,SKOL,DUPLO,110W,15732,                               ':'FREEZER SKOL DUPLO',
                            'Budweiser PC Ret 220v,,,,,,,,,,,,,,,,,,,,,,                       ':'FREEZER BUDWEISER',
                            'MP, CDD, CDD,Antarctica,Luminoso,Bandeira,                        ':'LUMINOSO AP',
                            'GFA VIDRO 290ML,SUKITA,RETORN.,                                   ':'GARRAFA 290 SUKITA',
                            'CAMARA FRIGORIFICA,,,220W,-,                                      ':'CAMARA FRIG',
                            'REFRIGERADOR,BRAHMA,NORMAL PV,110v,-,                             ':'FREEZER BRAHMA',
                            'REFRIGERADOR,BOHEMIA,NORMAL,220W,15737,                           ':'FREEZER BOHEMIA',
                            'GFA VIDRO 665ML,AMBAR,TIPO A,RETORN.,                             ':'GARRAFA 600ML',
                            'GFA VIDRO 290ML,TONICA ANT,RETORN.,                               ':'GARRAFA 290ML TONICA',
                            'GFA VIDRO 290ML,GUARANA ANT.DIE,RETORN.,                          ':'GARRAFA 290 GUARANA DIET',
                            '118724':'FREEZER GUARANA',
                            '287241':'GARRAFEIRA 300ML',
                            '296156':'GARRAFEIRA 300ML',
                            'BARRIL CHOPP,20L,                                                 ':'BARRIL CHOPP 20L',
                            'BARRIL CHOPP,35L,                                                 ':'BARRIL CHOPP 35L',
                            'Visa - Cooler,mini pepsi pv 220v,                                 ':'FREEZER MINI PEPSI',
                            'POST MIX,MAQUINA,,PEPSI,                                          ':'POST MIX',
                            'REFRIGERADOR,BRAHMA,DUPLO PC,220W,9686,                           ':'FREEZER BRAHMA DM',
                            'REFRIGERADOR,STELLA ARTOIS,NORMAL,220W,-,                         ':'FREEZER STELLA',
                            'REFRIGERADOR,BRAHMA,NORMAL PV,110W,15730,                         ':'FREEZER BRAHMA PC',
                            'GFA VIDRO 635ML,VERDE,TIPO A,RETORN.,                             ':'GARRAFA 600ML VERDE'
}

const DESCRICAO_DOCUMENTACAO = {'CPF - Número CPF                        ' : 'CPF',
                                'RG - Identidade                         ' : 'RG', 
                                'CR - Comprovante Residência             ' : 'Comprovante de Residência',
                                'FAC - Fachada                           ' : 'Foto da Fachada',
                                'CS - Contrato Social                    ' : 'Contrato Social'                     
}


const DESCRICAO_CATEGORIA = {'BAR/BARZINHO        ' : 'FRIO 🍻',
                            'BALCAO              ' : 'AS 🛒',
                            'BOTECO/BOTEQUIM     ' : 'FRIO 🍻',
                            'ARMAZEM/MERCEARIA   ' : 'AS 🛒',
                            'SUPERMERCADO GRANDE ' : 'AS 🛒',
                            'MINIMERCADO         ' : 'AS 🛒',
                            'REST./PIZZARIA/CHURR' : 'FRIO 🍻',
                            'SUPERMERCADO MEDIO  ' : 'AS 🛒',
                            'DEPOSITO DE BEBIDAS ' : 'SUB 🏭',
                            'HOTEL/MOTEL/APART HO' : 'FRIO 🍻',
                            'TRAILLER/BARRACA/QUI' : 'FRIO 🍻',
                            'LANCHONETE/PASTELARI' : 'FRIO 🍻',
                            'ATACADISTA          ' : 'SUB 🏭',
                            'ACADEMIA/CLUBE      ' : 'FRIO 🍻',
                            'CASA DE MASSAGEM    ' : 'FRIO 🍻',
                            'LOJA DE CONVENIENCIA' : 'FRIO 🍻',
                            'PADARIA/CONFEITARIA ' : 'FRIO 🍻',
                            'EVENTOS             ' : 'FRIO 🍻',
                            'DANCETERIA/FORRO    ' : 'FRIO 🍻',
                            'FAST FOOD/DISQUE-SER' : 'FRIO 🍻',
                            'HIPERMERCADO        ' : 'AS 🛒',
                            'POSTOS DE GASOLINA  ' : 'AS 🛒',
                            'RESTAURANTE INDUSTRI' : 'FRIO 🍻',
                            'FOOD SERVICE NACIONA' : 'FRIO 🍻',
                            'TEATRO/CINEMA/CASA D' : 'FRIO 🍻',
                            'BOTICA/FARMACIA     ' : 'AS 🛒',
                            'BARRACA/CARRINHO    ' : 'FRIO 🍻',
                            'SERV FESTA          ' : 'FRIO 🍻',
                            'OUTROS FRIOS        ' : 'FRIO 🍻',
                            'CANTINA ESCOLAR     ' : 'FRIO 🍻',
                            'SEM PONTO COMERCIAL ' : 'FRIO 🍻',
                            'CONSUMIDOR FINAL    ' : 'FRIO 🍻',

}


const DESCRICAO_CONDICAO_PAGAMENTO = {
                                        '1' : 'Venda a vista',
                                        '2' : 'Dinheiro',
                                        '3' : 'Cheque Próprio',
                                        '4' : 'Cheque Terceiro',
                                        '5' : 'PIX',
                                        '15' : 'Chque 15D',
                                        '23' : 'Boleto 2D',
                                        '24' : 'Boleto SICOB',
                                        '25' : 'Boleto Itaú 1PAJ',
                                        '29' : 'Boleto 2D4',
                                        '30' : 'Boleto 2D3',
                                        '31' : 'Boleto 2D PF',
                                        '32' : 'Boleto 2D PJ',
                                        '33' : 'Boleto 2D1',
                                        '34' : 'Boleto 2D2',
                                        '35' : 'Boleto 6D',
                                        '41' : 'Boleto Itaú 6D',
                                        '42' : 'Boleto 6D top',
                                        '46' : 'Boleto 30D',
                                        '47' : 'Boleto 10D Pajeu',
                                        '51' : '        -',
                                        '52' : '        -',
                                        '53' : '        -',
                                        '54' : '        -',
                                        '55' : '        -',
                                        '56' : '        -',
                                        '57' : '        -',
                                        '58' : '        -',
                                        '59' : '        -',
                                        '60' : '        -',
                                        '61' : '        -',
                                        '62' : '        -',
                                        '63' : '        -',
                                        '64' : '        -',
                                        '65' : '        -',
                                        '66' : '        -',
                                        '70' : '        -',
                                        '77' : 'Boleto 12D',
                                        '78' : 'Boleto 1D',
                                        '80' : 'Boleto 1d Itaú',
                                        '81' : 'Boleto 1d Itaú',
                                        '82' : 'Boleto 30D',
                                        '92' : 'Boleto 1D',
                                        '101' : 'Boleto Itaú PC',
                                        '102' : 'Boleto Itaú 15D',
                                        '103' : 'Boleto Agreste',
                                        '160' : 'Boleto BK',
                                        '200' : 'Cartão de Crédito',
                                        '201' : 'Boleto 30D Especial',
                                        '202' : 'Cartão de Débito',
                                        '203' : 'Boleto 21D',
                                        '204' : 'Boleto 60D',
                                        '210' : 'Boleto 30D',
                                        '341' : 'Boleto 6D',
                                        '850' : 'Pix à vista',
                                        '853' : 'Pague Direto',
}


function converterNumeroParaData(numero) {
    // é necessário ajuste para o Unix Timestamp
    const dataUnixTimestamp = (numero - 25569) * 86400 * 1000;

    const data = new Date(dataUnixTimestamp);

    const dia = ('0' + data.getDate()).slice(-2);
    const mes = ('0' + (data.getMonth() + 1)).slice(-2);
    const ano = data.getFullYear();


    return `${dia}/${mes}/${ano}`;

}


async function buscarComodatos(cliente, data_acess) {
        try {
            const comodatos = {};
            let textoComodatos = '';

            for (let row = 1; row <= data_acess.length; row++) {
                if (data_acess[row]['Cliente '] === cliente) {
                    let nextCell = data_acess[row + 1]['Cliente '];
                    while (cliente === nextCell) {
                        const comodato = data_acess[row]['Descricao '];
                        const quantidade = (parseFloat(data_acess[row]['Saldo '].replace('.', ''))) * -1;
                        comodatos[DESCRICAO_MATERIAL[comodato]] = (comodatos[DESCRICAO_MATERIAL[comodato]] || 0) + quantidade;
                        row++;
                        nextCell = data_acess[row + 1]['Cliente '];
                    }
                    break;
                }
            }
            textoComodatos = getTextDict(comodatos, 'comodato');
            return (textoComodatos.length > 0 ? textoComodatos : false);
        } catch (error) {
            console.log(error);
        }
}

function buscarDocumentacao(cliente, data_acess){
    const doc = {};
    let textoDoc = '';

    for (let row = 1; row<=data_acess.length; row++){
        try{
            if(data_acess[row] && data_acess[row]['Codigo Cliente'] === cliente){
                nextCell = data_acess[row+1]['Codigo Cliente'];
                while(cliente === nextCell){
                    const documentacao = data_acess[row]['Tipo Documento'];
                    const status = (data_acess[row]['Nome Arquivo'] != 'Documento não Encontrado                                    ' ? '✅': '❌');
                    doc[DESCRICAO_DOCUMENTACAO[documentacao]] = status;
                    row++;
                    nextCell = data_acess[row]['Codigo Cliente'];
                }
                break;
            }
        }catch(error){

        }
    }
    textoDoc = getTextDict(doc, 'documentacao'); 
    return textoDoc.length > 0 ? textoDoc : false;
}


function getTextDict(data, estado){
    var texto = ''
    switch(estado){
        case 'comodato':
            for (const key in data){
                texto+= `\n      - ${data[key]} x ${key}`;
            }
            return texto.length > 0 ? '📦 *Comodatos*:'+texto : '';

        case 'documentacao':
            for (const key in data){
                texto+= `\n      - *${key}*: ${data[key]}`;
            }
            return texto.length > 0 ? '📂 *Documentação*:'+texto : '';
    }
}

function validarCpf(cpf){
    cpf = cpf.replace(/\D/g, '');
    if(cpf.toString().length != 11 || /^(\d)\1{10}$/.test(cpf)) return false;
    var result = true;
    [9,10].forEach(function(j){
        var soma = 0, r;
        cpf.split(/(?=)/).splice(0,j).forEach(function(e, i){
            soma += parseInt(e) * ((j+2)-(i+1));
        });
        r = soma % 11;
        r = (r <2)?0:11-r;
        if(r != cpf.substring(j, j+1)) result = false;
    });
    return result;
}

function validarCNPJ(cnpj) {
 
    cnpj = cnpj.replace(/[^\d]+/g,'');
 
    if(cnpj == '') return false;
     
    if (cnpj.length != 14)
        return false;
 
    // Elimina CNPJs invalidos conhecidos
    if (cnpj == "00000000000000" || 
        cnpj == "11111111111111" || 
        cnpj == "22222222222222" || 
        cnpj == "33333333333333" || 
        cnpj == "44444444444444" || 
        cnpj == "55555555555555" || 
        cnpj == "66666666666666" || 
        cnpj == "77777777777777" || 
        cnpj == "88888888888888" || 
        cnpj == "99999999999999")
        return false;
         
    // Valida DVs
    tamanho = cnpj.length - 2
    numeros = cnpj.substring(0,tamanho);
    digitos = cnpj.substring(tamanho);
    soma = 0;
    pos = tamanho - 7;
    for (i = tamanho; i >= 1; i--) {
      soma += numeros.charAt(tamanho - i) * pos--;
      if (pos < 2)
            pos = 9;
    }
    resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
    if (resultado != digitos.charAt(0))
        return false;
         
    tamanho = tamanho + 1;
    numeros = cnpj.substring(0,tamanho);
    soma = 0;
    pos = tamanho - 7;
    for (i = tamanho; i >= 1; i--) {
      soma += numeros.charAt(tamanho - i) * pos--;
      if (pos < 2)
            pos = 9;
    }
    resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
    if (resultado != digitos.charAt(1))
          return false;
           
    return true;
    
}

function converterNumeroParaData(numero) {
    // é necessário ajuste para o Unix Timestamp
    const dataUnixTimestamp = (numero - 25569) * 86400 * 1000;

    const data = new Date(dataUnixTimestamp);

    const dia = ('0' + data.getDate()).slice(-2);
    const mes = ('0' + (data.getMonth() + 1)).slice(-2);
    const ano = data.getFullYear();


    return `${dia}/${mes}/${ano}`;

}

module.exports = {converterNumeroParaData,
                 buscarComodatos, 
                 buscarDocumentacao, 
                 DESCRICAO_MATERIAL, 
                 DESCRICAO_CATEGORIA,
                 DESCRICAO_CONDICAO_PAGAMENTO, 
                 validarCNPJ, 
                 validarCpf};