#!/bin/bash
# ==========================================================
# Generar template.yml para AWS
# Author : Franco Barrientos <franco.barrientos@arzov.com>
# ==========================================================


# Generar template.yml a partir de header.yml y archivos resource.yml
cat header.yml > template.yml
for i in $(find . -type d -name node_modules -prune -o -name "resource.yml");do cat $i >> template.yml;done
cat footer.yml >> template.yml