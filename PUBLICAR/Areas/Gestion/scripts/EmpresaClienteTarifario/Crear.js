function onSuccessCrearClienteTarifario() {
    setTimeout(function () {
        if ($TABLA_EMPRESA_CLIENTE_TARIFARIO != null) {
            $TABLA_EMPRESA_CLIENTE_TARIFARIO.draw();
        }
    }, 1000);
}