const sqlite3 = require('sqlite3');

function formatarSaida(resultado) {
    const saida = {};

    for (let i = 0; i < resultado.length; i++) {
        let item = resultado[i];
        let { inicio, fim, conteudo } = item;
        if (saida[item['numero']]) {
            saida[item['numero']]['trechos'].push([inicio, fim, conteudo]);
        } else {
            saida[item['numero']] = {
                id_youtube: item['id_youtube'],
                titulo: item['titulo'],
                trechos: [[inicio, fim, conteudo]]
            }
        }
    }

    return Object.keys(saida)
        .sort((a, b) => Number(a) - Number(b))
        .map((chave) => saida[chave]);
}

function consultar(termo) {
    return new Promise((resolve, reject) => {
        const db = new sqlite3.Database('dados_fts.db', sqlite3.OPEN_READONLY);
        db.all('SELECT id_youtube, numero, inicio, fim, titulo, conteudo FROM trecho WHERE conteudo MATCH ? ORDER BY numero, inicio', [termo], (erro, resultado) => {
            db.close();

            if (erro) {
                reject(erro);
            } else {
                resolve(formatarSaida(resultado));
            }
        });
    })
}

exports.trecho = (req, res) => {
    let termo = req.query.termo || req.body.termo || '';

    res.set('Access-Control-Allow-Origin', 'https://busca-naruhodo-nao-oficial.web.app');

    if (req.method === 'OPTIONS') {
        // Send response to OPTIONS requests
        res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, HEAD');
        res.set('Access-Control-Allow-Headers', 'Origin, Content-Type, Content-Length');
        res.set('Access-Control-Max-Age', '3600');
        res.status(204).send();
    } else {
        if (termo) {
            consultar(termo)
                .then((resultado) => {
                    res.status(200).send(resultado);
                }).catch((erro) => {
                    console.error(erro);
                    res.status(500).send(erro.message);
                });
        } else {
            res.status(400).send();
        }
    }
};