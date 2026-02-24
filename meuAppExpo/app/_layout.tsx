import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: "#f4511e", // Cor de fundo do cabeçalho
        },
        headerTintColor: "#fff", // Cor do texto e ícones
        headerTitleStyle: {
          fontWeight: "bold",
        },
      }}
    >
      {/* Aqui definimos títulos personalizados para as rotas */}
      <Stack.Screen name="index" options={{ title: "Home" }} />
      <Stack.Screen name="screens/Um" options={{ title: "Segunda Tela" }} />
    </Stack>
  );
}