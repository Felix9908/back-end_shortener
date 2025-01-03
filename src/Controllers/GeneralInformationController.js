import db from "../../models/index.js";

const { generalinformation } = db;

// Crear un nuevo registro en GeneralInformation
export const createGeneralInformation = async (req, res) => {
  try {
    const { cpmGeneral, mensajeInformativo, gananciasTotales, porcentajeGananciaReferido } = req.body;

    const newGeneralInfo = await generalinformation.create({
      cpmGeneral,
      mensajeInformativo,
      gananciasTotales,
      porcentajeGananciaReferido
    });

    return res.status(201).json(newGeneralInfo);
  } catch (error) {
    console.error('Error al crear la información general:', error);
    return res.status(500).json({ error: 'Error al crear la información general.' });
  }
};

// Obtener todos los registros de GeneralInformation
export const getAllGeneralInformation = async (req, res) => {
  try {
    const generalInfoList = await generalinformation.findAll();
    return res.status(200).json(generalInfoList);
  } catch (error) {
    console.error('Error al obtener la información general:', error);
    return res.status(500).json({ error: 'Error al obtener la información general.' });
  }
};

// Actualizar un registro en GeneralInformation por ID
export const updateGeneralInformation = async (req, res) => {
  try {
    const { id } = req.params;
    const { cpmGeneral, mensajeInformativo, gananciasTotales, porcentajeGananciaReferido } = req.body;

    const generalInfo = await generalinformation.findByPk(id);

    if (!generalInfo) {
      return res.status(404).json({ error: 'Información general no encontrada.' });
    }

    await generalInfo.update({
      cpmGeneral,
      mensajeInformativo,
      gananciasTotales,
      porcentajeGananciaReferido
    });

    return res.status(200).json(generalInfo);
  } catch (error) {
    console.error('Error al actualizar la información general:', error);
    return res.status(500).json({ error: 'Error al actualizar la información general.' });
  }
};

// Eliminar un registro en GeneralInformation por ID
export const deleteGeneralInformation = async (req, res) => {
  try {
    const { id } = req.params;

    const generalInfo = await generalinformation.findByPk(id);

    if (!generalInfo) {
      return res.status(404).json({ error: 'Información general no encontrada.' });
    }

    await generalInfo.destroy();
    return res.status(200).json({ message: 'Información general eliminada correctamente.' });
  } catch (error) {
    console.error('Error al eliminar la información general:', error);
    return res.status(500).json({ error: 'Error al eliminar la información general.' });
  }
};
