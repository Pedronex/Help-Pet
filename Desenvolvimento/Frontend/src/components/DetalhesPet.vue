<template>
  <div
    class="geral w3-container extender-div-tela-toda w3-center"
    style="padding: 0px"
  >
    <div
      id="atualizar-pet"
      v-if="mostrar_modal"
      class="w3-modal"
      style="display: block"
    >
      <div class="w3-modal-content">
        <div class="w3-container">
          <span
            @click="mostrar_modal = false"
            class="w3-button w3-display-topright"
            >&times;</span
          >
          <p class="">Encontrou meu pet?</p>
          <p class="w3-btn w3-orange" @click="opcoes('atualizar')">
            Atualizar localização
          </p>
          <p class="w3-btn w3-blue" @click="opcoes('ver')">
            Apenas ver a ultima localização do pet
          </p>
        </div>
      </div>
    </div>
    <div
      id="deletar"
      v-if="tem_certeza"
      class="w3-modal"
      style="display: block"
    >
      <div class="w3-modal-content">
        <div class="w3-container">
          <span
            @click="tem_certeza = false"
            class="w3-button w3-display-topright"
            >&times;</span
          >
          <p class="">Tem certeza que quer excluir pet?</p>
          <p class="w3-btn w3-green" @click="deletarPet(true)">Sim</p>
          <p class="w3-btn w3-red" @click="tem_certeza = false">Não</p>
        </div>
      </div>
    </div>
    <div class="w3-blue w3-col">
      <h2 class="w3-col w3-center bold-500">Detalhes Pet</h2>
    </div>

    <div class="margin-top-80">
      <div class="w3-center">
        <img
          :src="image"
          alt=""
          class="w3-border"
          height="150"
          style="border-radius: 50%; box-shadow: 5px 1px 20px 0px"
          width="150"
        />
      </div>
    </div>

    <div id="visualizar">
      <div class="w3-container w3-col">
        <span
          :style="getStatus()"
          class="w3-span w3-margin-top w3-text-black bold-500 w3-col w3-left-align"
          v-if="!editando"
        >
          <i class="fas fa-exclamation-circle"></i> :
          <label style="color: green" v-if="status == 'n'">Normal</label>
          <label style="color: #e6b800" v-if="status == 'a'">Para adoção</label>
          <label style="color: red" v-if="status == 'd'">Desaparecido</label>
          <label style="color: blue" v-if="status == 'l'">Localizado</label>
        </span>
      </div>

      <div
        v-if='id_pet_dono != id_logado && this.whatsapp !== ""'
        class="w3-col w3-blue w3-btn"
        @click="chamar()"
      >
        <i class="fab fa-whatsapp"></i> Falar com proprietario agora
      </div>
     
      <div v-if='endereco !== undefined && endereco.cep !== undefined' class="w3-col w3-purple w3-btn" @click="mapa(true)">
        <i class="fas fa-map-marked-alt"></i> Casa do pet
      </div>

      <div
        style="box-shadow: 5px 10px 20px 3px; margin-right: 20px"
        class="w3-margin-top w3-border-blue w3-padding w3-round w3-col w3-border w3-container w3-mobile w3-round labels w3-animate-zoom w3-small"
        v-if="!editando"
      >
        <span class="w3-span w3-text-black bold-500 w3-col w3-left-align" v-show='nome_proprietario !== ""'>
          <i class="fas fa-user"></i> :
          <strong class="w3-text-purple">{{ nome_proprietario }}</strong></span
        >
        <span
          class="w3-span w3-margin-top w3-text-black bold-500 w3-col w3-left-align"
        >
          <i class="fas fa-paw"></i> :
          <strong class="w3-text-purple">{{ nome_pet }}</strong>
        </span>
        <span
          class="w3-span w3-margin-top w3-text-black bold-500 w3-col w3-left-align"
          ><i class="fas fa-palette"></i> :
          <strong class="w3-text-purple">{{ cor }}</strong></span
        >
        <span
          class="w3-span w3-margin-top w3-text-black bold-500 w3-col w3-left-align"
          ><i class="fas fa-horse-head"></i> :
          <strong class="w3-text-purple">{{ raca }}</strong></span
        >
        <span
          class="w3-span w3-margin-top w3-text-black bold-500 w3-col w3-left-align"
          ><i class="fas fa-qrcode"></i> :
          <strong class="w3-text-purple">{{ codigo_coleira }}</strong></span
        >
        <span
          class="w3-span w3-margin-top w3-text-black bold-500 w3-col w3-left-align"
          ><i class="fas fa-venus"></i><i class="fas fa-mars"></i> :
          <strong class="w3-text-purple">{{ sexo }}</strong></span
        >
        <span
          class="w3-span w3-margin-top w3-text-black bold-500 w3-col w3-left-align"
          >Descrição :
          <label class="w3-border w3-round w3-col w3-container"
            ><strong class="w3-text-purple">{{ descricao }}</strong></label
          >
        </span>
      </div>
    </div>

    <div
      class="w3-border w3-container w3-round w3-col w3-animate-zoom w3-margin-top w3-small"
      id="editar"
      v-if="editando"
    >
      <div class="margin-top-30 w3-margin-bottom w3-left-align w3-col">
        <span class="margin-left-8 bold-500 font-cinza-meio-claro"
          >Status?
        </span>
        <div>
          <span @click="atualizaStatus('n')" class="w3-text-green bold-500 w3-half">
            <i class="far fa-check-circle" v-if="status == 'n'"></i>
            <i class="far fa-circle" v-else></i>
            <label>Normal</label>
          </span>

          <span @click="atualizaStatus('a')" class="w3-text-yellow bold-500 w3-half">
            <i class="far fa-check-circle" v-if="status == 'a'"></i>
            <i class="far fa-circle" v-else></i>
            <label>Para adoção</label>
          </span>

          <span
            @click="atualizaStatus('d'), atualizarStatusPerdido()"
            class="w3-text-red bold-500 w3-half"
          >
            <i class="far fa-check-circle" v-if="status == 'd'"></i>
            <i class="far fa-circle" v-else></i>
            <label>Perdido</label>
          </span>

          <span @click="atualizaStatus('l')" class="w3-text-blue bold-500 w3-half">
            <i class="far fa-check-circle" v-if="status == 'l'"></i>
            <i class="far fa-circle" v-else></i>
            <label>Encontrado</label>
          </span>
        </div>

        <div
          style="box-shadow: 5px 10px 20px 3px"
          class="w3-col w3-border w3-border-blue w3-padding w3-round w3-margin-top"
          v-if="id_pet_dono == id_logado"
        >
          <label class="w3-col w3-margin-top w3-text-blue">Nome do pet</label>
          <input
            class="w3-input w3-margin-top w3-text-black bold-500"
            placeholder="Nome do pet:"
            type="text"
            v-model="nome_pet"
          />
          <label class="w3-col w3-margin-top w3-text-blue">Raça</label>
          <input
            class="w3-input w3-margin-top w3-text-black bold-500"
            placeholder="Raça:"
            type="text"
            v-model="raca"
          />
          <label class="w3-col w3-margin-top w3-text-blue">Cor</label>
          <input
            class="w3-input w3-margin-top w3-text-black bold-500"
            placeholder="Cor:"
            type="text"
            v-model="cor"
          />
          <label class="w3-col w3-margin-top w3-text-blue">Sexo</label>

          <select
            class="w3-select w3-margin-top w3-text-black bold-500"
            style="max-width: 75% !important"
            id="sexo"
            name="option"
            v-model="sexo"
          >
            <option value="m" class="w3-col">Macho</option>
            <option value="f" class="w3-col">Femea</option>
          </select>

          <label class="w3-col w3-margin-top w3-text-blue"
            >Número da coleira</label
          >
          <input
            class="w3-input w3-margin-top w3-text-black bold-500"
            placeholder="Número da coleira"
            type="text"
            v-model="codigo_coleira"
          />
          <label class="w3-col w3-margin-top w3-text-blue">Descrição</label>
          <textarea
            class="w3-input w3-margin-top w3-text-black bold-500"
            placeholder="Descrição:"
            type="text"
            v-model="descricao"
          ></textarea>
        </div>
      </div>
    </div>

    <nav
      class="container w3-display-bottomright w3-padding"
      style="position: fixed"
    >
      <router-link
        class="buttons w3-orange"
        style="
          font-size: 20px;
          padding: 4px !important;
          padding-left: 5px !important;
        "
        to="/Perfil"
        tooltip="Voltar para perfil"
      >
        <i class="fas fa-arrow-left"></i>
      </router-link>

      <a
        @click="editando = !editando"
        class="buttons w3-brown"
        style="
          font-size: 20px;
          padding: 4px !important;
          padding-left: 5px !important;
        "
        tooltip="Editar"
        v-if="id_pet_dono == id_logado"
      >
        <i class="fas fa-edit"></i>
      </a>

      <label
        v-if="id_pet_dono == id_logado"
        class="buttons w3-purple"
        for="fileInput"
        slot="upload-label"
        style="
          font-size: 20px;
          padding: 4px !important;
          padding-left: 5px !important;
        "
        tooltip="Inserir foto"
      >
        <i class="fas fa-camera"></i>
      </label>
      <image-uploader
        :autoRotate="true"
        :className="['fileinput', { 'fileinput--loaded': hasImage }]"
        :debug="1"
        :preview="false"
        :quality="1.0"
        @input="setImage"
        capture="user"
        class="w3-col"
        doNotResize="gif"
        outputFormat="string"
        style="display: none"
      ></image-uploader>

      <a
        @click="atualizarPet()"
        class="buttons w3-purple"
        v-if="id_pet_dono == id_logado"
        style="
          font-size: 20px;
          padding: 4px !important;
          padding-left: 5px !important;
        "
        tooltip="Atualizar dados"
      >
        <i class="fas fa-sync"></i>
      </a>
      <router-link
        to="/MuralPets"
        style="
          font-size: 20px;
          padding: 4px !important;
          padding-left: 5px !important;
        "
        class="buttons w3-green"
        tooltip="Mural de pets"
      >
        <i class="fas fa-dog"></i>
      </router-link>
      <a
        v-if="id_pet_dono == id_logado"
        @click="deletarPet(false)"
        class="buttons w3-red"
        style="
          font-size: 20px;
          padding: 4px !important;
          padding-left: 5px !important;
        "
        tooltip="Excluir pet"
      >
        <i class="fas fa-trash"></i>
      </a>

      <a
        class="buttons w3-blue"
        style="
          font-size: 30px;
          padding: 4px !important;
          padding-left: 5px !important;
        "
      >
        <i class="fas fa-paw"></i>
      </a>
    </nav>
    <mensagem ref="enviaMensagem" />
  </div>
