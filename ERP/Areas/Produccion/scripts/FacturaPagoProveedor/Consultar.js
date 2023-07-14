var consultarDetalleFacturaPagoProveedor = function () {
    return {

        init: function () {
        },

        /**
        *Funcion para ver el detalle de los pagos de las facturas de proveedores
        */
        VerDetallePagoProveedor: function (idPago) {
            Utils._OpenModal(URL_DETALLE_PAGO_FACTURA_PROVEEDOR + "?idPagoProveedor=" + idPago, consultarDetalleFacturaPagoProveedor.CargarDatosModal, "lg");
        },

        CargarDatosModal: function () {

        }

    }
}();
consultarDetalleFacturaPagoProveedor.init();