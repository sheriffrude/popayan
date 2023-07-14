$(function () {
    ConsolidadoMensualHorasPorUsuario.Generar();
});

var ConsolidadoMensualHorasPorUsuario = {
    Generar: function () {
        var parametros = {
            UsuarioId: USUARIO_ID
        };
        ReportsP._Draw($("#content_report"), "Reportes/Trafico/ConsolidadoOrdenTrabajoPorPersona.trdp", parametros)
    }
}