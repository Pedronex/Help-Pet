<template>
  <div
    class="geral w3-container extender-div-tela-toda w3-small"
    style="padding: 0px"
  >
    <div
      class="w3-modal"
      v-if="processando"
      style="display: block; padding-top: 60%"
    >
      <div class="w3-modal-content">
        <div class="w3-container w3-margin-top" style="padding: 0px">
          <div class="wrapper">
            <div class="circle"></div>
            <div class="circle"></div>
            <div class="circle"></div>
            <div class="shadow"></div>
            <div class="shadow"></div>
            <div class="shadow"></div>
          </div>
        </div>
      </div>
    </div>
    <div class="w3-blue w3-col">
      <h2 class="w3-col w3-center bold-500">Dados pessoais</h2>
    </div>

    <div class="margin-top-80 padding-10">
      <div class="w3-center">
        <img
          style="border-radius: 50%; box-shadow: 5px 1px 20px 0px"
          class="w3-border"
          v-if="!image"
          src="../assets/imagens/avatar.jpg"
          width="150"
          height="150"
        />
        <img
          v-else
          style="border-radius: 50%; box-shadow: 5px 1px 20px 0px"
          class="w3-border"
          :src="image"
          alt=""
          width="150"
          height="150"
        />
      </div>
      <label class="w3-col w3-margin-top w3-text-blue">Cpf</label>
      <the-mask
        :mask="['###.###.###-##']"
        id="cpf"
        class="w3-input w3-text-black bold-500 margin-top-30"
        type="text"
        v-model="cpf"
        placeholder="Cpf:"
      />
      <label class="w3-col w3-margin-top w3-text-blue"
        ><i class="fas fa-phone"> </i> Telefone</label
      >
      <the-mask
        :mask="['(##) ####-####', '(##) #####-####']"
        id="telefone"
        class="w3-input w3-margin-top w3-text-black bold-500"
        placeholder="Telefone:"
        v-model="telefone"
      />
      <label class="w3-col w3-margin-top w3-text-blue"
        ><i class="fab fa-whatsapp"> </i> Whatsapp</label
      >
      <the-mask
        :mask="['(##) ####-####', '(##) #####-####']"
        id="whatsapp"
        class="w3-input w3-margin-top w3-text-black bold-500"
        v-model="whatsapp"
        type="text"
        placeholder="Whatsapp:"
      />
      <label class="w3-col w3-margin-top w3-text-blue"
        ><i class="fab fa-telegram-plane"></i> Telegram</label
      >
      <the-mask
        :mask="['(##) ####-####', '(##) #####-####']"
        id="telegram"
        class="w3-input w3-margin-top w3-text-black bold-500"
        v-model="telegram"
        type="text"
        placeholder="Telegram:"
      />

      <router-link
        to="/Endereco"
        class="w3-button w3-blue w3-col margin-top-50 w3-padding"
      >
        Cadastrar endereço
      </router-link>
    </div>

    <nav class="container w3-display-bottomright w3-padding">
      <router-link
        to="/Perfil"
        style="
          font-size: 20px;
          padding: 4px !important;
          padding-left: 9px !important;
        "
        class="buttons w3-orange"
        tooltip="Voltar para perfil"
      >
        <i class="fas fa-arrow-left"></i>
      </router-link>

      <label
        for="fileInput"
        slot="upload-label"
        class="buttons w3-purple"
        style="
          font-size: 20px;
          padding: 4px !important;
          padding-left: 9px !important;
        "
        tooltip="Inserir foto"
      >
        <i class="fas fa-camera"></i>
      </label>
      <image-uploader
        style="display: none"
        class="w3-col"
        :quality="1.0"
        :preview="false"
        :className="['fileinput', { 'fileinput--loaded': hasImage }]"
        capture="user"
        :debug="1"
        doNotResize="gif"
        :autoRotate="true"
        outputFormat="string"
        @input="setImage"
      ></image-uploader>

      <a
        href="#"
        style="
          font-size: 20px;
          padding: 4px !important;
          padding-left: 9px !important;
        "
        class="buttons w3-green"
        tooltip="Gravar dados"
        @click="gravarDados()"
      >
        <i class="fas fa-database"></i>
      </a>

      <a
        class="buttons w3-blue"
        style="
          font-size: 30px;
          padding: 4px !important;
          padding-left: 10px !important;
        "
        href="#"
      >
        <i class="fas fa-paw"></i>
      </a>
    </nav>
    <Mensagem ref="enviarMensagem" />
  </div>
