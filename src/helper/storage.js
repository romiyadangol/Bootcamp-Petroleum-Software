import SecureLS from "secure-ls";

const ls = new SecureLS({ encodingType: "aes" });

export const storeToken = (token, roles) => {
  try {
    ls.set("authToken", token);
    ls.set("userRole", roles);
  } catch (e) {
    console.error("Error storing token:", e);
  }
};

export const getToken = () => {
  try {
    return ls.get("authToken") ?? null;
  } catch (e) {
    console.error("Error retrieving token:", e);
  }
};

export const removeToken = () => {
  try {
    ls.clear();
  } catch (e) {
    console.error("Error removing token:", e);
  }
};
