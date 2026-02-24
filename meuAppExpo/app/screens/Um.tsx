import { View, StyleSheet, Image, TouchableOpacity, Alert, Text } from "react-native";
import { Link } from "expo-router";

// Importação da imagem (ajustada para o caminho da sua estrutura)
// @ts-ignore
import logo from "../../assets/images/splash-icon.png";

export default function Um() {
  
  // Função que exibe o alerta solicitado
  const exibirAlerta = () => {
    Alert.alert("Boa noite!");
  };

  return (
    <View style={styles.container}>
      
      {/* PARTE DE CIMA (50% da altura) */}
      <View style={styles.topo}>
        
        {/* Esquerda: Verde */}
        <View style={styles.verde}>
          <TouchableOpacity onPress={exibirAlerta}>
            <Image source={logo} style={styles.imagemEstilo} />
          </TouchableOpacity>
        </View>

        {/* Direita: Subdividida (Teal e Skyblue) */}
        <View style={styles.colunaDireita}>
          <View style={styles.topoDireita}>
            <TouchableOpacity onPress={exibirAlerta}>
              <Image source={logo} style={styles.imagemEstilo} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.baixoDireita}>
            <TouchableOpacity onPress={exibirAlerta}>
              <Image source={logo} style={styles.imagemEstilo} />
            </TouchableOpacity>
          </View>
        </View>

      </View>

      {/* PARTE DE BAIXO (Salmão) */}
      <View style={styles.base}>
        <TouchableOpacity onPress={exibirAlerta}>
          <Image source={logo} style={styles.imagemEstilo} />
        </TouchableOpacity>

        {/* Botão de navegação mantido conforme solicitado */}
        <View style={styles.containerNavegacao}>
            <Link href="/" style={styles.linkHome}>
                <Text style={styles.textoLink}>Voltar para Home</Text>
            </Link>
        </View>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topo: {
    flex: 0.5,
    flexDirection: "row",
  },
  verde: {
    flex: 0.5,
    backgroundColor: "lime",
    justifyContent: "center",
    alignItems: "center",
  },
  colunaDireita: {
    flex: 0.5,
    flexDirection: "column",
  },
  topoDireita: {
    flex: 0.5,
    backgroundColor: "teal",
    justifyContent: "center",
    alignItems: "center",
  },
  baixoDireita: {
    flex: 0.5,
    backgroundColor: "skyblue",
    justifyContent: "center",
    alignItems: "center",
  },
  base: {
    flex: 0.5,
    backgroundColor: "salmon",
    justifyContent: "center",
    alignItems: "center",
  },
  // Tamanho 64x64 conforme dica do exercício
  imagemEstilo: {
    width: 64,
    height: 64,
  },
  containerNavegacao: {
    position: 'absolute',
    bottom: 40,
  },
  linkHome: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 8,
  },
  textoLink: {
    color: 'salmon',
    fontWeight: 'bold',
  }
});