class RespuestaApi {
  static exito(reply, mensaje, datos = {}, codigoEstado = 200) {
    return reply.status(codigoEstado).send({
      statusCode: codigoEstado,
      status: "success",
      message: mensaje,
      data: datos,
    });
  }

  static error(reply, mensaje, codigoEstado = 400) {
    return reply.status(codigoEstado).send({
      statusCode: codigoEstado,
      status: codigoEstado < 500 ? "fail" : "error",
      message: mensaje,
    });
  }
}

export default RespuestaApi;
