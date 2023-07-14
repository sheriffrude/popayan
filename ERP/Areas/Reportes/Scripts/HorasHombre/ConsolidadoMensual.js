$(function () {
    ConsolidadoMensual.Generar();
});

var ConsolidadoMensual = {
    Generar: function () {
        var parametros = {
            UsuarioId: USUARIO_ID
        };
        ReportsP._Draw($("#content_report"), "Reportes/HorasHombre/ConsolidadoMensual.trdp", parametros)
    }
}