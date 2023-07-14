function onSuccessCrearTarifarioSubGrupo() {
    setTimeout(function () {
        if ($TABLA_TARIFARIO_SUBGRUPO != null) {
            $TABLA_TARIFARIO_SUBGRUPO.draw();
        }
    }, 1000);
}