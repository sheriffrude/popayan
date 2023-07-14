$(function () {
    ListaTareas.Generar();
});

var ListaTareas = {
    Generar: function () {
        var parametros = {
            IdUsuario: USUARIO_ID
        };
        ReportsP._Draw($("#content_report"), "Reportes/Trafico/ListaTareas.trdp", parametros)
    }
}