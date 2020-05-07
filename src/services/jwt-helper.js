export class JwtHelper {
  static urlBase64Decode(str) {
    let output = str.replace(/-/g, "+").replace(/_/g, "/");
    
    // Pads JWT part with equal signs
    switch (output.length % 4) {
      case 0:
        break;
      case 2:
        output += "==";
        break;
      case 3:
        output += "=";
        break;
      default:
        throw new Error("Illegal base64url string!");
    }
    const token = window.encodeURI(window.atob(output));
    return decodeURIComponent(token);
  }

  static decodeToken(token = "") {
    if (token === null || token === "") {
      // return { upn: "" };
      return null;
    } 
    const parts = token.split(".");
    if (parts.length !== 3) {
      throw new Error("JWT must have 3 parts");
    }
    const decoded = this.urlBase64Decode(parts[1]);
    if (!decoded) {
      throw new Error("Cannot decode the token");
    }
    return JSON.parse(decoded);
  }
}
