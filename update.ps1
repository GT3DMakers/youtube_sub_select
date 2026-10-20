# Télécharge la dernière version depuis GitHub et écrase les fichiers de l'extension.
# Dépôt privé : mettre un jeton GitHub (lecture « Contents ») dans un fichier token.txt à côté de ce script.
# Ensuite : brave://extensions -> bouton « Recharger ».
$ErrorActionPreference = "Stop"
$branch = "claude/practical-brown-qqrt5f"   # passer à "main" une fois la branche fusionnée
$tmp = Join-Path $env:TEMP "yss-update"
Remove-Item "$tmp.zip", $tmp -Recurse -Force -ErrorAction SilentlyContinue
$tokenFile = Join-Path $PSScriptRoot "token.txt"
if (Test-Path $tokenFile) {
  $headers = @{ Authorization = "Bearer $((Get-Content $tokenFile -Raw).Trim())" }
  Invoke-WebRequest "https://api.github.com/repos/gt3dmakers/youtube_sub_select/zipball/$branch" -Headers $headers -OutFile "$tmp.zip"
} else {
  Invoke-WebRequest "https://github.com/gt3dmakers/youtube_sub_select/archive/refs/heads/$branch.zip" -OutFile "$tmp.zip"
}
Expand-Archive "$tmp.zip" $tmp -Force
Get-ChildItem (Get-ChildItem $tmp -Directory).FullName | Where-Object Name -ne "update.ps1" |
  Copy-Item -Destination $PSScriptRoot -Recurse -Force
Remove-Item "$tmp.zip", $tmp -Recurse -Force
Write-Host "Mis à jour. Recharge l'extension dans brave://extensions."
