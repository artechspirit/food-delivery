import { CreateUserParams, SignInParams } from "@/type";
import {
  Account,
  Avatars,
  Client,
  Databases,
  ID,
  Query,
  Storage,
} from "react-native-appwrite";

export const appwriteConfig = {
  endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT!,
  projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!,
  platform: "com.artechspirit.fooddelivery",
  databaseId: "6874e2fa003b304e77f9",
  bucketId: "68752b1e002e2d252fb7",
  userCollectionId: "6874e32f0002c73787a7",
  categoriesCollectionId: "68751dc30001bd4285d9",
  menuCollectionId: "6875246300040719a120",
  customizationsCollectionId: "6875265f0016c40c3e6a",
  menuCustomizationsCollectionId: "6875278000390e8db89d",
};

export const client = new Client();

client
  .setEndpoint(appwriteConfig.endpoint)
  .setProject(appwriteConfig.projectId)
  .setPlatform(appwriteConfig.platform);

export const account = new Account(client);
export const databases = new Databases(client);
export const avatars = new Avatars(client);
export const storage = new Storage(client);

export const createUser = async ({
  email,
  password,
  name,
}: CreateUserParams) => {
  try {
    const newAccount = await account.create(ID.unique(), email, password, name);
    if (!newAccount) throw Error;

    await signIn({ email, password });

    const avatarUrl = avatars.getInitialsURL(name);

    return await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      ID.unique(),
      { email, name, accountId: newAccount.$id, avatar: avatarUrl }
    );
  } catch (e) {
    throw new Error(e as string);
  }
};

export const signIn = async ({ email, password }: SignInParams) => {
  try {
    await account.createEmailPasswordSession(email, password);
  } catch (error) {
    throw new Error(error as string);
  }
};

export const getCurrentUser = async () => {
  try {
    const currentAccount = await account.get();
    if (!currentAccount) throw Error;

    const currentUser = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal("accountId", currentAccount.$id)]
    );

    if (!currentAccount) throw Error;

    return currentUser.documents[0];
  } catch (error) {
    throw new Error(error as string);
  }
};
