export default function signUserOut() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  localStorage.removeItem("expiration");
}