</template>

<script>
import ImageUploader from "vue-image-upload-resize";
import api from "../service/api";
import Mensagem from "@/components/Mensagem";
import { TheMask } from "vue-the-mask";
export default {
  name: "DadosPessoais",
  components: {
    ImageUploader,
    Mensagem,
    TheMask,
  },

  data() {
    return {
      endereco: "",
      cpf: "",
      telefone: "",
      whatsapp: "",
      telegram: "",
      dados_pessoais: undefined,
      hasImage: false,
      cpf_valido: true,
      image: "", //require('../assets/imagens/user.png'),
      existe_dados: false,
      processando: false,
    };
  },

  async created() {
    this.processando = true;
    let parametros_locais = JSON.parse(
      localStorage.getItem("parametros-usuario")
    );
    this.dados_pessoais = parametros_locais;
    let parametros_login = localStorage.getItem("autorizacao");
    if (parametros_login != "logado") {
      this.$router.push({ name: "Entrar" });
      return;
    } else {
      await this.prencherTela();
    }
    this.processando = false;
  },

  methods: {
    async prencherTela() {
      this.processando = true;
      let complementar = await api.get(
        "/detailUser/" + this.dados_pessoais.id_usuario
      );

      if (complementar.data.imagem_usuario) {
        this.image = complementar.data.imagem_usuario;
      } else {
        this.$refs.enviarMensagem.exclamar(" erro", "usuario sem foto!");
      }
      console.log("complementar", complementar);
      if (!complementar.data || complementar.data == "") {
        this.$refs.enviarMensagem.exclamar(
          "erro",
          "Por favor complete seus dados"
        );
      } else {
        this.cpf = complementar.data.cpf;
        this.telefone = complementar.data.telefone;
        this.whatsapp = complementar.data.whatsapp;
        this.telegram = complementar.data.telegram;
        this.existe_dados = true;
      }
      this.processando = false;
    },
    setImage: function (file) {
      this.hasImage = true;
      this.image = file;
    },

    async gravarDados() {
      if (this.existe_dados) {
        this.atualizarDados();
        return;
      }
      if (this.validarCPF(this.cpf)) {
        this.cpf_valido = true;
      }else{
        this.cpf_valido = false;
        this.$refs.enviarMensagem.exclamar("erro", "cpf invalido");
        return;
      }
      if (!this.cpf) {
        this.$refs.enviarMensagem.exclamar(" erro", "Campo cpf está vazio!");
        return;
      }

      let sucesso = false;
      this.processando = true;
      await api
        .post("/detailUser/" + this.dados_pessoais.id_usuario, {
          img_user: this.image,
          cpf: this.cpf,
          fone: this.telefone,
          whatsapp: this.whatsapp,
          telegram: this.telegram,
        })
        .then(function (response) {
          if (response.status == 200) {
            sucesso = true;
          } else {
            sucesso = false;
          }
        })
        .catch(function (error) {
          sucesso = false;
        });
      if (sucesso) {
        this.existe_dados = true;
        this.$refs.enviarMensagem.exclamar(
          "info",
          "Dados gravados com sucesso!"
        );
      } else {
        this.$refs.enviarMensagem.exclamar(
          "erro",
          "Não foi possivel gravar dados!"
        );
      }
      this.processando = false;
    },
    async atualizarDados() {
      if (this.validarCPF(this.cpf)) {
        this.cpf_valido = true;
      }else{
        this.cpf_valido = false;
        this.$refs.enviarMensagem.exclamar("erro", "cpf invalido");
        return;
      }
      if (!this.cpf) {
        this.$refs.enviarMensagem.exclamar(" erro", "Campo cpf está vazio!");
        return;
      }
      if (!this.telefone) {
        this.$refs.enviarMensagem.exclamar(" erro", "Telefone não pode ser vazio!");
        return;
      }
       if (!this.whatsapp) {
        this.$refs.enviarMensagem.exclamar(" erro", "Whats app não pode estar vazio!");
        return;
      }

      let sucesso = false;
      this.processando = true;
      await api
        .put("/detailUser/" + this.dados_pessoais.id_usuario, {
          img_user: this.image,
          cpf: this.cpf,
          fone: this.telefone,
          whatsapp: this.whatsapp,
          telegram: this.telegram,
        })
        .then(function (response) {
          if (response.status == 200) {
            sucesso = true;
          } else {
            sucesso = false;
          }
        })
        .catch(function (error) {
          sucesso = false;
        });
      if (sucesso) {
        this.$refs.enviarMensagem.exclamar(
          "info",
          "Dados atualizados com sucesso!"
        );
      } else {
        this.$refs.enviarMensagem.exclamar(
          "erro",
          "Não foi possivel atualizar  dados!"
        );
      }
      this.processando = false;
    },

    validarCPF(cpf) {

      console.log(cpf);

      try {

        // logica para verificar cpf retirada do site
        // https://laennder.com/como-e-feito-o-calculo-de-validacao-cpf/
        // 123.456.789-10 (CPF inválido)
        // 123.456.789-09 (CPF válido)

        if(cpf.length > 11 || cpf.length < 11) return false;

        if(
          cpf.charAt(0) === cpf.charAt(1) &&
          cpf.charAt(1) === cpf.charAt(2) &&
          cpf.charAt(2) === cpf.charAt(3) &&
          cpf.charAt(3) === cpf.charAt(4) &&
          cpf.charAt(4) === cpf.charAt(5) &&
          cpf.charAt(5) === cpf.charAt(6) &&
          cpf.charAt(6) === cpf.charAt(7) &&
          cpf.charAt(7) === cpf.charAt(8) &&
          cpf.charAt(8) === cpf.charAt(9) &&
          cpf.charAt(9) === cpf.charAt(10)) return false;

        let cpfString = cpf;
        let pesos1 = [ 10, 9, 8, 7, 6, 5, 4, 3, 2 ];
        let pesos2 = [ 11, 10, 9, 8, 7, 6, 5, 4, 3, 2 ];
        let somatoria = 0;
        let resto;
        let primeiroDigitoVerificador;
        let segundoDigitoVerificador;

        for (let i = 0; i < 9; i++) {
          somatoria += parseInt(cpfString.charAt(i)) * pesos1[i];
        }

        resto = somatoria % 11;
        primeiroDigitoVerificador = 11 - resto;

        if (primeiroDigitoVerificador > 9) {
          primeiroDigitoVerificador = 0;
        }

        cpfString = cpfString + (primeiroDigitoVerificador).toString();

        somatoria = 0;

        for (let i = 0; i < 10; i++) {
          somatoria += parseInt(cpfString.charAt(i)) * pesos2[i];
        }

        resto = somatoria % 11;

        segundoDigitoVerificador = 11 - resto;

        if (segundoDigitoVerificador > 9) {
          segundoDigitoVerificador = 0;
        }

        cpfString = cpf;

        return (parseInt(cpfString.charAt(9)) === primeiroDigitoVerificador
          && parseInt(cpfString.charAt(10)) === segundoDigitoVerificador);

      } catch (e) {
        console.log(e);
        return false;
      }

      //this.cpf_valido = false;
      //this.$refs.enviarMensagem.exclamar("erro", "cpf invalido");

    },
  },
};
</script>

<style scoped>
.margin-top-100 {
  margin-top: 100px;
}

.margin-top-15 {
  margin-top: 15px;
}

.border-img {
  border: 3px solid black;
}
</style>
