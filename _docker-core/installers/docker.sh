#!/bin/bash
# ==========================================================
# Install Docker
# @author : Franco Barrientos <franco.barrientos@arzov.com>
# ==========================================================

apk add --update docker openrc
rc-update add docker boot