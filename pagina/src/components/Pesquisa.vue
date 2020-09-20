<template>
  <div>
    <img v-if="!resultado.length" alt="Logo Naruhodo" src="../assets/logo.png" />
    <div>
      <input
        class="campo-pesquisa"
        type="text"
        name="termo"
        @input="termo = $event.target.value; mensagem = ''"
        :value="termo"
        ref="nome"
      />
      <div>
        <button class="botao" name="pesquisar" @click="pesquisar_click()">Pesquisar</button>
        <button class="botao" name="limpar" @click="limpar_click()">Limpar</button>
      </div>
    </div>
    <div class="margem-superior mensagem" v-if="mensagem">
      <span>{{mensagem}}</span>
    </div>
    <div>
      <div class="linha margem-superior" v-for="episodio of episodios" :key="episodio.numero">
        <div class="mesma-linha">
          <iframe
            class="video"
            :src="`https://www.youtube.com/embed/${episodio.id_youtube}?control=0`"
            frameborder="0"
            allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
          />
        </div>
        <div class="tabela-fixa mesma-linha margem-esquerda">
          <table>
            <thead>
              <tr>
                <th style="width: 15%">Início</th>
                <th style="width: 15%">Fim</th>
                <th style="width: 70%">Conteúdo</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="linha of episodio.trechos" :key="`${linha[0]}_${linha[1]}`">
                <td>{{linha[0].split('.')[0]}}</td>
                <td>{{linha[1].split('.')[0]}}</td>
                <td>{{linha[2]}}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const axios = require("axios").default;
export default {
  name: "Pesquisa",
  data() {
    return {
      termo: "",
      resultado: [],
      mensagem: "",
    };
  },
  computed: {
    episodios() {
      if (this.resultado) {
        return this.resultado;
      } else {
        return [];
      }
    },
  },
  methods: {
    pesquisar_click() {
      this.$refs["nome"].focus();

      if (this.termo) {
        if (this.termo.length < 3) {
          this.mensagem = "Você deve digitar pelo menos 3 caracteres";
          return;
        }

        const termo = this.termo;
        axios
          .post(
            "https://us-central1-busca-naruhodo-nao-oficial.cloudfunctions.net/trecho",
            {
              termo,
            }
          )
          .then((resultado) => {
            this.resultado = resultado.data;
            if (this.resultado.length == 0) {
              this.mensagem = "Nenhum resultado foi encontrado";
            } else {
              this.mensagem = "";
            }
          })
          .catch(() => {
            this.mensagem =
              "Ocorreu um erro ao tentar pesquisar os termos informados";
            this.resultado = [];
          });
      } else {
        this.mensagem = "Informe o termo de pesquisa";
      }
    },
    limpar_click() {
      this.termo = "";
      this.mensagem = "";
      this.resultado = [];

      this.$refs["nome"].focus();
    },
  },
};
</script>

<style scoped>
.botao {
  padding: 8px;
  margin: 0 6px;
}

.mensagem {
  color: red;
  font-weight: 600;
}

.linha {
  display: block;
}

.video {
  width: 100%;
}

.mesma-linha {
  display: inline-block;
}

.margem-esquerda {
  margin-left: 0px;
}

.margem-superior {
  margin-top: 16px;
}

.campo-pesquisa {
  padding: 8px;
  margin: 1em;
  width: 100%;
}

.tabela-fixa {
  /* https://stackoverflow.com/a/56028731/4322614 */
  overflow-y: auto;
  height: 200px;
  width: 100%;
}

.tabela-fixa th {
  position: sticky;
  top: 0;
}

table {
  border-collapse: collapse;
  width: 100%;
}
th,
td {
  padding: 8px 16px;
}
th {
  background: #eee;
}

@media only screen and (min-width: 768px) {
  .tabela-fixa {
    overflow-y: auto;
    height: 315px;
    width: 40%;
  }

  .video {
    width: 560px;
    height: 315px;
  }

  .margem-esquerda {
    margin-left: 8px;
  }

  .margem-superior {
    margin-top: 8px;
  }

  .campo-pesquisa {
    margin: 1em;
    width: 35%;
  }
}
</style>
