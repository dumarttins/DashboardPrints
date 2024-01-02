//Estâncio as principais biblioteca as quais irei usar, sendo elas: "Express", "Puppeteer" e o "Cors".
const express = require('express');
const pup = require('puppeteer');
const cors = require('cors');

//Chamo a minha function express() e a aloco na variavel app para tornar mais simples a chamada dos crud.
const app = express();
//A porta a qual inicio meu servidor backend, existe uma função no final desse codigo onde chamo essa variavel para que ele abra na porta 3001 ou qualquer outra que eu deseje, precisando somente alterar esse número.
const port = 3001;

//Esses dois eu não sei extamente pra que serve, mas acredito que sejam para que minha cominição com o servidor fronte fucione adequadamente...
app.use(express.json());
app.use(cors());

//Uso essa função para rodar a aplicação node e enviá-la os dados coletados no Web Scraping para meu front.
app.get('/', (req, res) => {

    //Um Array de strings com os sites os quais quero acessar e capturar os dados.
    const sites = [
        'http://192.168.1.166',
        'http://192.168.1.167',
        'http://192.168.1.162',
        'http://192.168.8.160',
        'http://192.168.8.161',
        'http://192.168.9.160',
        'http://192.168.9.161',
        'http://192.168.9.162',
        'http://192.168.9.163',
        'http://192.168.11.160',
        'http://192.168.12.160',
        'http://192.168.12.161',
        'http://192.168.14.160',
        'http://192.168.21.160',
        'http://192.168.21.162',
        'http://192.168.31.160',
        'http://192.168.31.162',
        'http://192.168.31.163',
        'http://192.168.51.160',
        'http://192.168.61.160',
        'http://192.168.71.160',
        'http://192.168.71.161'
    ]

    //Declarando outro Array para armazenar os dados de todos os sites acessados, facilitando o envio do paramentro "res" para o servidor onde está a aplicação React.
    let dados = [];

    //Inicio uma arrow function assíncrona onde vou implementar o codigo usando a biblioteca Puppeteer.
    (async () => {

        //Estrutra de repetição uma vez que tenho vários sites para acessar, sendo assim ultilizo o for para percorrer todos os indices do meu Array de strings(sites).
        for (var i = 0; i < sites.length; i++) {

            //Estânciando meu puppeteer / abrindo o navegador.
            //Caso eu altere o valor "new" dentro do launch para para false, quando o codigo rodar o navegador abre para que possamos assistir. 
            const browser = await pup.launch({ headless: 'new' });
            const page = await browser.newPage();
            
            //Try Catch padrão
            try {
                //Interessante essa parte, para que não percamos muito tempo, caso um site demore mais que 10000ms(10 segundos) para abrir a execução para e cai no Catch pulando para a proxima
                //index no Array de sites.
                await Promise.race([
                    page.goto(sites[i]),
                    new Promise((_, reject) => setTimeout(() => reject(new Error('Tempo de espera excedido')), 10000))
                ]);

                //Aqui capturo os elementos onde estão os valores quais vou querer pegar. Casos em que os elementos estejam dentro de um <iframe> precisamos referênciá-los para somente depois
                //conseguirmos capturar os elementos dentro do mesmo.
                const iframeElement = await page.$('#ruifw_MainFrm');
                const iframe = await iframeElement.contentFrame();
                //Pegando o modelo da impressora para usar uma logica de if/else mais abaixo.
                const tablewithName = await page.$('#topTable');
                const iframeElementNomeImp = await tablewithName.$('iframe');
                const iframeNomeImp = await iframeElementNomeImp.contentFrame();


                //Como nos sites das impressoras Samsungs eu não tenho ids e ou classes unicas, para caputurar o elemento especifico eu precisei guardar todos em um array, e aí desse Array buscar
                //pelo elemento com a infomação que preciso, usando uma estrutura de repetição simples consigo saber qual o index exato onde está armazenada a informação necessária.
                const elementosTd = await iframe.$$('td');
                const elementosTdNomeImp = await iframeNomeImp.$$('td');
                const elementosTdserie = await iframe.$$('.sws_home_right_table_style2');

                //Capturando as informações
                const toner = await iframe.evaluate(element => element.innerText, elementosTd[66]);
                const modeloImp = await iframeNomeImp.evaluate(element => element.innerText, elementosTdNomeImp[0]);
                let serie = '';

                //A partir do modelo, a index de onde está a informação nessária muda, então dessa forma consigo dinamizar entre modelo y ou x qual index capturar.
                if(modeloImp === 'SAMSUNG M4080FX')
                    serie = await iframe.evaluate(element => element.innerText, elementosTdserie[3]);
                else if(modeloImp === 'SAMSUNG M5360RX')
                    serie = await iframe.evaluate(element => element.innerText, elementosTdserie[2]);
                else
                    serie = 'Erro if'

                //instanciando um objeto para armazenar no meu array dados que será enviada para a aplicação frontend
                var impressora = new Object();

                //estrutura que me informa o lugar(unidade) onde está o equipamento a partir do IP.
                if (sites[i] === 'http://192.168.1.166' || sites[i] === 'http://192.168.1.167' || sites[i] === 'http://192.168.1.162')
                    impressora.place = 'Holding'
                else if(sites[i] === 'http://192.168.8.160'|| sites[i] === 'http://192.168.8.161')
                    impressora.place = 'Pam Médio'
                else if(sites[i] === 'http://192.168.9.160'|| sites[i] === 'http://192.168.9.161'|| sites[i] === 'http://192.168.9.162' || sites[i] === 'http://192.168.9.163')
                    impressora.place = 'VN I'
                else if(sites[i] === 'http://192.168.11.160')
                    impressora.place = 'Bar Médio'
                else if(sites[i] === 'http://192.168.12.160'|| sites[i] === 'http://192.168.12.161')
                    impressora.place = 'Pam Fund.'
                else if(sites[i] === 'http://192.168.14.160')
                    impressora.place = 'Buritis I'
                else if(sites[i] === 'http://192.168.21.160'|| sites[i] === 'http://192.168.21.162')
                    impressora.place = 'Centro'
                else if(sites[i] === 'http://192.168.31.160'|| sites[i] === 'http://192.168.31.162')
                    impressora.place = 'Eldorado'
                else if(sites[i] === 'http://192.168.51.160')
                    impressora.place = 'Pre VN'
                else if(sites[i] === 'http://192.168.61.160')
                    impressora.place = 'Pre Bar'
                else if(sites[i] === 'http://192.168.71.160'|| sites[i] === 'http://192.168.71.162')
                    impressora.place = 'Pre Pamp'
                else
                    impressora.place = 'Erro Conexão'


                //Inserindo os dados no objeto.
                impressora.ip = sites[i].replace("http://",'')
                impressora.serie = serie;
                impressora.toner = toner;

                //Puxando o objeto para meu array dados.
                dados.push(impressora);

                //Fecho o browser e retorno meu looping for.
                await browser.close();

            } catch (error) {
                
                //Caso ocorra qualquer e caia no Catch eu fecho o browser e estancio meu objeto para salvar dados com o nome erro, para que eu saiba que ocorreu algum problema.
                await browser.close();
                var impressora = new Object();

                //estrutura que me informa o lugar(unidade) onde está o equipamento a partir do IP.
                if (sites[i] === 'http://192.168.1.166/sws/index.sws' || sites[i] === 'http://192.168.1.167/sws/index.sws' || sites[i] === 'http://192.168.1.162/sws/index.sws')
                    impressora.place = 'Holding'
                else if(sites[i] === 'http://192.168.8.160/sws/index.sws'|| sites[i] === 'http://192.168.8.161/sws/index.sws')
                    impressora.place = 'Pam Médio'
                else if(sites[i] === 'http://192.168.9.160/sws/index.sws'|| sites[i] === 'http://192.168.9.161/sws/index.sws'|| sites[i] === 'http://192.168.9.162/sws/index.sws')
                    impressora.place = 'VN I'
                else if(sites[i] === 'http://192.168.11.160/sws/index.sws')
                    impressora.place = 'Bar Médio'
                else if(sites[i] === 'http://192.168.12.160/sws/index.sws'|| sites[i] === 'http://192.168.12.161/sws/index.sws')
                    impressora.place = 'Pam Fund.'
                else if(sites[i] === 'http://192.168.14.160/sws/index.sws')
                    impressora.place = 'Buritis I'
                else if(sites[i] === 'http://192.168.21.160/sws/index.sws'|| sites[i] === 'http://192.168.21.162/sws/index.sws')
                    impressora.place = 'Centro'
                else if(sites[i] === 'http://192.168.31.160/sws/index.sws'|| sites[i] === 'http://192.168.31.162/sws/index.sws')
                    impressora.place = 'Eldorado'
                else if(sites[i] === 'http://192.168.51.160/sws/index.sws')
                    impressora.place = 'Pre VN'
                else if(sites[i] === 'http://192.168.61.160/sws/index.sws')
                    impressora.place = 'Pre Bar'
                else if(sites[i] === 'http://192.168.71.160/sws/index.sws'|| sites[i] === 'http://192.168.71.162/sws/index.sws')
                    impressora.place = 'Pre Pamp'
                else
                    impressora.place = 'Erro conexão'

                //Inserindo os dados no objeto.
                impressora.ip = sites[i].replace("http://",'')
                impressora.serie = '---';
                impressora.toner = '---';
                dados.push(impressora);
                console.log(sites[i]);
            }
        }
        //Enviando como resposta os dados capturados.
        res.send(dados);
    })();
})

//Iniciando meu servidor, sendo "port" instanciado lá no inicio do codigo.
app.listen(port, () => {

})

//Testando versionamento

