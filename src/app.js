const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")

// CONFIGURAÇÕES INICIAIS
const app = express();
const PORT = 3000;  //PORTA onde roda nosso app

app.use(cors()); // Permite o acesso de outras origens
app.use(express.json()); // Permite o envio de dados no formato JSON

// CONFIGURAÇÕES DO BANCO
mongoose.Promise = global.Promise; //para evitar o warning
mongoose.connect("mongodb://localhost:27017/rede_social");

//Um Schema no MongoDB (com Mongoose) define a estrutura de um documento,
// incluindo os tipos de dados e validações. Ele ajuda a manter os dados organizados e consistentes no banco de dados.

const schema = new mongoose.Schema({
    autor: {
        type: String,
        required: true
    },
    post: {
        type: String,
        required: true
    },
    likes: {
        type: Number,
        default: 0
    }
}, { timestamps: true })

const Post = mongoose.model("post", schema)

// ROTAS DE HOME
app.get("/", (req, res) => {
    res.send("Bem vindo ao minicurso de Node.js")
})

// async torna a função assíncrona e await faz o código esperar a Promise ser resolvida antes de continuar.
app.get("/posts", async (req, res) => {
    let filter = {};

    if (autor) {
        filter.autor = { $regex: autor, $options: 'i' }; // busca case-insensitive
    } //asc(antigos) desc

    const posts = await query;
    res.status(200).json(posts);
})

// ROTA QUE INSERE POST

app.post("/posts", async (req, res) => {
    const newPost = {
        autor: req.body.autor,
        post: req.body.post,
        likes: 0
    }

    await Post.create(newPost)
    res.status(201).json({ message: "sucesso" })
})

// FUNÇÃO QUE BUSCA POR ID, ELA É USADA EM VARIAS PARTES DO CÓDIGO, NÃO É CORRETO REPETIR O CÓDIGO

const getPostById = async (id) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return { message: "Id invalido" }
    }
    return await Post.findById(id)
}

// ROTA QUE BUSCA POR ID

app.get("/posts/:id", async (req, res) => {
    const post = await getPostById(req.params.id)

    if (post && post.message) {
        return res.status(400).json(post)
    }

    if (!post) {
        return res.status(404).json({ message: "Post nao encontrado" })
    }

    return res.status(200).json(post)
})

// ROTA QUE ATUALIZA TODOS OS CAMPOS

app.put("/posts/:id", async (req, res) => {
    const post = await getPostById(req.params.id)

    if (post && post.message) {
        return res.status(400).json(post)
    }

    if (!post) {
        return res.status(404).json({ message: "Post não encontrado" })
    }

    const updatedPost = await Post.findByIdAndUpdate(
        req.params.id,
        { $set: { autor: req.body.autor, post: req.body.post, likes: req.body.likes } },
        { new: true } // <- retorna o documento atualizado
    )

    return res.status(200).json(updatedPost)
})

//ROTA QUE INCREMENTA OS LIKES

app.put("/posts/:id/like", async (req, res) => {
    await Post.updateOne({ _id: req.params.id }, { $inc: { likes: 1 } })

    const post = await getPostById(req.params.id)

    if (post && post.message) {
        return res.status(400).json(post)
    }

    if (!post) {
        return res.status(404).json({ message: "Post não encontrado" })
    }

    return res.status(200).json(post)
})

//ROTA QUE DELETA

app.delete("/posts/:id", async (req, res) => {
    const id = req.params.id

    const post = await getPostById(id)

    if (post && post.message) {
        return res.status(400).json(post)
    }

    if (!post) {
        return res.status(404).json({ message: "Post nao encontrado" })
    }

    await Post.deleteOne({ _id: id })

    return res.status(200).json({ message: "Post deletado com sucesso" })
})


// INICIA O SERVIDOR
app.listen(PORT, () => {
    console.log("O servidor tá rodando na porta: ", PORT);
})