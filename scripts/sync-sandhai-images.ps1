param(
  [string]$BaseUrl = "https://www.sandhai.ae",
  [string]$OutputDir = "apps/web/public/sandhai",
  [int]$MaxPages = 120,
  [int]$MaxImages = 600
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

function Resolve-AbsoluteUrl {
  param(
    [string]$Raw,
    [string]$Base
  )

  if ([string]::IsNullOrWhiteSpace($Raw)) { return $null }
  $value = $Raw.Trim()

  if ($value.StartsWith("//")) {
    return "https:$value"
  }
  if ($value.StartsWith("http://") -or $value.StartsWith("https://")) {
    return $value
  }
  if ($value.StartsWith("/")) {
    return "$Base$value"
  }
  return "$Base/$value"
}

function Get-Matches {
  param(
    [string]$Content,
    [string]$Pattern
  )
  return [regex]::Matches($Content, $Pattern) | ForEach-Object { $_.Groups[1].Value }
}

function Normalize-Link {
  param(
    [string]$Url
  )
  if (-not $Url) { return $null }

  try {
    $uri = [System.Uri]$Url
  } catch {
    return $null
  }

  if ($uri.Host -ne "www.sandhai.ae" -and $uri.Host -ne "sandhai.ae") {
    return $null
  }

  $path = $uri.AbsolutePath.Trim()
  if ([string]::IsNullOrWhiteSpace($path)) { $path = "/" }

  if ($path -match "\.(css|js|json|ico|woff|woff2|ttf|map|xml)$") { return $null }
  if ($path -match "^/public/index\.php") { return $null }
  if ($path -match "^/images/") { return $null }
  if ($path -match "^/cache/") { return $null }
  if ($path -match "^/dashboard/") { return $null }
  if ($path -match "^/ar/|^/ta/|^/ml/") { return $null }
  if ($path -match "^/blog") { return $null }

  return "$BaseUrl$path"
}

function Get-DownloadFileName {
  param(
    [string]$AbsoluteUrl
  )
  $uri = [System.Uri]$AbsoluteUrl
  $rawName = [System.IO.Path]::GetFileName($uri.AbsolutePath)
  $name = $rawName
  if ([string]::IsNullOrWhiteSpace($name)) {
    $name = [Convert]::ToBase64String([Text.Encoding]::UTF8.GetBytes($AbsoluteUrl)).Replace("=", "") + ".jpg"
  }

  $safeName = ($name -replace "[^a-zA-Z0-9\.\-_]", "_").ToLowerInvariant()
  $prefix = [BitConverter]::ToString((New-Object Security.Cryptography.SHA1Managed).ComputeHash([Text.Encoding]::UTF8.GetBytes($AbsoluteUrl))).Replace("-", "").Substring(0, 8).ToLowerInvariant()
  return "$prefix-$safeName"
}

Write-Host "Sync start: $BaseUrl -> $OutputDir"
New-Item -ItemType Directory -Force -Path $OutputDir | Out-Null

$seedPages = @(
  "$BaseUrl/",
  "$BaseUrl/custom/sitemap",
  "$BaseUrl/groceries",
  "$BaseUrl/electronics",
  "$BaseUrl/product/fashion-items",
  "$BaseUrl/home-garden",
  "$BaseUrl/school-supplies",
  "$BaseUrl/spices",
  "$BaseUrl/pulses",
  "$BaseUrl/cooking-oil",
  "$BaseUrl/coffee",
  "$BaseUrl/tea"
)

$queue = [System.Collections.Generic.Queue[string]]::new()
$seenPages = New-Object System.Collections.Generic.HashSet[string]
$imageUrls = New-Object System.Collections.Generic.HashSet[string]

foreach ($seed in $seedPages) {
  $queue.Enqueue($seed)
}

$pageCount = 0
while ($queue.Count -gt 0 -and $pageCount -lt $MaxPages) {
  $page = $queue.Dequeue()
  if (-not $seenPages.Add($page)) { continue }

  try {
    $resp = Invoke-WebRequest -Uri $page -UseBasicParsing -TimeoutSec 30
  } catch {
    continue
  }
  $pageCount += 1
  $content = $resp.Content

  $linkValues = Get-Matches -Content $content -Pattern '(?i)href=["'']([^"'']+)["'']'
  foreach ($rawLink in $linkValues) {
    $abs = Resolve-AbsoluteUrl -Raw $rawLink -Base $BaseUrl
    $normalized = Normalize-Link -Url $abs
    if ($normalized -and -not $seenPages.Contains($normalized) -and $queue.Count -lt ($MaxPages * 3)) {
      $queue.Enqueue($normalized)
    }
  }

  $srcValues = Get-Matches -Content $content -Pattern '(?i)(?:src|data-src|data-original|content)=["'']([^"'']+)["'']'
  foreach ($rawSrc in $srcValues) {
    $abs = Resolve-AbsoluteUrl -Raw $rawSrc -Base $BaseUrl
    if (-not $abs) { continue }
    if ($abs -notmatch "(?i)\.(jpg|jpeg|png|webp|avif|gif|svg)(\?|$)") { continue }
    if ($abs -match "sprite|favicon|apple-touch-icon|payment-method|flags/") { continue }
    [void]$imageUrls.Add($abs)
  }

  $srcsetValues = Get-Matches -Content $content -Pattern '(?i)srcset=["'']([^"'']+)["'']'
  foreach ($setValue in $srcsetValues) {
    $candidate = ($setValue.Split(",")[0]).Trim().Split(" ")[0]
    $abs = Resolve-AbsoluteUrl -Raw $candidate -Base $BaseUrl
    if (-not $abs) { continue }
    if ($abs -notmatch "(?i)\.(jpg|jpeg|png|webp|avif|gif|svg)(\?|$)") { continue }
    if ($abs -match "sprite|favicon|apple-touch-icon|payment-method|flags/") { continue }
    [void]$imageUrls.Add($abs)
  }
}

$selectedImages = $imageUrls | Select-Object -First $MaxImages
$downloaded = @()

foreach ($imageUrl in $selectedImages) {
  try {
    $fileName = Get-DownloadFileName -AbsoluteUrl $imageUrl
    $target = Join-Path $OutputDir $fileName
    if (-not (Test-Path -LiteralPath $target)) {
      Invoke-WebRequest -Uri $imageUrl -OutFile $target -UseBasicParsing -TimeoutSec 30
    }
    $downloaded += [pscustomobject]@{
      source = $imageUrl
      local = "/sandhai/$fileName"
    }
  } catch {
    continue
  }
}

$manifest = [pscustomobject]@{
  baseUrl = $BaseUrl
  crawledPages = $pageCount
  uniqueImagesFound = $imageUrls.Count
  downloadedCount = $downloaded.Count
  generatedAt = (Get-Date).ToString("o")
  items = $downloaded
}

$manifestPath = Join-Path $OutputDir "manifest.json"
$manifest | ConvertTo-Json -Depth 6 | Out-File -FilePath $manifestPath -Encoding utf8

Write-Host "Crawled pages: $pageCount"
Write-Host "Found images: $($imageUrls.Count)"
Write-Host "Downloaded images: $($downloaded.Count)"
Write-Host "Manifest: $manifestPath"
