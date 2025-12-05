import axios from "axios";
import { Platform } from "react-native";

const baseURL =
  Platform.OS === "android"
    ? "http://10.0.2.2:5000"   // Android emulator → host
    : "http://localhost:5000"; // iOS simulator → host

export const api = axios.create({ baseURL });

// Example function for alerts endpoint
export async function fetchAlerts() {
  const { data } = await api.get("/alerts");
  return data;
}
