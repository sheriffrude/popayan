$(function () {
    FacturasPendientesPorLlegar.Generar();
});

var FacturasPendientesPorLlegar = {
    Generar: function () {
        var parametros = {
            UsuarioId: USUARIO_ID
        };
        ReportsP._Draw($("#content_report"), "Reportes/Produccion/FacturasPendientesPorLlegar.trdp", parametros)
    }
}