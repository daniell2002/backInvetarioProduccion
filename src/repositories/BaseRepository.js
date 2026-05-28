/**
 * Repositorio base — Operaciones CRUD genéricas.
 * Todos los repositorios del sistema extienden esta clase.
 */
class BaseRepository {
  constructor(modelo) {
    this.model = modelo;
  }

  async findById(id, opciones = {}) {
    return await this.model.findById(id, null, opciones);
  }

  async findOne(filtro, opciones = {}) {
    return await this.model.findOne(filtro, null, opciones);
  }

  async findAll(filtro = {}, opciones = {}) {
    return await this.model.find(filtro, null, opciones);
  }

  async create(datos, opciones = {}) {
    const [documento] = await this.model.create([datos], opciones);
    return documento;
  }

  async createMany(datos, opciones = {}) {
    return await this.model.create(datos, opciones);
  }

  async updateById(id, datos, opciones = {}) {
    return await this.model.findByIdAndUpdate(id, datos, {
      new: true,
      runValidators: true,
      ...opciones,
    });
  }

  async updateOne(filtro, datos, opciones = {}) {
    return await this.model.findOneAndUpdate(filtro, datos, {
      new: true,
      runValidators: true,
      ...opciones,
    });
  }

  async updateMany(filtro, datos, opciones = {}) {
    return await this.model.updateMany(filtro, datos, opciones);
  }

  async softDelete(id, opciones = {}) {
    return await this.model.findByIdAndUpdate(
      id,
      { $set: { activo: false } },
      { new: true, ...opciones },
    );
  }

  async deleteById(id, opciones = {}) {
    return await this.model.findByIdAndDelete(id, opciones);
  }

  async countDocuments(filtro = {}) {
    return await this.model.countDocuments(filtro);
  }

  /**
   * Paginación estándar con los 6 campos obligatorios.
   */
  async findPaginado(
    filtro = {},
    pagina = 1,
    limite = 50,
    ordenamiento = { createdAt: -1 },
  ) {
    const saltar = (pagina - 1) * limite;

    const [documentos, total] = await Promise.all([
      this.model.find(filtro).sort(ordenamiento).skip(saltar).limit(limite),
      this.model.countDocuments(filtro),
    ]);

    return {
      documentos,
      paginacion: {
        pagina: parseInt(pagina),
        limite: parseInt(limite),
        total,
        totalPaginas: Math.ceil(total / limite),
        hayPaginaSiguiente: pagina * limite < total,
        hayPaginaAnterior: pagina > 1,
      },
    };
  }
}

export default BaseRepository;
