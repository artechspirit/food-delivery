import { appwriteConfig } from "@/lib/appwrite";
import { useCartStore } from "@/store/cart.store";
import { MenuItem } from "@/type";
import { useState } from "react";
import {
  ActivityIndicator,
  Image,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const MenuCard = ({
  item: { $id, image_url, name, price },
}: {
  item: MenuItem;
}) => {
  const imageUrl = `${image_url}?project=${appwriteConfig.projectId}`;
  const { addItem } = useCartStore();
  const [loading, setLoading] = useState(true);

  return (
    <TouchableOpacity
      className="menu-card"
      style={
        Platform.OS === "android"
          ? { elevation: 10, shadowColor: "#878787" }
          : {}
      }
    >
      <View className="size-32 absolute -top-10 items-center justify-center">
        {loading && (
          <ActivityIndicator size="small" color="#888" className="absolute" />
        )}
        <Image
          source={{ uri: imageUrl }}
          className="size-32"
          resizeMode="contain"
          onLoadStart={() => setLoading(true)}
          onLoadEnd={() => setLoading(false)}
        />
      </View>

      <Text
        className="text-center base-bold text-dark-100 mb-2"
        numberOfLines={1}
      >
        {name}
      </Text>
      <Text className="body-regular text-gray-200 mb-4">From ${price}</Text>
      <TouchableOpacity
        onPress={() =>
          addItem({
            id: $id,
            name,
            price,
            image_url: imageUrl,
            customizations: [],
          })
        }
      >
        <Text className="paragraph-bold text-primary">Add to Cart +</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

export default MenuCard;