</template>

<script>
import CapturarImage from "@/components/CapturarImage";
import ImageUploader from "vue-image-upload-resize";
import Mensagem from "@/components/Mensagem";
import api from "@/service/api";

export default {
  components: {
    CapturarImage,
    ImageUploader,
    Mensagem,
  },
  name: "DetalhesPet",
  data() {
    return {
      localizacao: undefined,
      nome_pet: "",
      nome_proprietario: "",
      cor: "",
      raca: "",
      sexo: "",
      codigo_coleira: "",
      status: "",
      descricao: "",
      longitude: undefined,
      latitude: undefined,
      pode_editar: true,
      editando: false,
      mostrar_filtro: false,
      hasImage: false,
      pet: {},
      image: "",
      id_pet_dono: "",
      id_logado: "",
      id_pet: 0,
      mostrar_modal: false,
      tem_certeza: false,
      existe_pet: false,
      endereco: undefined
    };
  },
  async created() {
    let parametros_login = localStorage.getItem("autorizacao");
    let nome_proprietario = JSON.parse(
      localStorage.getItem("parametros-usuario")
    );
    if (parametros_login !== "logado") {
      this.$router.push({ name: "Entrar" });
    }
    if (navigator.geolocation) {
      await navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        this.localizacao = [latitude, longitude];
      });
    }
    let detalhe_pet = this.$route.params.pet
  
    if (detalhe_pet.id_pet) {
      this.existe_pet = true;
    }
    //this.imagem_pet = detalhe_pet.imagem_pet; TODO verificar pois foi trocado para image
    this.id_pet_dono = detalhe_pet.id_usuario_pet_fk
      ? detalhe_pet.id_usuario_pet_fk
      : detalhe_pet.id_usuario;
    this.id_logado = nome_proprietario.id_usuario;
    this.id_pet = detalhe_pet.id_pet;
    this.image = detalhe_pet.imagem_pet;
    this.nome_pet = detalhe_pet.nome_pet.toUpperCase();
  
    this.status = detalhe_pet.status_pet;

    this.sexo = detalhe_pet.sexo_pet;
    this.codigo_coleira = detalhe_pet.numero_coleira;
    this.descricao = detalhe_pet.descricao_pet;
    this.cor = detalhe_pet.cor_pet.toUpperCase();
    this.raca = detalhe_pet.raca_pet.toUpperCase();
    this.longitude = detalhe_pet.longitude;
    this.latitude = detalhe_pet.latitude;
    this.whatsapp = detalhe_pet.whatsapp;
    
    this.buscarDonoPet()
    this.buscarCasaDoPet()
  },

  methods: {
    getStatus() {
      if (this.status == "d") {
        return "color: red!important;";
      } else if (this.status == "a") {
        return "color: #e6b800!important;";
      } else {
        return "color: green!important;";
      }
    },
    atualizarStatusPerdido() {
      let sucesso = true;
      api
        .put("/missingPet/" + this.id_logado, {
          idPet: this.id_pet,
        })
        .then(function (response) {
         
          if (response.data.success == "pet está desaparecido!") {
            sucesso = true;
            
          } else {
            sucesso = false;
          }
        })
        .catch(function (error) {
          sucesso = false;
         
        });
     
      if (sucesso) {
        this.$refs.enviaMensagem.exclamar(
          "sucesso",
          "Status de pet já atualizados, se ouver mais detalhes edite os dados do pet."
        );
      } else {
        this.$refs.enviaMensagem.exclamar(
          "error",
          "Não foi possivel atualizar status perdido."
        );
      }
    },
    async atualizarPet() {
      let sucesso = true;
      await api
        .put("/updatePet/" + this.id_logado, {
          idPet: this.id_pet,
          img_pet: this.image,
          namePet: this.nome_pet,
          sexPet: this.sexo,
          colorPet: this.cor,
          description: this.descricao,
          status: this.status,
          breed: this.raca,
          location: this.localizacao ? this.localizacao : [0,0],
          collarNumber:this.codigo_coleira
        }).then(function (response) {
          sucesso = true;
        }).catch(function (error) {
          sucesso = false;
        });
      if (sucesso) {
        this.$refs.enviaMensagem.exclamar("sucesso", "Pet atualizado.");
      } else {
        this.$refs.enviaMensagem.exclamar(
          "error",
          "Não foi possivel atualizar Pet."
        );
      }
    },
    async buscarDonoPet() {
      let sucesso = true;
      let dados
      await api
        .get("/infoUser/" + this.id_pet_dono)
        .then(function (response) {
          sucesso = true;
          dados = response.data;
        })
        .catch(function (error) {
          sucesso = false;
        });

      if(dados.nome_usuario === undefined || dados.sobrenome_usuario === undefined){
        sucesso = false;
      }

      if (sucesso) {
        this.nome_proprietario = dados.nome_usuario.toUpperCase() + ' ' + dados.sobrenome_usuario.toUpperCase()
      } else {
        this.$refs.enviaMensagem.exclamar(
          "error",
          "Não foi possivel carregar nome do Proprietario."
        );
      }
    },
    async buscarCasaDoPet() {
      let sucesso = true;
      let dados
      await api
        .get("/infoAdress/" + this.id_pet_dono)
        .then(function (response) {
          sucesso = true;
          dados = response.data;
        })
        .catch(function (error) {
          sucesso = false;
        });
      if (sucesso) {
        this.endereco = dados
        //this.$refs.enviaMensagem.exclamar("sucesso", "Casa do pet carregada.");
      }
    },
    async deletarPet(questionar) {
      if (!questionar) {
        this.tem_certeza = true;
      }
      if (questionar) {
        this.tem_certeza = false;
        let sucesso = false;
        

        await api({
          method:'delete',
          url:"/deletePet/" + this.id_logado,
          data:{ idPet: this.id_pet }
      })
          .then(function (response) {
            sucesso = true;
          })
          .catch(function (error) {
            sucesso = false;
          });
        if (sucesso) {
          this.$router.push({ name: "Perfil" });
        } else {
          this.$refs.enviaMensagem.exclamar(
            "error",
            "não foi possivel apagar."
          );
        }
      }
    },
    chamar() {
      window.open("https://api.whatsapp.com/send?phone=55" +
        this.whatsapp +
        "&text=Olá você é responsável por esse pet " +
        this.nome_pet +
        "? &source&data=")
    
    },
    mapa(localizando_casa) {
     
        if(localizando_casa){
          window.open(
          "https://www.google.com.br/maps/search/?api=1&query="+this.endereco.cep);
        }else{
          this.localizacao[1] = this.localizacao[1] + 0.0000001;
          window.pen(
          "https://www.google.com.br/maps/dir//" +
          this.localizacao +
          "/@" +
          this.latitude+','
          +this.longitude + ",66m/data=!3m1!1e3");
        //window.location.href = 'https://www.google.com.br/maps/@'+this.latitude,this.longitude+',20z'
        }
      
    },
    opcoes: function (value) {
      if (value == "atualizar") {
        
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition((position) => {
            const { latitude, longitude } = position.coords;
            this.localizacao = [latitude, longitude];
            this.atualizarPet();
          });
        } else {
          this.$refs.enviaMensagem.exclamar(
            "erro",
            "Não há suporte para localização"
          );
          return false;
        }
      }
      if (value == "ver") {
        this.localizacao[1] = this.localizacao[1] + 0.0000001;
        console.log(this.endereco)
       let endereco_total
        if(this.endereco){
          endereco_total =  (this.endereco.bairro?'+':'')+this.endereco.bairro
          endereco_total += (this.endereco.rua?'+':'')+this.endereco.rua
          endereco_total += (this.endereco.cidade?'+':'')+this.endereco.cidade
          endereco_total += (this.endereco.estado ?'+':'')+this.endereco.estado

        }
         window.open(
          "https://www.google.com.br/maps/search/?api=1&query="+ this.endereco.cep);
        //window.location.href = 'https://www.google.com.br/maps/@'+this.latitude,this.longitude+',16z'
      }
    },
    atualizaStatus(status){
      this.status = status;
    },
    setImage: function (file) {
      this.hasImage = true;
      this.image = file;
    },
    gravarDados() {
      //TODO implementar
    },
  },
};
</script>

<style scoped>
.detalhe-foto-pet {
  max-width: 100%;
  border-radius: 25px;
  width: 200px;
  height: 200px;
  box-shadow: cadetblue 1px 2px 5px 2px;
}

.labels {
  box-shadow: cadetblue 1px 2px 5px 2px;
}
</style>
