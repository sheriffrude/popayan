$(function () {
    EstadosPresupuestos.Generar();
});

var EstadosPresupuestos = {
    Generar: function () {
        var parametros = {
            UsuarioId: USUARIO_ID
        };
        ReportsP._Draw($("#content_report"), "Reportes/Trafico/EstadosPresupuestos.trdp", parametros)
    }
}