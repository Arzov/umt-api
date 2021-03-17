#!/bin/bash
# ==========================================================
# Create template.yml for AWS SAM
# @author : Franco Barrientos <franco.barrientos@arzov.com>
# ==========================================================


# Create `template.yml` from `header.yml` and `resource.yml` files
cat header.yml > template.yml
for i in $(find . -type d -name node_modules -prune -o -name "resource.yml");do cat $i >> template.yml;done
cat footer.yml >> template.yml