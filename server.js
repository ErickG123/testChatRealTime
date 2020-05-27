const express = require('express');
const path = require('path');

const app = express();

// Informando que o app tem uma porta que vai ser acessada pelo websocket
// Definindo o protocólo HTTP
const server = require('http').createServer(app);
// Definindo o protocólo WSS para o websocket
const io = require('socket.io')(server);

// Definindo a pasta de arquivos publicos acessados pela aplicação 
// Se eu criar um pasta 'public' na raiz é onde fica os arquivos frontend
app.use(express.static(path.join(__dirname, 'public')));
// Mostrando que as views são HTML e não EJS
app.set('views', path.join(__dirname, 'public'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

// Quando acessa o endereço do servidor padrão
app.use('/', (req, res) => {
    // Renderiza a 'index.html'
    res.render('index.html');
});

// Array que guarda todas as mensagens 
let messages = [];

// Definindo qual a forma de conexão entre o usuário e o websocket
// Sempre que alguem se conectar ao socket
io.on('connection', socket => {
    console.log(`Socket conectado: ${ socket.id }` )

    // Mostra todas as mensagens para alguém que acabou de entra 
    socket.emit('previousMessages', messages);

    // Recebe os objetos do frontend por causa do script
    socket.on('sendMessage', data => {
        messages.push(data);
        // Envia uma mensagem para todos os sockets conectados
        socket.broadcast.emit('receivedMessage', data);
    });
}); 

// Roda na porta 3000
server.listen(3000);