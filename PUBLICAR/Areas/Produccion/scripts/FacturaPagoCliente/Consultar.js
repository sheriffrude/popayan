var consultarDetalleFacturaPagoCliente = function () {
    return {

        init: function () {
        },

        /**
        *Funcion para ver el detalle de los pagos de las facturas de clientes
        */
        VerDetallePagoCliente: function (idPago) {
            Utils._OpenModal(URL_DETALLE_PAGO_FACTURA_CLIENTE + "?idPagoCliente=" + idPago, consultarDetalleFacturaPagoCliente.CargarDatosModal, "lg");
        },

        CargarDatosModal: function () {
        }
    }

}();
consultarDetalleFacturaPagoCliente.init();