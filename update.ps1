# Télécharge la dernière version depuis GitHub et écrase les fichiers de l'extension.
# Ensuite : brave://extensions -> bouton « Recharger ».
$branch = "claude/practical-brown-qqrt5f"   # passer à "main" une fois la branche fusionnée
$tmp = Join-Path $env:TEMP "yss-update"
Remove-Item $tmp -Recurse -Force -ErrorAction SilentlyContinue
Invoke-WebRequest "https://github.com/gt3dmakers/youtube_sub_select/archive/refs/heads/$branch.zip" -OutFile "$tmp.zip"
Expand-Archive "$tmp.zip" $tmp -Force
Get-ChildItem (Get-ChildItem $tmp -Directory).FullName | Where-Object Name -ne "update.ps1" |
  Copy-Item -Destination $PSScriptRoot -Recurse -Force
Remove-Item "$tmp.zip", $tmp -Recurse -Force
Write-Host "Mis à jour. Recharge l'extension dans brave://extensions."
