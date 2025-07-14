import { useAuthStore } from "@/auth.store";
import { Redirect, Slot } from "expo-router";

const TabsLayout = () => {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) return <Redirect href="/(auth)/sign-in" />;

  return <Slot />;
};

export default TabsLayout;
