$(function () {
    ConsolidadoMisOrdenesTrabajo.Generar();
});

var ConsolidadoMisOrdenesTrabajo = {
    Generar: function () {
        var parametros = {
            IdUsuario: USUARIO_ID
        };
        ReportsP._Draw($("#content_report"), "Reportes/Trafico/ConsolidadoMisOrdenesTrabajo.trdp", parametros)
    }
}