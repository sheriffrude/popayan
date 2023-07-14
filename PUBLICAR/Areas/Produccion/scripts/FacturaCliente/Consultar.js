var consultarDetalleFacturaCliente = function () {
    return {

        URL_DETALLE_FACTURA_CLIENTE: null,

        init: function () {
            this.URL_DETALLE_FACTURA_CLIENTE = "/Produccion/FacturaCliente/Consultar";
        },

        /**
        *Funcion para ver el detalle del registro de la factura del cliente
        */
        VerDetalleFacturaCliente: function (facturaId) {
            Utils._OpenModal(consultarDetalleFacturaCliente.URL_DETALLE_FACTURA_CLIENTE + "?facturaId=" + facturaId, consultarDetalleFacturaCliente.CargarDatosModal, "lg");
        },

        CargarDatosModal: function () {
        }

    }
}();
consultarDetalleFacturaCliente.init();