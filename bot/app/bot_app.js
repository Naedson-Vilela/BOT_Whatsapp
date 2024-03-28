const qrcode = require('qrcode-terminal');
const path = require('path');
const Empresa = require(path.resolve(__dirname ,'../models/empresa'));
const DataAcess = require(path.resolve(__dirname ,'../models/data_acess'));
const {converterNumeroParaData, validarCNPJ, validarCpf, getRangeLinhasXlsx} = require('./utils')
const { Client, MessageAck } = require('whatsapp-web.js');
const { info, error } = require('console');


const dataAcess = DataAcess.getInstance();
DataAcess.carregarArquivosCSV(DataAcess.getInstance().caminhosChaves)
.then( async () =>{
    const client = new Client();

    client.on('qr', (qr) => {
        
        qrcode.generate(qr, { small: true });
    });

    client.on('ready', () => {
        
        console.log('Client is ready!');
    });

    client.initialize();

    const conversaEstado = {};



    var num_conexoes = 0;
    var revenda = ''

    // Manipulador de eventos 'message' principal
    client.on('message', async (message) => {
        const numeroTelefone = message.from;
        console.log(message.from);

        if (!conversaEstado[numeroTelefone]) {
            conversaEstado[numeroTelefone] = 'aguardandoConsulta';
        }

        try{
        // Verifica o estado da conversa
            switch (conversaEstado[numeroTelefone]) {
                case 'aguardandoConsulta':
                    if (message.body.toLocaleLowerCase() === '!ping' || message.body.toLocaleLowerCase() === '! ping') {
                        if(await DataAcess.validarNumero(numeroTelefone)){
                            await client.sendMessage(numeroTelefone, 'Pong');
                            conversaEstado[numeroTelefone] = 'aguardandoConsulta';
                        }else{
                            await client.sendMessage(numeroTelefone, '📵 Acesso negado! Você não tem permissão para interagir com este bot, entre em contato com o responsável.');
                            conversaEstado[numeroTelefone] = 'aguardandoConsulta';
                        }
                    }
                    else if (message.body.toLocaleLowerCase() === '!consulta' || message.body.toLocaleLowerCase() === '! consulta') {
                        
                        if(await DataAcess.validarNumero(numeroTelefone)){

                            await client.sendMessage(numeroTelefone, Empresa.Mensagens.ESCOLHA_REVENDA);
                            conversaEstado[numeroTelefone] = 'aguardandoOpcao';
                            num_conexoes++;


                            
                        }else{
                            await client.sendMessage(numeroTelefone, '📵 *Acesso negado!* Você não tem permissão para interagir com este bot, entre em contato com o responsável.');
                            conversaEstado[numeroTelefone] = 'aguardandoConsulta';
                        }
                        
                    }
                    else if (message.body.toLocaleLowerCase() === '!info' || message.body.toLocaleLowerCase() === '! info') {
                        if(await DataAcess.validarNumero(numeroTelefone)){
                            await client.sendMessage(numeroTelefone, `O !Consulta foi usado ${num_conexoes} vezes.`);
                        }else{
                            await client.sendMessage(numeroTelefone, '📵 *Acesso negado!* Você não tem permissão para interagir com este bot, entre em contato com o responsável.');
                        }
                        conversaEstado[numeroTelefone] = 'aguardandoConsulta';
                    }
                    else if (message.body.toLocaleLowerCase() === '!lulu' || message.body.toLocaleLowerCase() === '! lulu') {
                        if(await DataAcess.validarNumero(numeroTelefone)){
                            await client.sendMessage(numeroTelefone, 'E o pix, nada ainda?');
                        }else{
                            await client.sendMessage(numeroTelefone, '📵 *Acesso negado!* Você não tem permissão para interagir com este bot, entre em contato com o responsável.');
                        }
                        conversaEstado[numeroTelefone] = 'aguardandoConsulta';
                    }
                    else if (message.body.toLocaleLowerCase() === '!update' || message.body.toLocaleLowerCase() === '! update') {
                        if(await DataAcess.validarAdmin(numeroTelefone)){
                            await client.sendMessage(numeroTelefone, '🔄 Atualizando bases...');
                            try{
                                await DataAcess.carregarArquivosCSV(DataAcess.getInstance().caminhosChaves);
                                await client.sendMessage(numeroTelefone, '✅ Bases atualizadas!');
                                conversaEstado[numeroTelefone] = 'aguardandoConsulta';
                            }catch(error){
                                await client.sendMessage(numeroTelefone, '❌ Erro ao atualizar!');
                                conversaEstado[numeroTelefone] = 'aguardandoConsulta';
                                console.log(error);
                            }
                        }else{
                            await client.sendMessage(numeroTelefone, '📵 *Acesso negado!* Você não tem permissão para interagir com este bot, entre em contato com o responsável.');
                            conversaEstado[numeroTelefone] = 'aguardandoConsulta';
                        }
                        
                    }
                    break;

                case 'aguardandoOpcao':
                    const escolhas = ['1','2','3','4','5'];

                    escolha = message.body.toLocaleLowerCase().trim();
                    if(escolhas.includes(escolha)){
                        revenda = Empresa.Revenda[escolha];
                        await client.sendMessage(numeroTelefone,`🔎 *${Empresa.RevendaNome[revenda]}*:`+Empresa.Mensagens.ESCOLHA_NB_CPF_CNPJ);
                        conversaEstado[numeroTelefone] = 'aguardandoOpcaoConsulta';
                        num_conexoes++;
                    }else if (message.body === '6' || message.body.toLowerCase() === 'sair') {
                        await client.sendMessage(numeroTelefone, 'Processo finalizado. Digite *!Consulta* para voltar a pesquisar.');
                        conversaEstado[numeroTelefone] = 'aguardandoConsulta';
                    } else{
                        await client.sendMessage(numeroTelefone, '⚠ *Opção inválida*. Por favor, selecione novamente.');
                    }
                    break;
                    
                case 'aguardandoOpcaoConsulta':
                    if (message.body === '1' || message.body.toLowerCase() === 'consultar nb') {
                        await client.sendMessage(numeroTelefone, '🔎 *Digite o NB para consulta*:');
                        conversaEstado[numeroTelefone] = 'aguardandoNB';
                    } else if (message.body === '2' || message.body.toLowerCase() === 'consultar cpf' || message.body.toLowerCase() === 'consultar cnpj' || message.body.toLowerCase() === 'consultar cpf/cnpj') {
                        await client.sendMessage(numeroTelefone, '🔎 *Digite o CPF/CNPJ para consulta*:');
                        conversaEstado[numeroTelefone] = 'aguardandoCpfCnpj';
                    } else if (message.body === '3' || message.body.toLowerCase() === 'sair') {
                        await client.sendMessage(numeroTelefone, 'Processo finalizado. Digite *!Consulta* para voltar a pesquisar.');
                        conversaEstado[numeroTelefone] = 'aguardandoConsulta';
                    } else {
                        await client.sendMessage(numeroTelefone, '⚠ *Opção inválida*. Por favor, selecione novamente.');
                    }
                    break;
                case 'aguardandoNB':
                    await client.sendMessage(numeroTelefone, '🕒 Processando...');
                    var numero = message.body.trim();
                    try {
                        const cliente = await DataAcess.getInstance().buscarInformacaoNb(numero, revenda);
                        
                        await client.sendMessage(numeroTelefone, cliente['resumo']);
                        await client.sendMessage(numeroTelefone, cliente['doc']);
                        if (cliente['isComodato']){
                            await client.sendMessage(numeroTelefone, cliente['comodatos'])
                        }

                        conversaEstado[numeroTelefone] = 'aguardandoConsulta'; // Reinicia o estado da conversa apenas após a conclusão da busca
                    } catch (error) {
                        console.error('Erro ao buscar informações do cliente:', error);
                        
                        await client.sendMessage(numeroTelefone, 'Cliente não encontrado, verifique o número e tente novamente.🤔');
                        await client.sendMessage(numeroTelefone, 'Processo finalizado. Digite !Consulta para voltar a pesquisar.');
                        conversaEstado[numeroTelefone] = 'aguardandoConsulta'; // Reinicia o estado da conversa em caso de erro
                    };
                    break;
                    
                case 'aguardandoCpfCnpj':
                    await client.sendMessage(numeroTelefone, '🕒 Processando...');
                    var numero = message.body.trim();
                    try {
                        const cliente = await DataAcess.getInstance().buscarInformacaoCpfCnpj(numero, revenda);
                        
                        await client.sendMessage(numeroTelefone, cliente['resumo']);
                        await client.sendMessage(numeroTelefone, cliente['doc']);
                        if (cliente['isComodato']){
                            await client.sendMessage(numeroTelefone, cliente['comodatos'])
                        }

                        conversaEstado[numeroTelefone] = 'aguardandoConsulta'; // Reinicia o estado da conversa apenas após a conclusão da busca
                    } catch (error) {
                        console.error('Erro ao buscar informações do cliente:', error);
                        
                        await client.sendMessage(numeroTelefone, 'Cliente não encontrado, verifique o número e tente novamente.🤔');
                        await client.sendMessage(numeroTelefone, 'Processo finalizado. Digite !Consulta para voltar a pesquisar.');
                        conversaEstado[numeroTelefone] = 'aguardandoConsulta'; // Reinicia o estado da conversa em caso de erro
                    };
                    break;
            }
        }catch(erro){
            console.log(erro);
            conversaEstado[numeroTelefone] = 'aguardandoConsulta';
            await client.sendMessage(numeroTelefone, 'Tente novamente mais tarde... ');
        }
    });
});




