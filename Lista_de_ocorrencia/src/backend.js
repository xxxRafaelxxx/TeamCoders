const express = require('express');
const app = express();
const porta = 3000;
app.use(express.json());

app.get(usuarios,)
app.put(usuarios,)
app.post(usuarios,)
app.delete(usuarios,)

app.get(condominio,)
app.put(condominio,)
app.post(condominio,)
app.delete(condominio,)

app.listen(porta, () => {
    console.log(`Servidor rodando em http://localhost:${porta}`);
});