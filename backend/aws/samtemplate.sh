#!/bin/bash
# ==========================================================
# Generar template.yml para AWS
# Author : Franco Barrientos <franco.barrientos@arzov.com>
# ==========================================================


# Generar template.yml a partir de header.yml y archivos resource.yml
cat header.yml > template.yml
for i in $(find -name "resource.yml" -not -path "*/node_modules/*");do cat $i >> template.yml;done
cat footer.yml >> template.yml