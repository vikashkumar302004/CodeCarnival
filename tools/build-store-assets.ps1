$ErrorActionPreference = "Stop"
Add-Type -AssemblyName System.Drawing

$repositoryRoot = Split-Path -Parent $PSScriptRoot
$masterPath = Join-Path $repositoryRoot "store-assets\codecarnival-master-icon.png"
$iconRoot = Join-Path $repositoryRoot "extension\icons"
$storeRoot = Join-Path $repositoryRoot "store-assets"

function Export-SquareIcon([int]$size) {
  $source = [System.Drawing.Image]::FromFile($masterPath)
  try {
    $bitmap = New-Object System.Drawing.Bitmap($size, $size)
    $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
    try {
      $graphics.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
      $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
      $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
      if ($size -eq 128) {
        $graphics.Clear([System.Drawing.Color]::Transparent)
        $graphics.DrawImage($source, 16, 16, 96, 96)
      } else {
        $graphics.DrawImage($source, 0, 0, $size, $size)
      }
      $bitmap.Save((Join-Path $iconRoot "icon-$size.png"), [System.Drawing.Imaging.ImageFormat]::Png)
    } finally {
      $graphics.Dispose()
      $bitmap.Dispose()
    }
  } finally {
    $source.Dispose()
  }
}

function Export-PromoTile {
  $width = 440
  $height = 280
  $bitmap = New-Object System.Drawing.Bitmap($width, $height)
  $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
  $source = [System.Drawing.Image]::FromFile($masterPath)
  try {
    $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $background = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
      (New-Object System.Drawing.Rectangle(0, 0, $width, $height)),
      ([System.Drawing.Color]::FromArgb(8, 10, 22)),
      ([System.Drawing.Color]::FromArgb(34, 17, 48)),
      18
    )
    $graphics.FillRectangle($background, 0, 0, $width, $height)
    $background.Dispose()
    $graphics.DrawImage($source, 24, 46, 188, 188)
    $titleFont = New-Object System.Drawing.Font("Segoe UI", 26, [System.Drawing.FontStyle]::Bold)
    $bodyFont = New-Object System.Drawing.Font("Segoe UI", 11, [System.Drawing.FontStyle]::Regular)
    $white = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(248, 246, 252))
    $gold = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 207, 74))
    $muted = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(173, 168, 184))
    $graphics.DrawString("Code", $titleFont, $white, 222, 78)
    $graphics.DrawString("Carnival", $titleFont, $gold, 222, 111)
    $graphics.DrawString("Every Accepted deserves", $bodyFont, $muted, 225, 164)
    $graphics.DrawString("a celebration.", $bodyFont, $muted, 225, 183)
    $titleFont.Dispose(); $bodyFont.Dispose(); $white.Dispose(); $gold.Dispose(); $muted.Dispose()
    $bitmap.Save((Join-Path $storeRoot "promo-small-440x280.png"), [System.Drawing.Imaging.ImageFormat]::Png)
  } finally {
    $source.Dispose()
    $graphics.Dispose()
    $bitmap.Dispose()
  }
}

