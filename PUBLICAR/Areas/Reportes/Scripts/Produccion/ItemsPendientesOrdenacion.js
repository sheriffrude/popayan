$(function () {
    ItemsPendientesOrdenacion.Generar();
});

var ItemsPendientesOrdenacion = {
    Generar: function () {
        var parametros = {
            UsuarioId: USUARIO_ID
        };
        ReportsP._Draw($("#content_report"), "Reportes/Produccion/ItemsPendientesOrdenacion.trdp", parametros)
    }
}