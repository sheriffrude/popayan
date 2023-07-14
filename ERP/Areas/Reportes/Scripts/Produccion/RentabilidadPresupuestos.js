$(function () {
    RentabilidadPresupuestos.Generar();
});

var RentabilidadPresupuestos = {
    Generar: function () {
        var parametros = {
            UsuarioId: USUARIO_ID
        };
        ReportsP._Draw($("#content_report"), "Reportes/Produccion/RentabilidadPresupuestos.trdp", parametros)
    }
}