function Export-StoreScreenshot {
  $width = 1280
  $height = 800
  $bitmap = New-Object System.Drawing.Bitmap($width, $height)
  $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
  $source = [System.Drawing.Image]::FromFile($masterPath)
  try {
    $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $graphics.Clear([System.Drawing.Color]::FromArgb(8, 9, 14))
    $purple = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(31, 20, 51))
    $panel = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(20, 21, 31))
    $panelTwo = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(12, 15, 24))
    $white = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(245, 242, 249))
    $muted = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(151, 146, 160))
    $gold = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 207, 74))
    $mint = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(124, 247, 197))
    $line = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(42, 255, 255, 255), 1)
    $titleFont = New-Object System.Drawing.Font("Segoe UI", 33, [System.Drawing.FontStyle]::Bold)
    $headingFont = New-Object System.Drawing.Font("Segoe UI", 15, [System.Drawing.FontStyle]::Bold)
    $bodyFont = New-Object System.Drawing.Font("Segoe UI", 10, [System.Drawing.FontStyle]::Regular)
    $smallFont = New-Object System.Drawing.Font("Segoe UI", 8, [System.Drawing.FontStyle]::Regular)
    $monoFont = New-Object System.Drawing.Font("Consolas", 10, [System.Drawing.FontStyle]::Regular)

    $graphics.FillEllipse($purple, -180, -220, 760, 760)
    $graphics.DrawImage($source, 52, 34, 54, 54)
    $graphics.DrawString("CodeCarnival", $headingFont, $white, 118, 41)
    $graphics.DrawString("THEME STUDIO", $smallFont, $muted, 119, 66)
    $graphics.DrawString("Make LeetCode feel like yours.", $titleFont, $white, 52, 118)
    $graphics.DrawString("A cinematic coding world and a celebration for every Accepted.", $bodyFont, $muted, 56, 172)

    $graphics.FillRectangle($panel, 52, 220, 220, 510)
    $graphics.DrawString("SIGNATURE WORLD", $smallFont, $gold, 72, 243)
    $worlds = @("◇  Neon Web")
    for ($index = 0; $index -lt $worlds.Count; $index++) {
      $y = 280 + ($index * 58)
      if ($index -eq 0) { $graphics.FillRectangle($purple, 66, $y - 8, 192, 43) }
      $graphics.DrawString($worlds[$index], $bodyFont, $(if ($index -eq 0) { $white } else { $muted }), 78, $y)
    }
    $graphics.DrawString("+  Custom world", $bodyFont, $gold, 78, 652)

    $graphics.FillRectangle($panel, 292, 220, 936, 510)
    $graphics.FillRectangle($panelTwo, 318, 246, 884, 352)
    $graphics.DrawString("LEETCODE.COM / TWO-SUM", $smallFont, $muted, 343, 269)
    $graphics.DrawString("Two Sum", $headingFont, $white, 343, 307)
    $graphics.DrawString("Given an array of integers and a target, return the indices", $bodyFont, $muted, 343, 347)
    $graphics.DrawString("of the two numbers that add up to the target.", $bodyFont, $muted, 343, 366)
    $graphics.DrawLine($line, 738, 278, 738, 570)
    $graphics.DrawString("class Solution {", $monoFont, $mint, 775, 304)
    $graphics.DrawString("  vector<int> twoSum(...) {", $monoFont, $white, 775, 336)
    $graphics.DrawString("    // your brilliant code", $monoFont, $muted, 775, 368)
    $graphics.DrawString("  }", $monoFont, $white, 775, 400)
    $graphics.DrawString("};", $monoFont, $mint, 775, 432)
    $graphics.DrawString("◇", $titleFont, $gold, 1045, 500)
    $graphics.DrawString("NEON WEB", $smallFont, $gold, 1038, 552)

    $graphics.DrawString("Accent", $smallFont, $muted, 330, 632)
    $graphics.FillEllipse($gold, 332, 659, 26, 26)
    $graphics.DrawString("Blur   8px", $smallFont, $muted, 405, 632)
    $graphics.FillRectangle($gold, 405, 666, 145, 4)
    $graphics.DrawString("Dark overlay   55%", $smallFont, $muted, 605, 632)
    $graphics.FillRectangle($gold, 605, 666, 176, 4)
    $graphics.DrawString("✓  Victory sound        ✓  Once per problem        FULL CARNIVAL", $smallFont, $white, 846, 658)

    $bitmap.Save((Join-Path $storeRoot "screenshot-theme-studio-1280x800.png"), [System.Drawing.Imaging.ImageFormat]::Png)
    $purple.Dispose(); $panel.Dispose(); $panelTwo.Dispose(); $white.Dispose(); $muted.Dispose(); $gold.Dispose(); $mint.Dispose(); $line.Dispose()
    $titleFont.Dispose(); $headingFont.Dispose(); $bodyFont.Dispose(); $smallFont.Dispose(); $monoFont.Dispose()
  } finally {
    $source.Dispose()
    $graphics.Dispose()
    $bitmap.Dispose()
  }
}

16, 32, 48, 128 | ForEach-Object { Export-SquareIcon $_ }
Export-PromoTile
Export-StoreScreenshot
Write-Output "Built extension icons and Chrome Web Store promo tile."
