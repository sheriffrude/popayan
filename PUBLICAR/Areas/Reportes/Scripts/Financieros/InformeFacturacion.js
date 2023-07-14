var InformeFacturacion = {
    Generar: function () {
        var parameters = {
            UsuarioId: USUARIO_ID
        };
        ReportsP._Draw($("#reportInformeFacturacion"), "Reportes/Financieros/InformeFacturacion.trdp", parameters);
    },
}

$(function () {
    InformeFacturacion.Generar();
});
