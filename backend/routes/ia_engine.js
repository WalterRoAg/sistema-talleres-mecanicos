const express = require('express');
const router = express.Router();

// CU22: Consultar Información del Incidente (Clasificación y Resumen)
router.post('/analizar', (req, res) => {
    const { descripcion, imagenes, audio } = req.body;

    // Lógica del Módulo 3: Motor de clasificación
    let especialidad = "Mecánica General";
    if (descripcion.toLowerCase().includes("llanta")) especialidad = "Gomería";
    
    // CU12: Realizar Prechequeo Guiado (Lógica diferencial)
    const requiereMasEvidencia = (!imagenes || imagenes.length === 0);
    
    res.json({
        resumen_ia: `Se detecta posible fallo en sistema de ${especialidad}.`,
        clasificacion: especialidad,
        requiere_prechequeo: requiereMasEvidencia, // Si es true, dispara CU12 en la App
        pregunta_ia: requiereMasEvidencia ? "¿Podría adjuntar una foto del área afectada para validar el daño?" : null
    });
});

module.exports = router;