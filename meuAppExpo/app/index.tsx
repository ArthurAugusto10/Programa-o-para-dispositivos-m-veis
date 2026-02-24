import { View, StyleSheet, Text } from "react-native";
import { Link } from "expo-router";
import { StatusBar } from "expo-status-bar";
import Um from "./screens/Um";

export default function Index() {
  return (
    <View style={{ flex: 1 }}>
      {/* Requisito: Esconder a StatusBar */}
      <StatusBar hidden={true} />

      {/* Container Principal da Index */}
      <View style={styles.container}>
        
        <View style={styles.filhoUm}>
          <Text style={styles.titulo}>Página Inicial</Text>
        </View>

        <View style={styles.filhoDois}>
          {/* Botão para ir para a tela 'Um' */}
          <Link href="/screens/Um" style={styles.botao}>
            <Text style={styles.botaoTexto}>Ir para a Tela Um</Text>
          </Link>
        </View>

      </View>
    </View>
  );
}

// Reutilizando os estilos para manter a consistência visual
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
  },
  filhoUm: {
    flex: 0.5,
    backgroundColor: "#f4511e",
    justifyContent: "center",
    alignItems: "center",
  },
  filhoDois: {
    flex: 0.5,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  titulo: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
  },
  botao: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 8,
  },
  botaoTexto: {
    color: "crimson",
    fontWeight: "bold",
  },
});