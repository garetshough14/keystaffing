$ErrorActionPreference = 'Stop'

$repositoryRoot = Split-Path -Parent $PSScriptRoot
$cssPath = Join-Path $repositoryRoot 'styles.css'
$templatePath = Join-Path $PSScriptRoot 'partials\header.template.html'
$outputPath = Join-Path $PSScriptRoot 'partials\header.html'
$placeholder = '/*__KSC_INLINE_CSS__*/'

$css = Get-Content -LiteralPath $cssPath -Raw
$template = Get-Content -LiteralPath $templatePath -Raw

if (-not $template.Contains($placeholder)) {
  throw "Inline CSS placeholder is missing from $templatePath"
}

$output = $template.Replace($placeholder, $css.Trim())
$encoding = [System.Text.UTF8Encoding]::new($false)
[System.IO.File]::WriteAllText($outputPath, $output, $encoding)

Write-Output "Built $outputPath with embedded CSS from $cssPath"
