class Empresa {
    static Mensagens = {
        BEM_VINDO: 'Olá! Escolha uma opção:\n1. Serra Talhada\n2. Arcoverde\n3. Sair',
        SOLICITAR_NUMERO: 'Por favor, digite o NB:',
        INFORMACAO_NAO_ENCONTRADA: 'Informação não encontrada',
        NUMERO_NAO_ENCONTRADO: 'Número não encontrado',
        ESCOLHA_REVENDA: '🔎 *Selecione uma opção*:\n    1️⃣ - *Serra Talhada*\n    2️⃣ - *Arcoverde*\n    3️⃣ - *Salgueiro*\n    4️⃣ - *Cariri*\n    5️⃣ - *Agreste*\n    6️⃣ - *Sair*',
        ESCOLHA_NB_CPF_CNPJ: '\n    1️⃣ - *Consultar NB*\n    2️⃣ - *Consultar CPF/CNPJ*\n    3️⃣ - *Sair*'
    };

    static Revenda = {
        '1': 'MATRIZ',
        '2': 'FILIAL',
        '3': 'SALGUEIRO',
        '4': 'CEARA',
        '5': 'GARANHUNS'
    };
    
    static RevendaNome = {
        'MATRIZ' : 'Serra Talhada',
        'FILIAL' : 'Arcoverde',
        'SALGUEIRO' : 'Sertão',
        'CEARA' : 'Cariri',
        'GARANHUNS' : 'Agreste'
    };

    static validarNumero(numero){
        return this.AllowedNumbers.includes(numero) ? true : false;
    }

}

module.exports = Empresa;