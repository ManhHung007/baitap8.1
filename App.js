import React, { useState, useContext, createContext } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
  Platform
} from "react-native";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

/* ================= CONTEXT ================= */

const AppContext = createContext();

/* ================= NAVIGATORS ================= */

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

/* ================= LOGIN SCREEN ================= */

function LoginScreen({ navigation }) {

  const { user, setIsLoggedIn } = useContext(AppContext);
  const [account, setAccount] = useState("");

  const showMessage = (title, message) => {
    if (Platform.OS === "web") {
      alert(message);
    } else {
      Alert.alert(title, message);
    }
  };

  const login = () => {

    const phoneRegex = /^0[0-9]{9}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (account.trim() === "") {
      showMessage("Thông báo", "Vui lòng nhập email hoặc số điện thoại");
      return;
    }

    if (account === user.phone || account === user.email) {
      setIsLoggedIn(true);
      return;
    }

    if (phoneRegex.test(account) || emailRegex.test(account)) {
      showMessage("Lỗi", "Tài khoản chưa đăng ký");
    } else {
      showMessage("Lỗi", "Sai định dạng email hoặc số điện thoại");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>

        <Text style={styles.title}>Đăng nhập</Text>

        <TextInput
          style={styles.input}
          placeholder="Nhập email hoặc số điện thoại"
          value={account}
          onChangeText={setAccount}
        />

        <Pressable style={styles.button} onPress={login}>
          <Text style={styles.buttonText}>Đăng nhập</Text>
        </Pressable>

        <Pressable onPress={() => navigation.navigate("Register")}>
          <Text style={styles.link}>
            Chưa có tài khoản? Đăng ký
          </Text>
        </Pressable>

      </View>
    </View>
  );
}

/* ================= REGISTER SCREEN ================= */

function RegisterScreen({ navigation }) {

  const { setUser } = useContext(AppContext);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const register = () => {

    if (!name || !email || !phone) {
      Alert.alert("Lỗi", "Vui lòng nhập đầy đủ thông tin");
      return;
    }

    setUser({
      name,
      email,
      phone
    });

    Alert.alert("Thành công", "Đăng ký thành công");

    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>

        <Text style={styles.title}>Đăng ký</Text>

        <TextInput
          style={styles.input}
          placeholder="Nhập tên"
          value={name}
          onChangeText={setName}
        />

        <TextInput
          style={styles.input}
          placeholder="Nhập email"
          value={email}
          onChangeText={setEmail}
        />

        <TextInput
          style={styles.input}
          placeholder="Nhập số điện thoại"
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}
        />

        <Pressable style={styles.button} onPress={register}>
          <Text style={styles.buttonText}>Đăng ký</Text>
        </Pressable>

      </View>
    </View>
  );
}

/* ================= HOME ================= */

function HomeScreen() {

  const { user } = useContext(AppContext);

  return (
    <View style={styles.center}>
      <Text style={styles.title}>Home Screen</Text>
      <Text style={styles.profileText}>
        Xin chào {user.name}
      </Text>
    </View>
  );
}

/* ================= PROFILE ================= */

function ProfileScreen() {

  const { user, setIsLoggedIn } = useContext(AppContext);

  const [showInfo, setShowInfo] = useState(false);

  return (
    <View style={styles.center}>

      <Text style={styles.title}>Profile</Text>

      <Pressable
        style={styles.button}
        onPress={() => setShowInfo(!showInfo)}
      >
        <Text style={styles.buttonText}>
          {showInfo ? "Ẩn thông tin" : "Hiện thông tin"}
        </Text>
      </Pressable>

      {showInfo && (
        <View style={{ marginTop: 20 }}>

          <Text style={styles.profileText}>
            Tên: {user.name}
          </Text>

          <Text style={styles.profileText}>
            Email: {user.email}
          </Text>

          <Text style={styles.profileText}>
            SĐT: {user.phone}
          </Text>

        </View>
      )}

      <Pressable
        style={[styles.logout, { marginTop: 25 }]}
        onPress={() => setIsLoggedIn(false)}
      >
        <Text style={styles.buttonText}>Sign Out</Text>
      </Pressable>

    </View>
  );
}

/* ================= TABS ================= */

function MainTabs() {
  return (
    <Tab.Navigator>

      <Tab.Screen
        name="Home"
        component={HomeScreen}
      />

      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
      />

    </Tab.Navigator>
  );
}

/* ================= AUTH STACK ================= */

function AuthStack() {
  return (
    <Stack.Navigator>

      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ title: "Đăng nhập" }}
      />

      <Stack.Screen
        name="Register"
        component={RegisterScreen}
        options={{ title: "Đăng ký" }}
      />

    </Stack.Navigator>
  );
}

/* ================= MAIN STACK ================= */

function MainStack() {
  return (
    <Stack.Navigator>

      <Stack.Screen
        name="Main"
        component={MainTabs}
        options={{ headerShown: false }}
      />

    </Stack.Navigator>
  );
}

/* ================= APP NAVIGATOR ================= */

function AppNavigator() {

  const { isLoggedIn } = useContext(AppContext);

  return (
    <NavigationContainer>
      {isLoggedIn ? <MainStack /> : <AuthStack />}
    </NavigationContainer>
  );
}

/* ================= APP ================= */

export default function App() {

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [user, setUser] = useState({
    name: "",
    email: "",
    phone: ""
  });

  return (
    <AppContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
        user,
        setUser
      }}
    >
      <AppNavigator />
    </AppContext.Provider>
  );
}

/* ================= STYLE ================= */

const styles = StyleSheet.create({

  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#fff"
  },

  content: {
    padding: 24
  },

  title: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 20
  },

  input: {
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    marginBottom: 20,
    fontSize: 16,
    height: 45
  },

  button: {
    backgroundColor: "#4CAF50",
    height: 45,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 6
  },

  buttonText: {
    color: "#fff",
    fontSize: 16
  },

  link: {
    marginTop: 15,
    color: "blue"
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },

  profileText: {
    fontSize: 18,
    marginBottom: 10
  },

  logout: {
    backgroundColor: "red",
    padding: 12,
    borderRadius: 6
  }

});