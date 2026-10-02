import { Text, View } from "react-native";
import { verifyInstallation } from "nativewind";

export default function Index() {
  verifyInstallation();
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#FDE2EC",
      }}
    >
      <Text style={{ color: "#D6336C", fontSize: 20 }}>
        Rendu sans NativeWind : OK
      </Text>
      <View className="mt-4 rounded-xl bg-pink-600 px-4 py-2">
        <Text className="font-bold text-white">Rendu avec NativeWind : OK</Text>
      </View>
    </View>
  );
}