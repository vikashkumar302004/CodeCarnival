$ErrorActionPreference = "Stop"
$repositoryRoot = Split-Path -Parent $PSScriptRoot
$extensionRoot = Join-Path $repositoryRoot "extension"
$outputRoot = Join-Path $repositoryRoot "dist"
$archivePath = Join-Path $outputRoot "codecarnival-extension.zip"

if (-not (Test-Path -LiteralPath $outputRoot)) {
  New-Item -ItemType Directory -Path $outputRoot | Out-Null
}

if (Test-Path -LiteralPath $archivePath) {
  Remove-Item -LiteralPath $archivePath
}

Compress-Archive -Path (Join-Path $extensionRoot "*") -DestinationPath $archivePath -CompressionLevel Optimal
Write-Output "Created $archivePath"

