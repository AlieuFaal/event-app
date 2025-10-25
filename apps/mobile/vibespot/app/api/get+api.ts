import { fetch } from "expo/fetch";

export async function getData() {
  const databaseUrl = new URL(process.env.EXPO_DATABASE_URL!);  
  const response = await fetch(databaseUrl.toString());

  const data = await response.json();
  console.log("Fetched data:", data);
  return data;
}

export function GET(request: Request) {
  return re
}