class ErrorApi extends Error {
  constructor(codigoEstado, message, esOperacional = true) {
    super(message);
    this.codigoEstado = codigoEstado;
    this.esOperacional = esOperacional;
    this.status = `${codigoEstado}`.startsWith("4") ? "fail" : "error";
  }
}

export default ErrorApi;
